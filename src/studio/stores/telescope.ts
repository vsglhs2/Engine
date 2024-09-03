import { makeAutoObservable, when,  } from "mobx";
import { makeCounter } from "../utils";

export namespace Telescope {
    type Value = string;
    type Option = string;

    export type Options = {
        options?: Option[];
        require?: boolean;
        multiple?: boolean;
    }
    type TicketedOptions = Required<Options> & {
        ticket: number;
    };

    export type ResolvedType = 'arbitrary' |  'option' | 'options' | 'closed';
    type ResolvedPayload<Type extends ResolvedType> = {
        'arbitrary': {
            value: Value;
        };
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
        ? 'arbitrary'
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
    
        async request<O extends Options = { options: [], require: false, multiple: false }>(
            options?: O
        ) {
            const ticket = this.ticket();
            this.stack.push({
                multiple: false,
                require: false,
                options: [],
                ...options,
                ticket,
            });

            // console.log('Requested with:', this.stack[0]);

            await when(() => this.resolved?.ticket === ticket);
            delete this.resolved?.['ticket'];

            const resolved =
                this.resolved as unknown as Resolved<ResolvedTypeFrom<O>> | Resolved<'closed'>;
            this.resolved = undefined;

            // console.log('Resolved with:', resolved);

            return resolved;
        }
    }
}

export const telescope = new Telescope.Store();
