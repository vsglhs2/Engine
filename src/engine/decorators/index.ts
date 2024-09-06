import Square from "../base/renderables/square/base";
import Entity from "../entity/entity";
import { Brand, Flavor, IsBranded, IsFlavored } from "../entity/flavor";
import { Realms } from "../realm";
import InjectContext, { DecoratorSymbol } from "./inject-context";
import Serializer from "./serializer";
import { mapPrototypeChain } from "./utils/prototype";

// TODO: абстрагировать decorate от entity - сделать основой DecoratorBase

export type FilterFunctions<T extends Partial<Entity>> = Pick<
    T,
    { [Key in keyof T]: T[Key] extends Function ? never : Key }[keyof T]
>;
export type FilterMarked<T extends Partial<Entity>> = Pick<
    T,
    { [Key in keyof T]: IsFlavored<T[Key]> extends true ? never : Key }[keyof T]
>;

export type Marked<T extends EntityDerived> =
    FilterMarked<FilterFunctions<InstanceType<T>>>;
export type AbstractMarked<T extends AbstractEntityDerived> =
    FilterMarked<FilterFunctions<InstanceType<T>>>;
export type Injectables<T extends EntityDerived> = Partial<Marked<T>>;
export type Mark<T = any> = Flavor<T>;
export type Unmark<T = any> = Flavor<T>;
export type CheckInjectable<T = any> =
    IsFlavored<T> extends true
        ? T
        : T extends Entity
            ? T
            : never;
export type Constructor<
    Args extends any[] = any[],
    Instance extends any = any
> = new (...args: Args) => Instance;

export type AbstractConstructor<
    Args extends any[] = any[],
    Instance extends any = any
> = abstract new (...args: Args) => Instance;

export type AnyConstructor = Constructor | AbstractConstructor;

type FieldDecorator<TThis, TArgs> = (
    target: TThis,
    context: {
        name: string;
        metadata: ClassDecoratorContext['metadata'];
    }
) => void;

type InjectOptions = {
    optional?: boolean;
    as?: AnyConstructor;
};

export type JsonLike = Record<string, unknown>;
export class Json implements JsonLike {
    [x: string | symbol]: unknown;
}
export class Callback {
    constructor(callback: (...args: any[]) => any) {
        return callback;
    }
}
export class Any { }

// type Unshift<A extends any[]> = A extends [infer Head, ...infer _] ? Head : never;
// type Tail<A extends any[]> = A extends [infer _, ...infer Tail] ? Tail : never;
// type Skip<A extends any[], Amount extends number, Skipped extends any[] = []> =
//     Amount extends Skipped['length'] ? A : Skip<Tail<A>, Amount, [...Skipped, any]>;

type InjectType = 'injectable' | 'serializable';
type InjectPayload<Type extends InjectType> = {
    'injectable': InjectOptions;
    'serializable': SerializeOptions;
}[Type];

// type PipeNext = Flavor<'Pipe next branch'>;
// type PipeEnd<With = never> = {
//     with: With;
// } & Flavoring<'Pipe end branch'>;
// type PipeSkip<Amount extends number = 1> = {
//     amount: Amount;
// } & Flavoring<'Pipe end branch'>;
// type PipeChange<Value extends any = any, Accessor extends string | number | symbol = any> = {
//     value: Value;
//     accessor: Accessor;
// } & Flavoring<'Pipe change branch'>;
// type PipeIf<Condition extends any = any, Accessor extends string | number | symbol = any, True = PipeNext, False = PipeNext> = {
//     condition: Condition;
//     true: True;
//     false: False;
//     accessor: Accessor;
// } & Flavoring<'Pipe if branch'>;

// // Current = Unshift<Pipes> somehow doesn't work
// type Pipe<Pipes extends (any | PipeNext | PipeEnd | PipeIf)[] | never, Acc extends any[] = []> =
//     Unshift<Pipes> extends never
//         ? Acc
//         : PipeEnd extends Unshift<Pipes>
//             ? Unshift<Pipes>['with'] extends never
//                 ? Acc
//                 : Unshift<Pipes>['with']
//             : Unshift<Pipes> extends PipeNext
//                 ? Pipe<Tail<Pipes>, Acc>
//                 : PipeSkip extends Unshift<Pipes>
//                     ? Pipe<Skip<Tail<Pipes>, Unshift<Pipes>['amount']>, Acc>
//                     : Unshift<Pipes>['_floavor'] extends PipeChange['_flavor']
//                         ? Pipe<Tail<Pipes>, Omit<Acc, Unshift<Pipes>['accessor']> & { [key in Unshift<Pipes>['value']]: Unshift<Pipes>['value']}>
//                         : Unshift<Pipes>['_flavor'] extends PipeIf['_flavor']
//                             ? Pipe<[
//                                 Unshift<Pipes>[
//                                 Unshift<Pipes>['condition'] extends Acc[Unshift<Pipes>['accessor']]
//                                     ? 'true'
//                                     : 'false'
//                                 ],
//                                 ...Tail<Pipes>
//                             ], Acc>
//                             : Pipe<Tail<Pipes>, Unshift<Pipes>>;

type DecorateOptions = (Partial<Record<InjectType, InjectPayload<InjectType>>> & {
    as?: AnyConstructor;
}) | boolean;

type ExtendError<
    Key, Prefix extends string = ''
> = `[${Key extends string ? Key : 'field'}] type does not extend ${Prefix} [as] type`;

// type CheckCompitability<
//     Class extends AnyConstructor,
//     Key extends keyof InstanceType<Class>,
//     Options extends DecorateOptions,
//     Instance = NonNullable<InstanceType<Class>[Key]>
// > = Pipe<[
//     Options extends {
//         as?: infer As0,
//         injectable?: { as?: infer As1 },
//         serializable?: { as?: infer As2 }
//     } ? [
//         As0 extends AnyConstructor ? InstanceType<As0> : unknown,
//         As1 extends AnyConstructor ? InstanceType<As1> : unknown,
//         As2 extends AnyConstructor ? InstanceType<As2> : unknown,
//     ] : PipeEnd<true>,
//     PipeIf<unknown, 0, PipeNext, PipeChange<9, 0>>,
//     PipeIf<Instance, 0, PipeNext, PipeEnd<ExtendError<Key, 'options'>>>,
//     PipeIf<unknown, 1, PipeEnd>,
//     PipeIf<Instance, 1, PipeNext, PipeEnd<ExtendError<Key, 'injectable'>>>,
//     PipeIf<unknown, 2, PipeSkip<1>>,
//     PipeIf<Instance, 2, PipeNext, PipeEnd<ExtendError<Key, 'serializable'>>>,
//     PipeEnd<true>
// ]>;

type InnerCheckCompitability<
    Class extends AnyConstructor,
    Key extends keyof InstanceType<Class>,
    Options extends DecorateOptions,
    Instance = NonNullable<InstanceType<Class>[Key]>
> = Options extends {
    injectable?: { as?: infer As1 extends AnyConstructor },
    serializable?: { as?: infer As2 extends AnyConstructor }
} ? [
        As1 extends AnyConstructor 
            ? Instance extends InstanceType<As1> 
                ? never
                : ExtendError<Key, 'injectable'>
            : never,
        As2 extends AnyConstructor 
            ? Instance extends InstanceType<As2> 
                ? never
                : ExtendError<Key, 'serializable'>
            : never,
    ][number] : never;

// Somehow doesn't work without inner CheckCompitability
type CheckCompitability<
    Class extends AnyConstructor,
    Key extends keyof InstanceType<Class>,
    Options extends DecorateOptions,
> = InnerCheckCompitability<Class, Key, Options> extends never 
    ? true 
    : InnerCheckCompitability<Class, Key, Options>;

type InnerIsOptionsCompatible<
    Class extends AnyConstructor,
    Options extends DecorateInput<Class>,
    Keys extends keyof InstanceType<Class> = keyof InstanceType<Class>
> = Required<{
    // @ts-ignore
    [Key in Keys]: CheckCompitability<Class, Key, Options[Key]> extends true
        ? never
        // @ts-ignore
        : CheckCompitability<Class, Key, Options[Key]>
}>[Keys];

// Somehow doesn't work without inner CheckCompitability
type IsOptionsCompatible<
    Class extends AnyConstructor,
    Options extends DecorateInput<Class>,
> = InnerIsOptionsCompatible<Class, Options> extends never
    ? true 
    : InnerIsOptionsCompatible<Class, Options>;

type DecorateKeyInput = {
    [Type in InjectType]?: InjectPayload<Type> | boolean;
};
type NormalizedKeyInput = {
    [Type in InjectType]: Required<InjectPayload<Type>> | false;
} | false;

type DecorateInput<
    Class extends AnyConstructor = AnyConstructor, 
    Keys extends keyof AbstractMarked<Class> = keyof AbstractMarked<Class>
> = {
    [Key in Keys]?: DecorateKeyInput | boolean;
} & {
    expose?: boolean;
}

const normalizedDefaults = {
    ...injectable(Any),
    ...serializable(Any),                    
};

function isKeyInput(input: DecorateKeyInput | boolean | undefined): input is DecorateKeyInput {
    return typeof input === 'object';
}

function normalizeKeyInput(keyInput: DecorateKeyInput | boolean | undefined) {
    if (keyInput === true) return normalizedDefaults;

    if (isKeyInput(keyInput)) {
        const value = {
            ...keyInput,
        };

        if (value.injectable === true) {
            value.injectable = normalizedDefaults.injectable;
        }

        if (value.serializable === true) {
            value.serializable = normalizedDefaults.serializable;
        }

        if (value.injectable instanceof Object) {
            value.injectable = {
                ...normalizedDefaults.injectable,
                ...value.injectable,
            };
        }

        if (value.serializable instanceof Object) {
            value.serializable = {
                ...normalizedDefaults.serializable,
                ...value.serializable,
            };
        }

        if (value.injectable === undefined) value.injectable = false;
        if (value.serializable === undefined) value.serializable = false;
        
        return value as NormalizedKeyInput;
    }

    return false;
}

function normalizeInput<Input extends DecorateInput>(input: Input) {
    const keys = Reflect.ownKeys(input).filter(key => key !== 'expose');
    const expose = input.expose ?? false;

    const normalized = keys.reduce<Record<string | symbol, NormalizedKeyInput>>(
        (normalized, key) => {
            // @ts-expect-error FIXME fix type
            const normalizedInput = normalizeKeyInput(input[key]);
            normalized[key] = normalizedInput;

            return normalized;
        }, {}
    );

    return {
        expose: expose as string | false,
        keys: normalized,
    };
}

// FIXME add proper type
export type ValueDecorator = [
    key: string | symbol,
    value: (Target: AnyConstructor) => unknown,
    checker: (value: unknown) => boolean
];

export const Decorator = <Constructor extends AnyConstructor> (Constructor: Constructor) => {
    abstract class Decorator extends Constructor {
        constructor (...args: any[]) {
            super(...args);
            const { InjectStack } = Realms.active();
            
            const mappedValues = mapPrototypeChain(
                this.constructor as unknown as BrandedDecorator,
                constructor => InjectContext.global.get(constructor, DecoratorSymbol)
            );

            const fromContext: Record<string | symbol, unknown> = {};
            const checkers: Record<string | symbol, (value: unknown) => boolean> = {};

            for (let i = mappedValues.length - 1; i >= 0; i--) {
                const decorators = mappedValues[i] as ValueDecorator[] | undefined;
                if (!(decorators instanceof Array)) continue;

                const record: Record<string | symbol, unknown> = {};
                for (const [key, value, checker] of decorators) {
                    checkers[key] = checker;
                    record[key] = value(this.constructor as unknown as BrandedDecorator);
                }
                Object.assign(fromContext, record);
            }

            const fromStack = InjectStack.read();
            const toInject = {
                ...fromContext,
                ...fromStack,
            };

            for (const key in checkers) {
                const checker = checkers[key];
                const checked = checker(toInject[key]);

                if (!checked) throw new Error('Value didn\'t pass check');
            }

            Object.assign(this, toInject);
        }
    }

    type BrandedDecorator = Brand<
        typeof Decorator,
        'This is compile time only value to allow proper type checking'
    >;

    return Decorator as BrandedDecorator;
}

export type DecoratorConstructor = ReturnType<typeof Decorator>;

export const Decorate = <
    Constructor extends DecoratorConstructor,
    Input extends DecorateInput<Constructor>
>(
    decorateInput: IsOptionsCompatible<Constructor, Input> extends string 
        ? IsOptionsCompatible<Constructor, Input> 
        : Input
): ClassDecorator<Constructor> => (
    Constructor: Constructor,
    context: ClassDecoratorContext<Constructor>
) => {
    const input = normalizeInput(decorateInput as Input);  
    const { global } = InjectContext;

    if (input.expose && context.name) prepareExposable(Constructor, { as: context.name });
    if (input.expose && !context.name) throw new Error('Cannot expose unnamed class');

    const decorators: ValueDecorator[] = [];

    // @ts-ignore FIXME fix type
    for (const key of Reflect.ownKeys(input.keys)) {
        const keyInput = input.keys[key];
        if (keyInput === false) continue;
    
        if (keyInput.injectable) {
            const [value, checker] = prepareInjection(
                Constructor, 
                keyInput.injectable.as,
                key, 
                keyInput.injectable
            );
            decorators.push([key, value, checker]);            
        }
    
        if (keyInput.serializable) {
            prepareSerialization(
                Constructor, 
                keyInput.serializable.as,
                key, 
                keyInput.serializable
            );            
        }
    }

    global.set(Constructor, DecoratorSymbol, decorators);

    return Constructor;
};

export function injectable<C extends AnyConstructor>(
    as: C, 
    optional = false,
) {
    return {
        injectable: {
            as: as as C,
            optional,          
        } satisfies InjectOptions,
    };
}
export const i = injectable;

export function serializable<C extends AnyConstructor>(
    as: C
) {
    return {
        serializable: {
            as: as as C,
        } satisfies SerializeOptions,
    } 
}
export const s = serializable;

export function injectableAndSerializable<C extends AnyConstructor>(
    as: C, 
    injectable: [optional?: boolean] = [],
    serializable: [] = []
) {
    return {
        ...i(as, ...injectable),
        ...s(as, ...serializable),
    };
}
export const is = injectableAndSerializable;


export type InjectableConstructor = 
    | AnyConstructor
    | (() => [Constructor])
    | (() => [AbstractConstructor]);

// TODO: reconsider inject options as mechanics had changed
export function prepareInjection<
    TargetConstructor extends DecoratorConstructor,
    ValueConstructor extends InjectableConstructor,
    Options extends Required<InjectOptions>
>(
    Target: TargetConstructor,
    Value: ValueConstructor,
    // FIXME fix type
    key: any,
    options: Options
) {
    // @ts-expect-error FIXME Hack to determine that type is passed through callback
    // TODO: move it to normalizeInput
    const constructor: AnyConstructor = typeof Value.prototype === 'object' ? Value : Value()[0];

    const fromContext = (Target: DecoratorConstructor) => {
        const { InjectContext } = Realms.active();
        return InjectContext.get(Target, key);           
    };

    const valueChecker = (value: unknown) => {
        if (!options.optional && value === undefined)
            throw new Error(`Injectable [${constructor.name}] is missing in buffer for [${Target.name}]`);

        if (!(value instanceof constructor) && typeof value === 'object')
            throw new Error('Injectable is not instance of given type');

        // must use utility function and ensure checking cases like 99 !== Number('99')
        // @ts-expect-error FIXME fix type
        if (value != undefined && typeof value !== 'object' && value != new constructor(value))
            throw new Error('Injectable primitive is not the same type as primitive constructor');

        return true;
    }
    
    return [fromContext, valueChecker] as const;
}

type SerializeOptions = {
    as: AnyConstructor;
};

export function prepareSerialization<
    TargetConstructor extends DecoratorConstructor,
    ValueConstructor extends InjectableConstructor,
    Options extends Required<SerializeOptions>
>(
    Target: TargetConstructor,
    Value: ValueConstructor,
    // FIXME fix type
    key: any,
    options: Options
) {
    // @ts-expect-error FIXME Hack to determine that type is passed through callback
    // TODO: move it to normalizeInput
    const constructor: AnyConstructor = typeof Value.prototype === 'object' ? Value : Value()[0];

    Serializer.global.addSerializable(Target, key, constructor);
}

export type EntityDerived = Constructor<any[], Entity>;
export type AbstractEntityDerived = Constructor<any[], Entity> | AbstractConstructor<any[], Entity>;

// export const S: PropertyDecorator = (object, key) => {
//     serializer.addSerializable(object.constructor as EntityDerived, key);
// }

type ClassDecorator<TConstructor extends AnyConstructor> = (
    target: TConstructor,
    context: ClassDecoratorContext<
        TConstructor
    >
) => void;

type ExposeOptions = {
    as: string;
};

export function prepareExposable<
    TargetConstructor extends DecoratorConstructor,
    Options extends Required<ExposeOptions>
>(
    Target: TargetConstructor,
    options: Options
) {
    Serializer.global.addExposed(Target, options.as);
}

// Сделать, чтобы при new Constructor у Enttity derived классов throw new InstanceError
// Также выбрасывать ее, если в InjectContext не хватает данных