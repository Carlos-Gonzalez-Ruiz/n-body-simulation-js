"use strict";

// UI Controls.

let controls_dragging = false;
let controls_draggingX = 0;
let controls_draggingY = 0;

let controls_canZoom = true;

let controls_hasMoved = false;

function ControlsCreation() {
	{ // Add generic listeners.
		// Disallow zooming when mouse is on contents box.
		document.querySelector("div#contents").onmouseover = function() {
			controls_canZoom = false;
			controls_dragging = false; // Prevent dragging just in case.
		};
		document.querySelector("div#contents").onmouseout = function() {
			controls_canZoom = true;
		};
		
		// Drag camera position and add particle implementation.
		document.querySelector("canvas").addEventListener("mousedown", function(e) {
			switch (e.which) {
				case 1: // Left mouse button.
					if (KeyboardCheckPressed("Control") && sim_Ui_mode == "add") {
						let	posX = 0, posY = 0, posZ = 0;
						
						switch (sim_Ui_cameraTransX) {
							case 'x':
								posX = -sim_Ui_cameraPosX + (keyboard_Cursor_posX - graphics_canvas.width / 2) * sim_Ui_particleFactor;
							break;
							case 'y':
								posY = -sim_Ui_cameraPosX + (keyboard_Cursor_posX - graphics_canvas.width / 2) * sim_Ui_particleFactor;
							break;
							case 'z':
								posZ = -sim_Ui_cameraPosX + (keyboard_Cursor_posX - graphics_canvas.width / 2) * sim_Ui_particleFactor;
							break;
						}
						
						switch (sim_Ui_cameraTransY) {
							case 'x':
								posX = -sim_Ui_cameraPosY + (keyboard_Cursor_posY - graphics_canvas.height / 2) * sim_Ui_particleFactor;
							break;
							case 'y':
								posY = -sim_Ui_cameraPosY + (keyboard_Cursor_posY - graphics_canvas.height / 2) * sim_Ui_particleFactor;
							break;
							case 'z':
								posZ = -sim_Ui_cameraPosY + (keyboard_Cursor_posY - graphics_canvas.height / 2) * sim_Ui_particleFactor;
							break;
						}
						
						let particle = new Particle(	Number(posX), Number(posY), Number(posZ),
										Number(document.querySelector("input#getNewParticleSpeedX").value),
										Number(document.querySelector("input#getNewParticleSpeedY").value),
										Number(document.querySelector("input#getNewParticleSpeedZ").value),
										Number(document.querySelector("input#getNewParticleMass").value),
										document.querySelector("input#getNewParticleColor").value,
										document.querySelector("input#getNewParticleName").value);
						SimParticleAdd(particle);
					} else {
						// Prevent user from dragging when hovering particle.
						if (!sim_Ui_particleHovering) {
							controls_dragging = true;
							controls_draggingX = keyboard_Cursor_posX;
							controls_draggingY = keyboard_Cursor_posY;
						}
						
						// Inform that camera has moved position.
						controls_hasMoved = true;
					}
					
					// Inform about left mouse button being pressed.
					keyboard_Cursor_leftPressed = true;
				break;
				case 2: // Middle mouse button.
					
				break;
				case 3: // Right mouse button.
					
				break;
			}
		});
		document.querySelector("canvas").addEventListener("mousemove", function(e) {
			if (e.which == 1) { // Left mouse button.
				if (controls_dragging) {
					sim_Ui_cameraPosX += (keyboard_Cursor_posX - controls_draggingX) * sim_Ui_particleFactor;
					sim_Ui_cameraPosY += (keyboard_Cursor_posY - controls_draggingY) * sim_Ui_particleFactor;
					controls_draggingX = keyboard_Cursor_posX;
					controls_draggingY = keyboard_Cursor_posY;
				}
			}
		});
		document.querySelector("canvas").addEventListener("mouseup", function(e) {
			if (e.which == 1) { // Left mouse button.
				controls_dragging = false;
				
				// Inform about left mouse button being pressed.
				keyboard_Cursor_leftPressed = false;
				keyboard_Cursor_leftReleased = 1;
			}
		});
	}
	
	{ // Menus.
		let 	functionOpen = function(contentTitle) {
				document.querySelector("div#sandbox").style.display = contentTitle == "sandbox" ? "block" : "none";
				document.querySelector("div#settings").style.display = contentTitle == "settings" ? "block" : "none";
				document.querySelector("div#about").style.display = contentTitle == "about" ? "block" : "none";
				
				document.querySelector("div#contents").classList.add("show");
				document.querySelector("div#tabs").classList.add("show");
			},
			functionClose = function(contentTitle) {
				document.querySelector("div#contents").classList.remove("show");
				document.querySelector("div#tabs").classList.remove("show");
			};
		
		// Sandbox.
		document.querySelector("div#openSandbox").onclick = function() { functionOpen("sandbox"); };
		document.querySelector("button#closeSandbox").onclick = function() { functionClose("sandbox"); };
		
		// Settings.
		document.querySelector("div#openSettings").onclick = function() { functionOpen("settings"); };
		document.querySelector("button#closeSettings").onclick = function() { functionClose("settings"); };
		
		// About.
		document.querySelector("div#openAbout").onclick = function() { functionOpen("about"); };
		document.querySelector("button#closeAbout").onclick = function() { functionClose("about"); };
	}
	
	{ // Set sandbox content.
		// Fill list with particles.
		SandboxFillList();
		
		// Add particle button.
		document.querySelector("button#addParticle").onclick = function() {
			SimUiSetMode(sim_Ui_mode == "camera" ? "add" : "camera");
		};
	}
	{ // Set settings content.
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
		
		// Show particle lines
		document.querySelector("input[type='checkbox']#showParticleLine").checked = sim_Ui_particleLineShow;
		document.querySelector("input[type='checkbox']#showParticleLine").onchange = function(e) {
			sim_Ui_particleLineShow = e.target.checked;
		};
		
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
	{ // Set about content.
		
	}
}

function ControlsUpdate() {
	// Mouse button handling.
	if (keyboard_Cursor_leftReleased) {
		if (keyboard_Cursor_leftReleased == 2) {
			keyboard_Cursor_leftReleased = 0;
		} else {
			++keyboard_Cursor_leftReleased;
		}
	}
	
	// Key handling.
	if (KeyboardCheckPressed('W') || KeyboardCheckPressed('ArrowUp')) {
		sim_Ui_cameraPosY += sim_Ui_cameraSpeed * sim_Ui_particleFactor;
		controls_hasMoved = true;
	}
	if (KeyboardCheckPressed('S') || KeyboardCheckPressed('ArrowDown')) {
		sim_Ui_cameraPosY -= sim_Ui_cameraSpeed * sim_Ui_particleFactor;
		controls_hasMoved = true;
	}
	if (KeyboardCheckPressed('A') || KeyboardCheckPressed('ArrowLeft')) {
		sim_Ui_cameraPosX += sim_Ui_cameraSpeed * sim_Ui_particleFactor;
		controls_hasMoved = true;
	}
	if (KeyboardCheckPressed('D') || KeyboardCheckPressed('ArrowRight')) {
		sim_Ui_cameraPosX -= sim_Ui_cameraSpeed * sim_Ui_particleFactor;
		controls_hasMoved = true;
	}
	if (KeyboardCheckPressedOnce('F1')) { // Stop time.
		SimStopTime();
	}
	if (sim_Ui_mode == "add" && KeyboardCheckPressedOnce("Escape")) { // Stop adding particles.
		SimUiSetMode("camera");
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
	
	// If camera moves, unfollow particle, since the user wants to move move the camera, either by dragging or by pressing keys, but not by zooming.
	if (controls_hasMoved) {
		SimParticleFollow(null);
		controls_hasMoved = false;
	}
	
	if (sim_Ui_particleFollow != null) {
		sim_Ui_cameraPosX =	sim_Ui_cameraTransX == 'x' ? -sim_Ui_particleFollow.posX :
					sim_Ui_cameraTransX == 'y' ? -sim_Ui_particleFollow.posY :
					sim_Ui_cameraTransX == 'z' ? -sim_Ui_particleFollow.posZ : 0,
		
		sim_Ui_cameraPosY =	sim_Ui_cameraTransY == 'x' ? -sim_Ui_particleFollow.posX :
					sim_Ui_cameraTransY == 'y' ? -sim_Ui_particleFollow.posY :
					sim_Ui_cameraTransY == 'z' ? -sim_Ui_particleFollow.posZ : 0;
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
					sim_Ui_gridColor + (x == 0 ? "66" : "33"));
		}
		// Y axis
		for (let y = -amountY; y < amountY + 2; ++y) {
			DrawLine(	-graphics_canvas.width / 2,
					offsetY + y * size,
					graphics_canvas.width / 2,
					offsetY + y * size,
					sim_Ui_gridColor + (y == 0 ? "66" : "33"));
		}
		
		// Display axis.
		DrawText(-graphics_canvas.width / 2, offsetY, "-" + sim_Ui_cameraTransX, "gray");
		DrawText(graphics_canvas.width / 2 - 20, offsetY, "+" + sim_Ui_cameraTransX, "gray");
		DrawText(offsetX, -graphics_canvas.height / 2 + 14, "-" + sim_Ui_cameraTransY, "gray");
		DrawText(offsetX, graphics_canvas.height / 2 - 2, "+" + sim_Ui_cameraTransY, "gray");
	}
	
	DrawText(graphics_canvas.width / 2 - 190, -graphics_canvas.height / 2 + 16, "N-Body simulation JS test", sim_Ui_textColor, 16);
	
	DrawText(	-graphics_canvas.width / 2, -graphics_canvas.height / 2 + 16,
			sim_Ui_cameraTransX + " = " + sim_Ui_cameraPosX + ";\n" +
			sim_Ui_cameraTransY + " = " + sim_Ui_cameraPosY + ";",
			sim_Ui_textColor, 16);
	DrawText(-graphics_canvas.width / 2, graphics_canvas.height / 2 - 4, "Elapsed Time: " + sim_time, sim_Ui_textColor, 16);
}
