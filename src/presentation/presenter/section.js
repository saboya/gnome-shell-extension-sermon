"use strict";

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Log = Me.imports.src.util.log;

/* exported SectionContainerPresenter */
class SectionContainerPresenter {
    /**
     * @param {SectionContainerView} view 
     */
    constructor(view) {
        this.LOGTAG = "SectionContainerPresenter";
        this.view = view;
        this.sections = [];
    }

    onSectionAdded(section, position) {
        Log.i(this.LOGTAG, `Add section: "${section.asString}"`);
        this.sections.push(section);
        this.view.showSection(section, position);
    }

    onDestroy() {
        this.sections.forEach(section => {
            Log.i(this.LOGTAG, `Remove section: "${section.asString}"`);
            this.view.hideSection(section);
        });
        this.sections = [];
    }
}

/* exported SectionPresenter */
class SectionPresenter {
    /**
     * @param {SectionView} view 
     * @param {string} params.title 
     */
    constructor(view, params) {
        this.LOGTAG = "SectionPresenter";
        this.view = view;
        this.items = [];

        this.view.showTitle(params.title);
    }

    onItemAdded(item) {
        Log.i(this.LOGTAG, `Add item: "${item.asString}"`);
        this.items.push(item);
        this.view.showItem(item);
    }

    onDestroy() {
        this.items.forEach(item => {
            this.view.hideItem(item);
        });
        this.items = [];
    }
}

/* exported SectionTitlePresenter */
class SectionTitlePresenter {
    /**
     * @param {SectionTitleView} view 
     * @param {string} params.text 
     * @param {St.Icon} params.icon 
     */
    constructor(view, params) {
        this.view = view;

        this.view.showText(params.text);
        this.view.showIcon(params.icon);
    }
}

/* exported SectionItemPresenter */
class SectionItemPresenter {
    /**
     * @param {SectionItemView} view 
     * @param {string} params.id 
     * @param {string} params.labelText 
     */
    constructor(view, params) {
        this.LOGTAG = "SectionItemPresenter";
        this.view = view;
        this.id = params.id;
        this.labelText = params.labelText;
        this.events = {};

        this.view.showLabel(params.labelText);
    }

    setupEvents() {
        this.events["onMouseOver"] = this.view.addMouseOverEvent();
    }

    onMouseOver() {
        Log.d(this.LOGTAG, `On mouse over: "${this.labelText}"`);
        this.view.showFullLabel();
    }

    onDestroy() {
        Object.keys(this.events).forEach((event) => {
            const id = this.events[event];
            Log.d(this.LOGTAG, `Remove "${event}" event: ${id}`);
            this.view.removeEvent(id);
        });
        this.events = {};
    }
}

/* exported ClickableSectionItemPresenter */
class ClickableSectionItemPresenter extends SectionItemPresenter {
    /**
     * @param {SectionItemView} view 
     * @param {string} params.id 
     * @param {string} params.labelText 
     */
    constructor(view, params) {
        super(view, params);
        this.LOGTAG = "ClickableSectionItemPresenter";
    }

    setupClickableEvents(running, action) {
        super.setupEvents();

        this.action = action;
        this.view.showButton(running);
        this.events["onClick"] = this.view.addButtonClickEvent();
    }

    onClick() {
        Log.d(this.LOGTAG, `On click: "${this.labelText}"`);
        this.view.hideButton();
        this.action(this.id);
    }
}
