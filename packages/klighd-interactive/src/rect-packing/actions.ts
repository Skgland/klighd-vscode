/*
 * KIELER - Kiel Integrated Environment for Layout Eclipse RichClient
 *
 * http://rtsys.informatik.uni-kiel.de/kieler
 *
 * Copyright 2020 by
 * + Kiel University
 *   + Department of Computer Science
 *     + Real-Time and Embedded Systems Group
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import {
    Action
} from 'sprotty/lib';
import { AspectRatio, RectPackDeletePositionConstraint, RectPackSetPositionConstraint } from './constraint-types';

/**
 * Send from client to server to set the aspect ratio.
 */
export class SetAspectRatioAction implements Action {
    static readonly KIND: string = 'setAspectRatio'
    readonly kind = SetAspectRatioAction.KIND

    constructor(public readonly constraint: AspectRatio) {
    }
}

/**
 * Send from client to server to delete an position constraint on a node.
 */
export class RectPackDeletePositionConstraintAction implements Action {
    static readonly KIND: string = 'rectPackDeletePositionConstraint'
    readonly kind = RectPackDeletePositionConstraintAction.KIND

    constructor(public readonly constraint: RectPackDeletePositionConstraint) {
    }
}

/**
 * Send from client to server to set a position to force a node on a specific position.
 */
export class RectPackSetPositionConstraintAction implements Action {
    static readonly KIND: string = 'rectPackSetPositionConstraint'
    readonly kind = RectPackSetPositionConstraintAction.KIND

    constructor(public readonly constraint: RectPackSetPositionConstraint) {
    }
}