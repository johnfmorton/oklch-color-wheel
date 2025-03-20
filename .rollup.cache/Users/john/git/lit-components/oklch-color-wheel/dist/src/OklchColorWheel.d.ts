import { LitElement } from 'lit';
export declare class OklchColorWheel extends LitElement {
    static styles: import("lit").CSSResult;
    header: string;
    private hue;
    private _dragging;
    private _startDrag;
    private _updateHueFromEvent;
    render(): import("lit-html").TemplateResult<1>;
}
