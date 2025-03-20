import { __decorate } from "tslib";
import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
function buildOklchConicGradient(l, c, steps) {
    const step = 360 / steps;
    const stops = [];
    for (let i = 0; i < steps; i++) {
        const angle = i * step;
        stops.push(`oklch(${l} ${c} ${angle}deg) ${angle}deg`);
    }
    // Ensure it loops fully at 360
    stops.push(`oklch(${l} ${c} 360deg) 360deg`);
    return `conic-gradient(from 90deg, ${stops.join(', ')})`;
}
export class OklchColorWheel extends LitElement {
    constructor() {
        super(...arguments);
        this.header = 'OKLCH Color Wheel';
        this.hue = 0;
        this.radius = 138;
        this._dragging = false;
        this._startDrag = (event) => {
            event.preventDefault();
            this._dragging = true;
            this._updateHueFromEvent(event);
            const moveHandler = (e) => this._updateHueFromEvent(e);
            const endHandler = () => {
                this._dragging = false;
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', endHandler);
                window.removeEventListener('touchmove', moveHandler);
                window.removeEventListener('touchend', endHandler);
            };
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', endHandler);
            window.addEventListener('touchmove', moveHandler);
            window.addEventListener('touchend', endHandler);
        };
    }
    _updateHueFromEvent(event) {
        if (!this._dragging)
            return;
        const svg = this.renderRoot.querySelector('svg');
        if (!svg)
            return;
        const rect = svg.getBoundingClientRect();
        const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
        const clientY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;
        // Offset from the center of the SVG
        const dx = clientX - (rect.left + rect.width / 2);
        const dy = clientY - (rect.top + rect.height / 2);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        this.hue = (angle + 360) % 360;
    }
    render() {
        const angleRad = (this.hue * Math.PI) / 180;
        const handleX = 150 + this.radius * Math.cos(angleRad);
        const handleY = 150 + this.radius * Math.sin(angleRad);
        const gradient = buildOklchConicGradient(0.5, 0.2, 36);
        return html `
      <h2 style="text-align:center; margin:1rem 0 0.25rem 0; padding:0;">
        ${this.header}
      </h2>
      <div style="text-align:center">
        Drag the small white circle to change the degree.
      </div>
      <div
        class="outer-wheel"
        style="
          width: 300px;
          height: 300px;
          border-radius: 0%;
          margin: 0 auto;
          position: relative;
          background: #fafafa;
        "
      >
        <svg
          width="300"
          height="300"
          style="position: absolute; top: 0; left: 0"
        >
          <circle
            cx="150"
            cy="150"
            r="${this.radius}"
            fill="oklch(50.0% 0.2 ${this.hue.toFixed(0)})"
            stroke="transparent"
          />
          <g
            class="handle-group"
            @mousedown=${this._startDrag}
            @touchstart=${this._startDrag}
          >
            <circle class="handle" cx=${handleX} cy=${handleY} r="10"></circle>
          </g>
        </svg>
        <div class="degree">${this.hue.toFixed(0)}°</div>
      </div>

      <div
        style="text-align: center; margin-bottom: 1rem; font-weight:bold; font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;"
      >
        <div
          style="
        display: inline-block;
        position: relative;
        left: -3px;
        top: 2px;
          width: 12px;
          height: 12px;
          margin-top: 1rem;
          border: 1px solid #ccc;
          background: oklch(50.0% 0.2 ${this.hue.toFixed(0)});
          "
        ></div>
        <span style="color: #767676;">oklch(&nbsp;50.0%&nbsp;0.200</span>
        <span style="color:#393939;">${this.hue.toFixed(0)}</span>
        <span style="color: #767676;">)</span>
      </div>
    `;
    }
}
OklchColorWheel.styles = css `
    :host {
      display: block;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0rem;
      touch-action: none;
      font-family: 'Arial', sans-serif;
    }
    svg {
      width: 300px;
      height: 300px;
      display: block;
      margin: 0 auto;
    }

    .handle {
      fill: white;
      stroke: black;
      stroke-width: 2;
      cursor: pointer;
    }

    .degree {
      position: absolute;
      width: 200px;
      height: 200px;
      top: 50%;
      left: calc(50% + 22px);
      transform: translate(-50%, -50%);
      font-size: 1.2rem;
      pointer-events: none; /* optional to allow clicks through */
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo,
        Consolas, 'DejaVu Sans Mono', monospace;
      font-weight: bold;
      font-size: 4.5rem;
    }
  `;
__decorate([
    property({ type: String })
], OklchColorWheel.prototype, "header", void 0);
__decorate([
    state()
], OklchColorWheel.prototype, "hue", void 0);
customElements.define('oklch-color-wheel', OklchColorWheel);
//# sourceMappingURL=OklchColorWheel.js.map