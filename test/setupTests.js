import '@testing-library/jest-dom';

// simple canvas/getContext mock
HTMLCanvasElement.prototype.getContext = function () {
  return {
    drawImage: () => {},
    clearRect: () => {},
    fillRect: () => {},
    getImageData: (x,y,w,h) => ({ data: new Uint8ClampedArray(w*h*4), width: w, height: h }),
    putImageData: () => {},
  };
};

// Mock Image to call onload immediately
class MockImage {
  constructor() {
    setTimeout(() => this.onload && this.onload(), 0);
    this.width = 100;
    this.height = 100;
  }
  set src(_) {}
}

global.Image = MockImage;
