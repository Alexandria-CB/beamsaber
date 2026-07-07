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
    screen_x = this.image_data_width_px / 2 + x;
    screen_y = this.image_data_height_px / 2 - y;

    const start = screen_y * (this.image_data_width_px * 4) + (screen_x * 4);
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

    this.image_data_width_px = width;
    this.image_data_height_px = height;
    this.image_data = this.ctx.createImageData(width, height);
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

Vec3.add = function(v1, v2) {
    return new Vec3(v1.x() + v2.x(), v1.y() + v2.y(), v1.z() + v2.z());
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

Vec4.prototype.y = function() {
    return this.values[1];
}

Vec4.prototype.z = function() {
    return this.values[2];
}

Vec4.prototype.w = function() {
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

Vec4.add = function(v1, v2) {
    return new Vec4(v1.x() + v2.x(), v1.y() + v2.y(), v1.z() + v2.z(), v1.w() + v2.w());
}

Vec4.dot = function(v1, v2) {
    return v1.x() * v2.x() + v1.y() * v2.y() + v1.z() * v2.z() + v1.w() * v2.w();
}

clamp = function(min, x, max) {
    if (x < min) {
	return min;
    }
    else if (x > max) {
	return max;
    }
    else {
	return x;
    }
}

// Scene representation
Color = function (r, g, b, a) {
    this.values[0] = clamp(0, r, 255);
    this.values[1] = clamp(0, g, 255);
    this.values[2] = clamp(0, b, 255);
    this.values[3] = clamp(0, a, 255);
}

Color.prototype = new Vec4();
Color.prototype.constructor = Color;    

Color.prototype.r = function() {
    return this.values[0];
}

Color.prototype.g = function() {
    return this.values[1];
}

Color.prototype.b = function() {
    return this.values[2];
}

Color.prototype.a = function() {
    return this.values[3];
}

Color.prototype.scale = function(x) {
    this.values[0] = clamp(0, this.values[0] * x, 255);
    this.values[1] = clamp(0, this.values[1] * x, 255);
    this.values[2] = clamp(0, this.values[2] * x, 255);
    this.values[3] = clamp(0, this.values[3] * x, 255);
}

Color.add = function(c1, c2) {
    return new Color(clamp(0, c1.r() + c2.r(), 255),
		     clamp(0, c1.g() + c2.g(), 255),
		     clamp(0, c1.b() + c2.b(), 255),
		     clamp(0, c1.a() + c2.a(), 255));
}

put_color = function (handle, x, y, color) {
    handle.putPixel(x, y, color.r(), color.g(), color.b(), color.a());
}

render_point = function (x, y) {
    c = new Color(Math.abs(4*x)%256, Math.abs(16*y)%256, Math.abs(x+y)%256, 255);
    put_color(beamsaber, x, y, c);
}

// Beamsaber interface

let beamsaber = null;
let scene = {};

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
    for (let x=-1 * beamsaber.image_data_width_px / 2; x<beamsaber.image_data_width_px / 2; x += 1) {
	for (let y=-1 * beamsaber.image_data_height_px / 2; y< beamsaber.image_data_height_px / 2; y += 1) {
	    render_point(x, y);
	}
    }

    beamsaber.blit();
    console.log("Render complete.");
}

function beamsaber_submit(type) {
    if (type === "json") {
	// Load from json code, and parse.
	console.log("Loading json data...");
	input = document.getElementById("json-input");
	try {
	    json_text = "{" + input.getElementsByClassName("code-input")[0].value + "}";
	    scene = JSON.parse(json_text);
	}
	catch (e) {
	    return console.log(e);
	}
	console.log("Scene: " + JSON.stringify(scene));
    }
    else if (type === "beamsaber") {
	// Load from custom data language, and parse.
	console.log("Loading beamsaber data...");
	console.log("beamsaber input not implemented yet...");
	scene = {};
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
