"use strict";

// Simulator.

// Enums

const SimUiModes = Object.freeze({
	CAMERA: Symbol("camera"),
	ADD: Symbol("add")
})


// Global variables

let sim_Ui_particleFactor = 10.0e9;
let sim_Ui_particleSize = 10;
let sim_Ui_particleHovering = false;
let sim_Ui_particleSelect = null;
let sim_Ui_particleFollow = null;

let sim_Ui_cameraPosX = 0;
let sim_Ui_cameraPosY = 0;
let sim_Ui_cameraTransX = 'x';
let sim_Ui_cameraTransY = 'y';
let sim_Ui_cameraSpeed = 1;
let sim_Ui_factorSpeed = 0.1;

let sim_Ui_particleLineCount = 25;
let sim_Ui_particleLineRate = 60;
let sim_Ui_particleLineShow = true;

let sim_Ui_drawAsFlare = false;

let sim_Ui_gridDraw = true;
let sim_Ui_gridSize = sim_Ui_particleFactor * 32;
let sim_Ui_gridColor = "#666666";

let sim_Ui_textColor = "#000000";

let sim_Ui_frustrumCulling = false;

let sim_Ui_mode = SimUiModes.CAMERA; // Mode: SimUiModes.CAMERA, SimUiModes.ADD

let sim_time = 0;
let sim_timeFactor = 10000;
let sim_timeFrames = 0;

let sim_gravity = 6.67e-11; // Gravitational constant
let sim_hubble = 69800; // Hubble constant


// Functions

function SimCreation() {
	switch (document.querySelector("select#getPreset").value) {
		case "1":
			PhysicsPreData(PhysicsPreDataType.SOLAR_SYSTEM);
		break;
		case "2":
			PhysicsPreData(PhysicsPreDataType.RANDOM_SYSTEM);
		break;
		case "3":
			PhysicsPreData(PhysicsPreDataType.RANDOM_GALAXY);
		break;
		case "4":
			PhysicsPreData(PhysicsPreDataType.CLUSTER);
		break;
		case "5":
			PhysicsPreData(PhysicsPreDataType.SUPERCLUSTER);
		break;
		default:
			PhysicsPreData();
		break;
	}
	
	ControlsCreation();
}

function SimRendering() {
	ControlsUpdate();
	PhysicsUpdate();
	SimDrawParticles();
	
	sim_time += sim_timeFactor;
	if (sim_timeFactor) { ++sim_timeFrames; }
}

function SimDrawParticles() {
	sim_Ui_particleHovering = false;
	
	for (const i in physics_particles) {
		DrawParticle(physics_particles[i]);
	}
	
	{ // Change cursor when hovering a particle or hovering selected particle.
		let coordX, coordY;
		
		// Translate coordinates.
		if (sim_Ui_particleSelect != null) {
			coordX =	sim_Ui_cameraTransX == 'x' ? sim_Ui_particleSelect.posX :
					sim_Ui_cameraTransX == 'y' ? sim_Ui_particleSelect.posY :
					sim_Ui_cameraTransX == 'z' ? sim_Ui_particleSelect.posZ : NaN,
			
			coordY =	sim_Ui_cameraTransY == 'x' ? sim_Ui_particleSelect.posX :
					sim_Ui_cameraTransY == 'y' ? sim_Ui_particleSelect.posY :
					sim_Ui_cameraTransY == 'z' ? sim_Ui_particleSelect.posZ : NaN;
		}
		
		if (	sim_Ui_particleHovering || // Change cursor icon when hovering.
			(keyboard_Cursor_posX > graphics_canvas.width / 2 + ((sim_Ui_cameraPosX + coordX) / sim_Ui_particleFactor - sim_Ui_particleSize) &&
			 keyboard_Cursor_posX < graphics_canvas.width / 2 + ((sim_Ui_cameraPosX + coordX) / sim_Ui_particleFactor + sim_Ui_particleSize) &&
			 keyboard_Cursor_posY > graphics_canvas.height / 2 + ((sim_Ui_cameraPosY + coordY) / sim_Ui_particleFactor - sim_Ui_particleSize) &&
			 keyboard_Cursor_posY < graphics_canvas.height / 2 + ((sim_Ui_cameraPosY + coordY) / sim_Ui_particleFactor + sim_Ui_particleSize) ) ) {
			
				graphics_canvas.style.cursor = "pointer";
			
		} else if (sim_Ui_mode == SimUiModes.ADD && KeyboardCheckPressed("Control")) { // Change cursor icon when adding particle.
			graphics_canvas.style.cursor = "crosshair";
		} else {
			graphics_canvas.style.removeProperty("cursor");
		}
	}
}

function SimStopTime() {
	if (sim_timeFactor == 0) {
		sim_timeFactor = 10000;
		document.querySelector("button#pause").innerHTML = TEXT_PAUSE;
	} else {
		sim_timeFactor = 0;
		document.querySelector("button#pause").innerHTML = TEXT_PAUSED;
	}
}

function SimParticleSelect(key) {
	// Select particle.
	sim_Ui_particleSelect = physics_particles[key];
	
	// Remove styles.
	let selected = document.querySelector("div#particleList div#selected");
	if (selected != null) { selected.id = ""; }
	
	// Apply styles.
	if (key != null) {
		document.querySelector("div#particleList div[data-key='" + key + "']").id = "selected";
	}
}

function SimParticleFollow(key) {
	// Remove style from previous button.
	let elementOld = document.querySelector("div#particleList button.follow#following");
	if (elementOld != null) {
		elementOld.id = "";
		elementOld.title = "Follow particle";
		elementOld.classList.remove("hold")
		elementOld.dataset.following = "false";
	}
	
	if (key == null) {
		// Unfollow particle.
		sim_Ui_particleFollow = null;
	} else {
		// Modify element.
		let elementNew = document.querySelector("div#particleList button.follow[data-key='" + key + "']");
		elementNew.id = "following";
		elementNew.title = "Unfollow particle";
		elementNew.classList.add("hold");
		elementNew.dataset.following = "true";
		
		// Follow particle.
		sim_Ui_particleFollow = physics_particles[key];
	}
}

function SimRestart() {
	sim_time = 0;
	sim_Ui_cameraPosX = 0;
	sim_Ui_cameraPosY = 0;
	
	physics_type = PhysicsType.STAR;
}

function SimEmpty() {
	physics_particles = {};
	physics_particleCount = 0;
	
	physics_darkParticles = {};
	physics_darkParticleCount = 0;
	
	SandboxFillList();
}

function SimUiSetMode(mode) {
	sim_Ui_mode = mode;
	
	// Stylize add particle button.
	let button = document.querySelector("button#addParticle");
	if (sim_Ui_mode == SimUiModes.ADD) {
		button.classList.add("hold");
	} else {
		button.classList.remove("hold");
	}
}
