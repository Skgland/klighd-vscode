/*
 * KIELER - Kiel Integrated Environment for Layout Eclipse RichClient
 *
 * http://rtsys.informatik.uni-kiel.de/kieler
 *
 * Copyright 2021 by
 * + Kiel University
 *   + Department of Computer Science
 *     + Real-Time and Embedded Systems Group
 *
 * This code is provided under the terms of the Eclipse Public License (EPL).
 */

import { Action } from "sprotty";

/** Data sent to the client for setting the available syntheses. */
export interface SetSynthesesActionData {
    /** The ID of the synthesis */
    id: string;
    /** The displayable name of the synthesis. */
    displayName: string;
}

/** Sent from the server to the client to send a list of all available syntheses for the current model. */
export class SetSynthesesAction implements Action {
    static readonly KIND: string = "setSyntheses";
    readonly kind = SetSynthesesAction.KIND;

    constructor(public readonly syntheses: SetSynthesesActionData[]) {}
}

/** Type predicate to narrow an action to {@link SetSynthesesAction}. */
export function isSetSynthesesAction(action: Action): action is SetSynthesesAction {
    return action.kind === SetSynthesesAction.KIND;
}

/** Sent from the client to the server to request a new diagram with the given synthesis. */
export class SetSynthesisAction implements Action {
    static readonly KIND: string = "setSynthesis";
    readonly kind = SetSynthesisAction.KIND;

    constructor(public readonly id: string) {}
}

/** Type predicate to narrow an action to {@link SetSynthesisAction}. */
export function isSetSynthesisAction(action: Action): action is SetSynthesisAction {
    return action.kind === SetSynthesisAction.KIND;
}