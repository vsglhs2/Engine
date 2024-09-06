import { makeAutoObservable, when,  } from "mobx";
import { makeCounter } from "../utils";

export namespace Telescope {
    type Value = string;
    type Option = string;

    export type Options = {
        options?: Option[];
        require?: boolean;
        multiple?: boolean;
        defaultValue?: string | null;
    }

    type TicketedOptions = Required<Options> & {
        ticket: number;
    };

    type DefaultOptions = { 
        options: [],
        require: false, 
        multiple: false, 
        defaultValue: undefined
    };

    export type ResolvedType = 'value' | 'values' |  'option' | 'options' | 'closed';
    type ResolvedPayload<Type extends ResolvedType> = {
        'value': {
            value: Value;
        };
        'values': {
            values: Value[];
        },
        'option': {
            option: Option;
        };
        'options': {
            options: Option[];
        };
        'closed': {};
    }[Type];

    export type Resolved<
        Type extends ResolvedType = ResolvedType
    > = { type: Type; } & ResolvedPayload<Type>;    

    type TicketedResolved = Resolved & {
        ticket?: number;
    };

    type ResolvedTypeFrom<O extends Options> = O['require'] extends false
        ? O['multiple'] extends true ? 'values' : 'value'
        : O['multiple'] extends true ? 'options' : 'option';

    export class Store {
        private stack: TicketedOptions[] = [];
        private resolved: TicketedResolved | undefined;
        private ticket = makeCounter(1);
        
        constructor () {
            makeAutoObservable(this);
        }
    
        resolve(resolved: Resolved) {
            const options = this.stack.shift();
            if (!options)
                throw new Error('There is no options for telescope resolve');

            this.resolved = {
                ...resolved,
                ticket: options.ticket,
            };
        }

        get head(): TicketedOptions | undefined {
            return this.stack[0];
        }
    
        // FIXME  Сделать так, чтобы при передаче только defaultValue автоматически выводился value
        async request<O extends Options = DefaultOptions>(options?: O) {
            const ticket = this.ticket();
            this.stack.push({
                multiple: false,
                require: false,
                options: [],
                defaultValue: null,
                ...options,
                ticket,
            });

            console.log('Requested with:', { ...this.stack[0] });

            await when(() => this.resolved?.ticket === ticket);
            delete this.resolved?.['ticket'];

            const resolved =
                this.resolved as unknown as Resolved<ResolvedTypeFrom<O>> | Resolved<'closed'>;
            this.resolved = undefined;

            console.log('Resolved with:', { ...resolved });

            return resolved;
        }
    }
}

export const telescope = new Telescope.Store();
