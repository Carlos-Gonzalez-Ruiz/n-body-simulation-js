"use strict";

// Constants

const TEXTAREA_CODE = `
// Write your JavaScript code here.

let sol = new Particle(
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		2e30, "yellow", "Sol"
);

let tierra = new Particle(
		150e9, 0, 0,
		
		0,
		PhysicsCalculateEscapeVelocity(2e30, 150e9),
		0,
		
		5e24,
		"green",
		"Earth"
);

PhysicsParticleAdd(sol);
PhysicsParticleAdd(tierra);

// Use "PhysicsCalculateEscapeVelocity(starMass, dstToStar)", to
// prevent particles from being swallowed by its star.

// Use "PhysicsParticleAdd([Object Particle])" to create a
// particle.
//   To instantiate a Particle, the constructor method is the
//   following:
//     - posX
//     - posY
//     - posZ
//     - speedX
//     - speedY
//     - speedZ
//     - mass
//     - color [optional]
//     - name [optional]

// Use "PhysicsParticleRemove(index)", to remove a particle.

// It is recommended to keep these comments so you can use them to
// create your own pieces of code.
`;

const TEXT_PAUSE = "Pause";
const TEXT_PAUSED = "Paused";

const PHYSICS_TYPE_STAR_DESC = `
Physics for regular particles are calculated and dark particles are ignored (mass = 0, speed = 0).
`;

const PHYSICS_TYPE_GALAXY_DESC = `
Regular particles are affected by dark particles, but not by regular particles (mass = 0). Physics for dark particles are calculated.
`;

const PHYSICS_TYPE_CLUSTER_DESC = `
Regular particles are affected by dark particles, but not by regular particles (mass = 0). Physics for dark particles are calculated.
`;

const PHYSICS_TYPE_SUPERCLUSTER_DESC = `
Regular particles are affected by dark particles, but not by regular particles (mass = 0). Physics for dark particles are calculated.
Aditionally, expansion of space is applied.
`;
