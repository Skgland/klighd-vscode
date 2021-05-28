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

/** @jsx html */
import { html } from "snabbdom-jsx";
import { VNode } from "snabbdom/vnode";
import { inject, injectable, postConstruct } from "inversify";
import { AbstractUIExtension, Patcher, PatcherProvider, TYPES } from "sprotty";
import { OptionsRegistry } from "./options-registry";

@injectable()
export class OptionsPanel extends AbstractUIExtension {
    static readonly ID = "options-panel";

    private patcher: Patcher;
    private node: VNode;
    private content: number = 0;

    @inject(TYPES.PatcherProvider) patcherProvider: PatcherProvider;
    @inject(OptionsRegistry) optionsRegistry: OptionsRegistry;

    @postConstruct()
    init() {
        this.patcher = this.patcherProvider.patcher;
    }

    id(): string {
        return OptionsPanel.ID;
    }

    containerClass(): string {
        return `${OptionsPanel.ID}-container`;
    }

    protected onBeforeShow(): void {
        this.content++;
        this.node = this.patcher(this.node, this.getJSXContent());
    }

    protected initializeContents(containerElement: HTMLElement): void {
        // Snabbdom's patch does not work directly on the containerElement (guess it does not count as empty... :shrug:)
        const jsxRoot = document.createElement("div");
        const title = document.createElement("h4");
        title.classList.add("options-panel__title");
        title.innerText = "Options";

        this.node = this.patcher(jsxRoot, this.getJSXContent());

        containerElement.appendChild(title);
        containerElement.appendChild(jsxRoot);

        // Notice that AbstractUIExtension only calls initializeContents once, so this handler is also only registered once.
        this.addClickOutsideListenser(containerElement);
    }

    private getJSXContent(): VNode {
        return (
            <div class={{ "options-panel__content": true }}>
                <p>Panel has been opened <strong>{this.content}</strong> time(s).</p>
                <hr />
                <p>Amount of synthesis options: {this.optionsRegistry.valuedSynthesisOptions.length}</p>
                <p>Amount of layout options: {this.optionsRegistry.layoutOptions.length}</p>
                <p>Amount of displayed actions: {this.optionsRegistry.displayedActions.length}</p>
            </div>
        );
    }

    /**
     * Register a click outside handler that hides the content when a user click outsides.
     * Using "mousedown" instead of "click" also hides the panel as soon as the user starts
     * dragging the diagram.
     */
    private addClickOutsideListenser(containerElement: HTMLElement): void {
        document.addEventListener("mousedown", (e) => {
            // See for information on detecting "click outside": https://stackoverflow.com/a/64665817/7569889
            if (!this.activeElement || e.composedPath().includes(containerElement)) return;

            this.hide();
        });
    }
}
