import type { Interactable } from '@interactjs/core/Interactable';
import type { OptionsArg, Options } from '@interactjs/core/options';
import type { Scope } from '@interactjs/core/scope';
import type { Target, Context } from '@interactjs/core/types';
declare module '@interactjs/core/scope' {
    interface SignalArgs {
        'interactable:new': {
            interactable: Interactable;
            target: Target;
            options: OptionsArg;
            win: Window;
        };
    }
}
interface InteractableScopeProp {
    context: Context;
    interactable: Interactable;
}
export declare class InteractableSet {
    list: Interactable[];
    selectorMap: {
        [selector: string]: InteractableScopeProp[];
    };
    scope: Scope;
    constructor(scope: Scope);
    new(target: Target, options?: any): Interactable;
    get(target: Target, options?: Options): Interactable;
    forEachMatch<T>(node: Node, callback: (interactable: Interactable) => T): T | void;
}
export {};
