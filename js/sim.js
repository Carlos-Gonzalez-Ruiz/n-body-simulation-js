"use strict";

let sim_Ui_particleFactor = 10.0e9;
let sim_Ui_particleSize = 10;

let sim_Ui_cameraPosX = 0;
let sim_Ui_cameraPosY = 0;
let sim_Ui_cameraTransX = 'x';
let sim_Ui_cameraTransY = 'y';
let sim_Ui_cameraSpeed = 1;
let sim_Ui_factorSpeed = 0.1;

let sim_Ui_particleLineCount = 25;
let sim_Ui_particleLineRate = 60;

let sim_Ui_drawAsFlare = false;

let sim_Ui_gridDraw = true;
let sim_Ui_gridSize = sim_Ui_particleFactor * 32;
let sim_Ui_gridColor = "#666666";

let sim_Ui_textColor = "#000000";

let sim_Ui_frustrumCulling = false;

let sim_time = 0;
let sim_timeFactor = 10000;
let sim_timeFrames = 0;
let sim_gravity = 6.67e-11; // Gravitational constant
let sim_particles = {};

function SimCreation() {
	PhysicsPreData();
	
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
	for (const i in sim_particles) {
		DrawParticle(sim_particles[i]);
	}
}

function SimStopTime() {
	if (sim_timeFactor == 0) {
		sim_timeFactor = 10000;
		document.querySelector("button#pause").innerHTML = "Pause";
	} else {
		sim_timeFactor = 0;
		document.querySelector("button#pause").innerHTML = "Paused";
	}
}

