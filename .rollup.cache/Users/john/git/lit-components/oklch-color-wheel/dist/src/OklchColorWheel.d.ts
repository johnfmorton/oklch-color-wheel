import { LitElement } from 'lit';
export declare class OklchColorWheel extends LitElement {
    static styles: import("lit").CSSResult;
    header: string;
    private hue;
    private radius;
    private _dragging;
    private _updateHueFromEvent;
    private _startDrag;
    render(): import("lit-html").TemplateResult<1>;
}
