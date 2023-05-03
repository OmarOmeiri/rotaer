/* eslint-disable @typescript-eslint/no-non-null-assertion */
export class GMapsPopup {
  position: google.maps.LatLng;
  containerDiv: HTMLDivElement;
  overlay: google.maps.OverlayView;

  constructor(position: google.maps.LatLng, content: HTMLElement, overlay: google.maps.OverlayView) {
    this.position = position;
    this.overlay = overlay;

    content.classList.add('popup-bubble');

    // This zero-height div is positioned at the bottom of the bubble.
    const bubbleAnchor = document.createElement('div');

    bubbleAnchor.classList.add('popup-bubble-anchor');
    bubbleAnchor.appendChild(content);

    // This zero-height div is positioned at the bottom of the tip.
    this.containerDiv = document.createElement('div');
    this.containerDiv.classList.add('popup-container');
    this.containerDiv.appendChild(bubbleAnchor);

    // Optionally stop clicks, etc., from bubbling up to the map.
    Object.getPrototypeOf(this.overlay).constructor.preventMapHitsAndGesturesFrom(this.containerDiv);
  }

  /** Called when the popup is added to the map. */
  onAdd() {
    this.overlay.getPanes()!.floatPane.appendChild(this.containerDiv);
  }

  /** Called when the popup is removed from the map. */
  onRemove() {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv);
    }
  }

  /** Called each frame when the popup needs to draw itself. */
  draw() {
    const divPosition = this.overlay.getProjection().fromLatLngToDivPixel(
      this.position,
    )!;

    // Hide the popup when it is far out of view.
    const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
      ? 'block'
      : 'none';

    if (display === 'block') {
      this.containerDiv.style.left = `${divPosition.x}px`;
      this.containerDiv.style.top = `${divPosition.y}px`;
    }

    if (this.containerDiv.style.display !== display) {
      this.containerDiv.style.display = display;
    }
  }
}
