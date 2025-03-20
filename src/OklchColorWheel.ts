import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export class OklchColorWheel extends LitElement {
  static styles = css`
    :host {
      display: block;
      /* Let the component shrink or grow while never exceeding 300px */
      width: 100%;
      /* max-width: 300px; */
      /* Keeps aspect ratio 1:1 for a perfect square */
      /* aspect-ratio: 1/1; */
      position: relative;
    }

    .wrapper {
      /* max-width: 300px; */
      display: block;
      /* border: 1px solid #e7e7e7; */
      border-radius: 4px;
      padding: 0.5rem;
      font-family: 'Arial', sans-serif;
    }

    svg {
      /* Make the SVG fill the host container */
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .handle {
      fill: white;
      stroke: black;
      stroke-width: 2;
      cursor: pointer;
    }

    .degree {
      /* Absolutely centered text inside the host container */
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      text-align: center;
      color: white;
      font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo,
        Consolas, 'DejaVu Sans Mono', monospace;
      font-weight: bold;
    }

    @media (max-width: 400px) {
      .degree {
        font-size: 3rem;
        left: calc(50% + 15px);
        /* simpler style for small wrapper */
      }
    }

    @media (min-width: 401px) {
      .degree {
        font-size: 4.25rem;
        left: calc(50% + 22px);
        /* or anything else for bigger wrapper */
      }
    }
  `;

  @property({ type: String }) header = 'OKLCH Color Wheel';

  @state() private hue = 0;
  private _dragging = false;

  private _startDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this._dragging = true;
    this._updateHueFromEvent(event);

    const moveHandler = (e: MouseEvent | TouchEvent) =>
      this._updateHueFromEvent(e);
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
  }

  private _updateHueFromEvent(event: MouseEvent | TouchEvent) {
    if (!this._dragging) return;

    const svg = this.renderRoot.querySelector('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }

    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    this.hue = (angle + 360) % 360;
  }

  render() {
    // Convert hue to radians to place the handle
    const angleRad = (this.hue * Math.PI) / 180;
    // 140 radius matches 300 viewBox. Adjust radius or viewBox if you want a margin.
    const handleX = 150 + 137 * Math.cos(angleRad);
    const handleY = 150 + 137 * Math.sin(angleRad);

    return html`
      <div class="wrapper">
        <h2 style="text-align:center; margin:1rem 0 0.25rem 0; padding:0;">
          ${this.header}
        </h2>
        <div
          style="text-align:center; font-size:0.9rem; margin-bottom:0; color:#666;"
        >
          Drag the white circle to change the degree.
        </div>

        <div
          class="outer-wheel"
          style="
          max-width: 300px;
          height: 300px;
          border-radius: 0%;
          margin: 0 auto;
          position: relative;
        "
        >
          <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
            <!-- The circle is 300 in diameter to match the entire viewBox -->
            <circle
              cx="150"
              cy="150"
              r="137"
              fill="oklch(50.0% 0.2 ${this.hue.toFixed(0)})"
              stroke="lightgray"
            ></circle>
            <g
              class="handle-group"
              @mousedown=${this._startDrag}
              @touchstart=${this._startDrag}
            >
              <circle
                class="handle"
                cx=${handleX}
                cy=${handleY}
                r="10"
              ></circle>
            </g>
          </svg>
          <div class="degree">${this.hue.toFixed(0)}°</div>
        </div>

        <div
          style="text-align: center; margin-bottom: 1rem; font-weight:bold; font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace; white-space: normal; word-break: break-all;"
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
      </div>
    `;
  }
}

customElements.define('oklch-color-wheel', OklchColorWheel);
