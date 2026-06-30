// Gfx pixel plotting interface

Gfx = function (canvas_id, width_px, height_px) {
  this.canvas = document.getElementById(canvas_id);
  if (! this.canvas) {
    console.log("No canvas with id: " + canvas_id);
    return;
  }
  this.ctx = this.canvas.getContext("2d");
  this.resizeCanvas();
  this.image_data_width_px = width_px;
  this.image_data_height_px = height_px;
  this.image_data = this.ctx.createImageData(width_px, height_px);
}

Gfx.prototype.blit = function () {
  this.ctx.putImageData(this.image_data, 0, 0);
}

Gfx.prototype.putPixel = function (x, y, r, g, b, a) {
  const start = y * (this.image_data_width_px * 4) + (x * 4);
  const red_index   = start + 0;
  const green_index = start + 1;
  const blue_index  = start + 2;
  const alpha_index = start + 3;

  this.image_data.data[red_index]   = r;
  this.image_data.data[green_index] = g;
  this.image_data.data[blue_index]  = b;
  this.image_data.data[alpha_index] = a;
}

Gfx.prototype.resizeCanvas = function () {
  const width = this.canvas.clientWidth;
  const height = this.canvas.clientHeight;

  if (this.canvas.width !== width || this.canvas.height !== height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

Gfx.prototype.clear = function() {
  console.log("Clearing the screen...");
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.image_data = this.ctx.createImageData(this.image_data_width_px, this.image_data_height_px);
  this.blit();
}

// Matrix math interface

// Beamsaber interface

beamsaber = null;

function beamsaber_init() {
  console.log("Initializing GFX");
  beamsaber = new Gfx("render-canvas", 640, 480);
  beamsaber.clear();
}

function beamsaber_render() {
  console.log("Rendering...");
  beamsaber.clear();
  for (let x=0; x<640; x += 1) {
    for (let y=0; y<480; y += 1) {
      beamsaber.putPixel(x, y, x%256, y%256, x%256, y%256);
    }
  }

  beamsaber.blit();
  console.log("Render complete.");
}
