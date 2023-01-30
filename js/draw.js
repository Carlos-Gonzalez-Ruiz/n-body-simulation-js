"use strict";

// Simple draw functions.

function DrawClear() {
	graphics_context.clearRect(0, 0, graphics_canvas.width, graphics_canvas.height);
}

function DrawLine(x1, y1, x2, y2, color) {
	if (color == undefined) {
		color = "#000000";
	}
	
	graphics_context.beginPath();
	graphics_context.moveTo(x1 + graphics_canvas.width / 2, y1 + graphics_canvas.height / 2);
	graphics_context.lineTo(x2 + graphics_canvas.width / 2, y2 + graphics_canvas.height / 2);
	graphics_context.strokeStyle = color;
	graphics_context.stroke();
}

function DrawCircle(x, y, radius, color) {
	if (color == undefined) {
		color = "#000000";
	}

	graphics_context.beginPath();
	graphics_context.arc(x + graphics_canvas.width / 2, y + graphics_canvas.height / 2, radius, 0, 2 * Math.PI);
	graphics_context.fillStyle = color;
	graphics_context.strokeStyle = color;
	graphics_context.stroke();
}

function DrawCircleFill(x, y, radius, color) {
	if (color == undefined) {
		color = "#000000";
	}
	
	graphics_context.beginPath();
	graphics_context.arc(x + graphics_canvas.width / 2, y + graphics_canvas.height / 2, radius, 0, 2 * Math.PI);
	graphics_context.fillStyle = color;
	graphics_context.strokeStyle = color;
	graphics_context.fill();
}

function DrawImage(x, y, width, height, image, color, showCentered) {
	if (color == undefined) {
		color = "#FFFFFF";
	}
	
	if (showCentered != undefined && showCentered) {
		graphics_context.drawImage(	document.getElementById(image),
						x + (-width + graphics_canvas.width) / 2,
						y + (-height + graphics_canvas.height) / 2,
						width,
						height);
	} else {
		graphics_context.drawImage(	document.getElementById(image),
						x + graphics_canvas.width / 2,
						y + graphics_canvas.height / 2,
						width,
						height);
	}
}

function DrawText(x, y, text, color, fontSize, fontFamily) { // fontSize must be in pixels.
	if (color == undefined) {
		color = "#000000";
	}
	if (fontSize == undefined) {
		fontSize = 16;
	}
	if (fontFamily == undefined) {
		fontFamily = "Arial";
	}
	
	// Multiple lines must be done through "split → iteration", cAuze It'Z le sTaNDard!!!!!111!1!
	let lines = text.split("\n");
	
	for (const i in lines) {
		graphics_context.font = fontSize + "px " + fontFamily;
		graphics_context.fillStyle = color;
		graphics_context.fillText(lines[i], x + graphics_canvas.width / 2, y + graphics_canvas.height / 2 + i * fontSize);
	}
}
