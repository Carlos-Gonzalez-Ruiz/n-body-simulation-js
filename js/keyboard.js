"use strict";

// Keyboard management.

let keyboard_pressed = {};
let keyboard_pressedPrev = {};
let keyboard_pressedCaps = {};
let keyboard_pressedCapsPrev = {};

let keyboard_Wheel_deltaY = 0;

let keyboard_Cursor_posX = 0;
let keyboard_Cursor_posY = 0;

window.onkeyup = function(e) {
	keyboard_pressed[e.key] = false;
	keyboard_pressedCaps[e.key.toUpperCase()] = false;
}
window.onkeydown = function(e) {
	keyboard_pressed[e.key] = true;
	keyboard_pressedCaps[e.key.toUpperCase()] = true;
}

function KeyboardKeys() {
	keyboard_pressedPrev = structuredClone(keyboard_pressed);
	keyboard_pressedCapsPrev = structuredClone(keyboard_pressedCaps);
	keyboard_Wheel_deltaY = 0;
}

function KeyboardCheckPressed(key) {
	return keyboard_pressedCaps[key.toUpperCase()];
}

function KeyboardCheckPressedOnce(key) {
	return keyboard_pressedCaps[key.toUpperCase()] && !keyboard_pressedCapsPrev[key.toUpperCase()];
}

function KeyboardCheckReleased(key) {
	return !keyboard_pressedCaps[key.toUpperCase()] && keyboard_pressedCapsPrev[key.toUpperCase()];
}

document.body.onwheel = function(event) {
	if (event.deltaY > 0) {
		keyboard_Wheel_deltaY = 1;
	} else if (event.deltaY < 0) {
		keyboard_Wheel_deltaY = -1;
	}
};

document.onmousemove = function(event) {
	keyboard_Cursor_posX = event.clientX;
	keyboard_Cursor_posY = event.clientY;
};
