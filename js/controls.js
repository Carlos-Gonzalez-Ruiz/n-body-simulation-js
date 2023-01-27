"use strict";

let controls_dragging = false;
let controls_draggingX = 0;
let controls_draggingY = 0;

let controls_canZoom = true;

function ControlsCreation() {
	{ // Add generic listeners
		// Disallow zooming when mouse is on settings box.
		document.querySelector("div#settings").onmouseover = function() {
			controls_canZoom = false;
			controls_dragging = false; // Prevent dragging just in case.
		};
		document.querySelector("div#settings").onmouseout = function() {
			controls_canZoom = true;
		};
		
		// Drag camera position.
		document.querySelector("canvas").addEventListener("mousedown", function() {
			controls_dragging = true;
			controls_draggingX = keyboard_Cursor_posX;
			controls_draggingY = keyboard_Cursor_posY;
		});
		document.querySelector("canvas").addEventListener("mousemove", function() {
			if (controls_dragging) {
				sim_Ui_cameraPosX += (keyboard_Cursor_posX - controls_draggingX) * sim_Ui_particleFactor;
				sim_Ui_cameraPosY += (keyboard_Cursor_posY - controls_draggingY) * sim_Ui_particleFactor;
				controls_draggingX = keyboard_Cursor_posX;
				controls_draggingY = keyboard_Cursor_posY;
			}
		});
		document.querySelector("canvas").addEventListener("mouseup", function() {
			controls_dragging = false;
		});
	}
	
	{ // Settings menu.
		document.querySelector("div#openSettings").onclick = function() {
			document.querySelector("div#settings").classList.add("show");
			document.querySelector("div#openSettings").classList.add("show");
		};
		document.querySelector("button#closeSettings").onclick = function() {
			document.querySelector("div#settings").classList.remove("show");
			document.querySelector("div#openSettings").classList.remove("show");
		};
	}
	
	{ // Set webpage content.
		// Gravity
		document.querySelector("input[type='number']#getGravity").value = sim_gravity;
		document.querySelector("input[type='number']#getGravity").placeholder = sim_gravity;
		document.querySelector("button#setGravity").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getGravity");
			
			sim_gravity = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Pause time
		document.querySelector("button#pause").onclick = function() {
			SimStopTime();
		};
		
		// Time factor
		document.querySelector("input[type='number']#getTimeFactor").value = sim_timeFactor;
		document.querySelector("input[type='number']#getTimeFactor").placeholder = sim_timeFactor;
		document.querySelector("button#setTimeFactor").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getTimeFactor");
			
			sim_timeFactor = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Camera pos X
		document.querySelector("input[type='number']#getCameraPosX").value = sim_Ui_cameraPosX;
		document.querySelector("input[type='number']#getCameraPosX").placeholder = sim_Ui_cameraPosX;
		document.querySelector("button#setCameraPosX").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getCameraPosX");
			
			sim_Ui_cameraPosX = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Camera pos Y
		document.querySelector("input[type='number']#getCameraPosY").value = sim_Ui_cameraPosY;
		document.querySelector("input[type='number']#getCameraPosY").placeholder = sim_Ui_cameraPosY;
		document.querySelector("button#setCameraPosY").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getCameraPosY");
			
			sim_Ui_cameraPosY = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Camera speed
		document.querySelector("input[type='number']#getCameraSpeed").value = sim_Ui_cameraSpeed;
		document.querySelector("input[type='number']#getCameraSpeed").placeholder = sim_Ui_cameraSpeed;
		document.querySelector("button#setCameraSpeed").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getCameraSpeed");
			
			sim_Ui_cameraSpeed = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Zoom speed
		document.querySelector("input[type='number']#getZoomSpeed").value = sim_Ui_factorSpeed;
		document.querySelector("input[type='number']#getZoomSpeed").placeholder = sim_Ui_factorSpeed;
		document.querySelector("button#setZoomSpeed").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getZoomSpeed");
			
			sim_Ui_factorSpeed = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Particle size
		document.querySelector("span#size").innerHTML = sim_Ui_particleSize;
		document.querySelector("input[type='number']#particleSizeIncrement").value = 1;
		document.querySelector("button#moreSize").onclick = function() {
			sim_Ui_particleSize += Number(document.querySelector("input[type='number']#particleSizeIncrement").value);
			
			document.querySelector("span#size").innerHTML = sim_Ui_particleSize;
		};
		document.querySelector("button#lessSize").onclick = function() {
			if (sim_Ui_particleSize > 0.01) {
				sim_Ui_particleSize -= Number(document.querySelector("input[type='number']#particleSizeIncrement").value);
			} else {
				sim_Ui_particleSize = 0.01;
			}
			
			document.querySelector("span#size").innerHTML = sim_Ui_particleSize;
		};
		
		// Particle line count
		document.querySelector("input[type='number']#getParticleLineCount").value = sim_Ui_particleLineCount;
		document.querySelector("input[type='number']#getParticleLineCount").placeholder = sim_Ui_particleLineCount;
		document.querySelector("button#setParticleLineCount").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getParticleLineCount");
			
			sim_Ui_particleLineCount = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Particle line rate
		document.querySelector("input[type='number']#getParticleLineRate").value = sim_Ui_particleLineRate;
		document.querySelector("input[type='number']#getParticleLineRate").placeholder = sim_Ui_particleLineRate;
		document.querySelector("button#setParticleLineRate").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getParticleLineRate");
			
			sim_Ui_particleLineRate = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Frustrum culling
		document.querySelector("input[type='checkbox']#frustrumCulling").checked = sim_Ui_frustrumCulling;
		document.querySelector("input[type='checkbox']#frustrumCulling").onchange = function(e) {
			sim_Ui_frustrumCulling = e.target.checked;
		};
		
		// Canvas coordinate translation
		document.querySelector("select#yTrans").value = sim_Ui_cameraTransX;
		document.querySelector("select#xTrans").onchange = function(e) {
			sim_Ui_cameraTransX = e.target.value;
		};
		
		document.querySelector("select#yTrans").value = sim_Ui_cameraTransY;
		document.querySelector("select#yTrans").onchange = function(e) {
			sim_Ui_cameraTransY = e.target.value;
		};
		
		// Show image (sim_Ui_drawAsFlare)
		document.querySelector("input[type='checkbox']#showImage").checked = sim_Ui_drawAsFlare;
		document.querySelector("input[type='checkbox']#showImage").onchange = function(e) {
			sim_Ui_drawAsFlare = e.target.checked;
		};
		
		// Show grid
		document.querySelector("input[type='checkbox']#showGrid").checked = sim_Ui_gridDraw;
		document.querySelector("input[type='checkbox']#showGrid").onchange = function(e) {
			sim_Ui_gridDraw = e.target.checked;
		};
		
		// Grid size
		document.querySelector("input[type='number']#getGridSize").value = sim_Ui_gridSize;
		document.querySelector("input[type='number']#getGridSize").placeholder = sim_Ui_gridSize;
		document.querySelector("button#setGridSize").onclick = function(e) {
			let input = document.querySelector("input[type='number']#getGridSize");
			
			sim_Ui_gridSize = !!input.value ? Number(input.value) : input.placeholder;
		}
		
		// Grid Color
		document.querySelector("input[type='color']#gridColor").value = sim_Ui_gridColor;
		document.querySelector("input[type='color']#gridColor").onchange = function(e) {
			sim_Ui_gridColor = e.target.value;
		};
		
		// Background color
		document.querySelector("input[type='color']#backgroundColor").value = "#FFFFFF";
		document.querySelector("input[type='color']#backgroundColor").onchange = function(e) {
			graphics_canvas.style.backgroundColor = e.target.value;
		};
		
		// Text color
		document.querySelector("input[type='color']#textColor").value = sim_Ui_textColor;
		document.querySelector("input[type='color']#textColor").onchange = function(e) {
			sim_Ui_textColor = e.target.value;
		};
	}
}

function ControlsUpdate() {
	// Key handling
	if (KeyboardCheckPressed('W') || KeyboardCheckPressed('ArrowUp')) {
		sim_Ui_cameraPosY += sim_Ui_cameraSpeed * sim_Ui_particleFactor;
	}
	if (KeyboardCheckPressed('S') || KeyboardCheckPressed('ArrowDown')) {
		sim_Ui_cameraPosY -= sim_Ui_cameraSpeed * sim_Ui_particleFactor;
	}
	if (KeyboardCheckPressed('A') || KeyboardCheckPressed('ArrowLeft')) {
		sim_Ui_cameraPosX += sim_Ui_cameraSpeed * sim_Ui_particleFactor;
	}
	if (KeyboardCheckPressed('D') || KeyboardCheckPressed('ArrowRight')) {
		sim_Ui_cameraPosX -= sim_Ui_cameraSpeed * sim_Ui_particleFactor;
	}
	if (KeyboardCheckPressedOnce('F1')) {
		SimStopTime();
	}
	
	if (controls_canZoom) {
		if (keyboard_Wheel_deltaY > 0) {
			sim_Ui_particleFactor *= sim_Ui_factorSpeed + 1;
			
			sim_Ui_cameraPosX += (keyboard_Cursor_posX - graphics_canvas.width / 2) * sim_Ui_particleFactor * sim_Ui_factorSpeed;
			sim_Ui_cameraPosY += (keyboard_Cursor_posY - graphics_canvas.height / 2) * sim_Ui_particleFactor * sim_Ui_factorSpeed;
		} else if (keyboard_Wheel_deltaY < 0) {
			sim_Ui_particleFactor /= sim_Ui_factorSpeed + 1;
			if (sim_Ui_particleFactor < 0) {
				sim_Ui_particleFactor = 1;
			}
			
			sim_Ui_cameraPosX -= (keyboard_Cursor_posX - graphics_canvas.width / 2) * sim_Ui_particleFactor * sim_Ui_factorSpeed;
			sim_Ui_cameraPosY -= (keyboard_Cursor_posY - graphics_canvas.height / 2) * sim_Ui_particleFactor * sim_Ui_factorSpeed;
		}
	}
	
	if (sim_Ui_gridDraw) {
		let	size = sim_Ui_gridSize / sim_Ui_particleFactor,
			amountX = Math.round(graphics_canvas.width / size / 2),
			amountY = Math.round(graphics_canvas.height / size / 2),
			offsetX = (sim_Ui_cameraPosX / sim_Ui_particleFactor) % size,
			offsetY = (sim_Ui_cameraPosY / sim_Ui_particleFactor) % size;
		
		// X axis
		for (let x = -amountX; x < amountX + 1; ++x) {
			DrawLine(	offsetX + x * size,
					-graphics_canvas.height / 2,
					offsetX + x * size,
					graphics_canvas.height / 2,
					sim_Ui_gridColor);
		}
		// Y axis
		for (let y = -amountY; y < amountY + 1; ++y) {
			DrawLine(	-graphics_canvas.width / 2,
					offsetY + y * size,
					graphics_canvas.width / 2,
					offsetY + y * size,
					sim_Ui_gridColor);
		}
	}
	
	DrawText(graphics_canvas.width - 190, 16, "N-Body simulation JS test", sim_Ui_textColor, 16);
	
	DrawText(	0, 16,
			"X = " + sim_Ui_cameraPosX + ";\n" +
			"Y = " + sim_Ui_cameraPosY + ";",
			sim_Ui_textColor, 16);
	DrawText(0, graphics_canvas.height - 4, "Elapsed Time: " + sim_time, sim_Ui_textColor, 16);
}
