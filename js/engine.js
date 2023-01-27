"use strict";

// Engine functions.

function EngineCreation() {
	SimCreation();
}

function EngineLoop() {
	DrawClear();
	
	SimRendering();
	
	KeyboardKeys();
}
