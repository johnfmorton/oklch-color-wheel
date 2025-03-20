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
  `;

  @property({ type: String }) header = 'OKLCH Color Wheel';

  @state() private hue: number = 0;
  private center = { x: 150, y: 150 };
  private radius = 100;

  private _updateHueFromEvent(event: MouseEvent | TouchEvent) {
    const clientX = (event instanceof TouchEvent ? event.touches[0].clientX : event.clientX);
    const clientY = (event instanceof TouchEvent ? event.touches[0].clientY : event.clientY);
    const rect = this.getBoundingClientRect();
    const dx = clientX - (rect.left + this.center.x);
    const dy = clientY - (rect.top + this.center.y);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    this.hue = (angle + 360) % 360;
  }

  private _startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    this._updateHueFromEvent(event);
    const moveHandler = (e: MouseEvent | TouchEvent) => this._updateHueFromEvent(e);
    const endHandler = () => {
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
    const handleX = this.center.x + this.radius * Math.cos(angleRad);
    const handleY = this.center.y + this.radius * Math.sin(angleRad);

    return html`
      <h2>${this.header}</h2>
      <svg @mousedown=${this._startDrag} @touchstart=${this._startDrag}>
        <circle cx=${this.center.x} cy=${this.center.y} r=${this.radius} fill="conic-gradient placeholder" />
        <circle class="handle" cx=${handleX} cy=${handleY} r="10"></circle>
      </svg>
      <p>Hue: ${this.hue.toFixed(0)}°</p>
    `;
  }
}

customElements.define('oklch-color-wheel', OklchColorWheel);
