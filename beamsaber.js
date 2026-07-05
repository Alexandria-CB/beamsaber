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

Vec3 = function (a, b, c) {
    this.values = [a, b, c];
}

Vec3.prototype.x = function() {
    return this.values[0];
}

Vec3.prototype.r = function() {
    return this.values[0];
}

Vec3.prototype.y = function() {
    return this.values[1];
}

Vec3.prototype.g = function() {
    return this.values[1];
}

Vec3.prototype.z = function() {
    return this.values[2];
}

Vec3.prototype.b = function() {
    return this.values[2];
}

Vec3.prototype.mag = function() {
    return Math.sqrt(this.values[0] * this.values[0] +
		     this.values[1] * this.values[1] +
		     this.values[2] * this.values[2]);
}

Vec3.prototype.scale = function(factor) {
    this.values[0] *= factor;
    this.values[1] *= factor;
    this.values[2] *= factor;
}

Vec3.prototype.norm = function() {
    this.scale(1/this.mag());
}

Vec3.dot = function(v1, v2) {
    return v1.x() * v2.x() + v1.y() * v2.y() + v1.z() * v2.z();
}

Vec3.cross = function(v1, v2) {
    i = v1.y() * v2.z() - v1.z() * v2.y();
    j = v1.z() * v2.x() - v1.x() * v2.z();
    k = v1.x() * v2.y() - v1.y() * v2.x();
    return new Vec3(i, j, k);
}

Vec4 = function (a, b, c, d) {
  this.values = [a, b, c, d];
}

Vec4.prototype.x = function() {
  return this.values[0];
}

Vec4.prototype.r = function() {
  return this.values[0];
}

Vec4.prototype.y = function() {
  return this.values[1];
}

Vec4.prototype.g = function() {
  return this.values[1];
}

Vec4.prototype.z = function() {
  return this.values[2];
}

Vec4.prototype.b = function() {
  return this.values[2];
}

Vec4.prototype.w = function() {
  return this.values[3];
}

Vec4.prototype.a = function() {
  return this.values[3];
}

Vec4.prototype.mag = function() {
    return Math.sqrt(this.values[0] * this.values[0],
		     this.values[1] * this.values[1],
		     this.values[2] * this.values[2],
		     this.values[3] * this.values[3]);
}

Vec4.prototype.scale = function(factor) {
    this.values[0] *= factor;
    this.values[1] *= factor;
    this.values[2] *= factor;
    this.values[3] *= factor;
}

Vec4.prototype.norm = function() {
    this.scale(1/this.mag());
}

Vec4.dot = function(v1, v2) {
  return v1.x() * v2.x() + v1.y() * v2.y() + v1.z() * v2.z() + v1.w() * v2.w();
}

// Scene representation

// Beamsaber interface

let beamsaber = null;

const default_input_mode = "json"; // Change to beamsaber once it's implemented.

const input_modes = [ "json", "beamsaber" ];

function beamsaber_init() {
  console.log("Initializing GFX");
  beamsaber = new Gfx("render-canvas", 640, 480);
    beamsaber.clear();
    beamsaber_set_input(default_input_mode);
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

function beamsaber_submit(type) {
    if (type === "json") {
	// Load from json code, and parse.
	console.log("Loading json data...");
    }
    else if (type === "beamsaber") {
	// Load from custom data language, and parse.
	console.log("Loading beamsaber data...");
    }
    else {
	alert("Invalid render type!");
    }
}

function beamsaber_set_input(mode) {
    let valid = false;
    for (let i=0; i<input_modes.length; i++) {
	e = document.getElementById(input_modes[i] + "-input");
	if (mode === input_modes[i]) {
	    console.log("Enabling " + mode + " input.");
	    e.style.display = "inline";
	    valid = true;
	}
	else {
	    console.log("Hiding " + input_modes[i] + " input.");
	    e.style.display = "none";
	}
    }

    if (!valid) {
	console.log("No supported mode \"" + mode + "\".");
	document.getElementById(default_input_mode + "-input").style.display = "inline";
    }
}
