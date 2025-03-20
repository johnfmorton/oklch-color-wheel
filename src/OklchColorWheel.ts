import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

export class OklchColorWheel extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      touch-action: none;
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
    .color-wheel {
      position: relative;
      width: 300px;
      height: 300px;
      margin: 0 auto;
    }
  `;

  @property({ type: String }) header = 'OKLCH Color Wheel';

  @state() private hue: number = 0;
  private radius = 100;
  private _dragging = false;

  private _updateHueFromEvent(event: MouseEvent | TouchEvent) {
    if (!this._dragging) return;

    const svg = this.renderRoot.querySelector('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const clientX = (event instanceof TouchEvent ? event.touches[0].clientX : event.clientX);
    const clientY = (event instanceof TouchEvent ? event.touches[0].clientY : event.clientY);

    // Offset from the center of the SVG
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    this.hue = (angle + 360) % 360;
  }

  private _startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    this._dragging = true;
    this._updateHueFromEvent(event);

    const moveHandler = (e: MouseEvent | TouchEvent) => this._updateHueFromEvent(e);
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

  render() {
    const angleRad = (this.hue * Math.PI) / 180;
    const handleX = 150 + this.radius * Math.cos(angleRad);
    const handleY = 150 + this.radius * Math.sin(angleRad);

    return html`
      <h2>${this.header}</h2>
      <div class="color-wheel">
        <svg>
          <circle
            cx="150"
            cy="150"
            r="${this.radius}"
            fill="conic-gradient placeholder"
          />
          <g
            class="handle-group"
            @mousedown=${this._startDrag}
            @touchstart=${this._startDrag}
          >
            <circle class="handle" cx=${handleX} cy=${handleY} r="10"></circle>
          </g>
        </svg>
      </div>
      <p>Hue: ${this.hue.toFixed(0)}°</p>
    `;
  }
}

customElements.define('oklch-color-wheel', OklchColorWheel);
