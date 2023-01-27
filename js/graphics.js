"use strict";

// Graphics variables.

let graphics_canvas = document.querySelector("canvas");
let graphics_context = graphics_canvas.getContext('2d');

graphics_canvas.width = document.body.clientWidth;
graphics_canvas.height = document.body.clientHeight;
window.addEventListener('resize', function(event) {
	graphics_canvas.width = document.body.clientWidth;
	graphics_canvas.height = document.body.clientHeight;
});
