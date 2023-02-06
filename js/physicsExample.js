"use strict";

// Example presets for physics pre data.

function PhysicsExample_solarSystem() {
	PhysicsSetType(PhysicsType.STAR);
	
	physics_particles[0] = new Particle( 0.0,0.0,0.0,        0.0,0.0,0.0,        1.989e30, "yellow", "Sol"); // a star similar to the sun
	physics_particles[1] = new Particle( 57.909e9,0.0,0.0,   0.0,47.36e3,0.0,    0.33011e24, "gray", "Mercury"); // a planet similar to mercury
	physics_particles[2] = new Particle( 108.209e9,0.0,0.0,  0.0,35.02e3,0.0,    4.8675e24, "orange", "Venus"); // a planet similar to venus
	physics_particles[3] = new Particle( 149.596e9,0.0,0.0,  0.0,29.78e3,0.0,    5.9724e24, "green", "Earth"); // a planet similar to earth
	physics_particles[4] = new Particle( 227.923e9,0.0,0.0,  0.0,24.07e3,0.0,    0.64171e24, "red", "Mars"); // a planet similar to mars
	physics_particles[5] = new Particle( 778.570e9,0.0,0.0,  0.0,13e3,0.0,       1898.19e24, "brown", "Jupiter"); // a planet similar to jupiter
	physics_particles[6] = new Particle( 1433.529e9,0.0,0.0, 0.0,9.68e3,0.0,     568.34e24, "yellow", "Saturn"); // a planet similar to saturn
	physics_particles[7] = new Particle( 2872.463e9,0.0,0.0, 0.0,6.80e3,0.0,     86.813e24, "lightblue", "Uranus"); // a planet similar to uranus
	physics_particles[8] = new Particle( 4495.060e9,0.0,0.0, 0.0,5.43e3,0.0,     102.413e24, "blue", "Neptune"); // a planet similar to neptune
}

function PhysicsExample_randomSystem() {
	PhysicsSetType(PhysicsType.STAR);

	physics_particles[0] = new Particle( 0.0,0.0,0.0,        0.0,0.0,0.0,        1e30 + Math.random() * 2e30, "yellow", "Sol");
	let dst = 0;
	for (let i = 1; i < 2 + Math.random() * 15; ++i) {
		dst += Math.random() * 150e9;
		
		physics_particles[i] = new Particle(	dst, 0, 0,
							
							0,
							PhysicsCalculateEscapeVelocity(physics_particles[0].mass, dst),
							0,
							
							Math.random() * 100e24,
							"gray",
							"N" + i);
	}
}

function PhysicsExample_galaxy() {
	PhysicsSetType(PhysicsType.GALAXY);
	
	let dst = 0, starMass = 2e30 * Math.random();
	for (let i = 0; i < 10; ++i) {
		dst += Math.random() * 150e9;
		
		for (let u = 0; u < 50; ++u) {
			let	angle = Math.random() * 2 * Math.PI,
				mass = Math.random() * 100e24,
				spd = Math.pow(sim_gravity * starMass / (dst * (1 + Math.random())), 1 / 2);
			
			//starMass += mass;
			
			physics_particles[i * 50 + u] = new Particle(	Math.cos(angle) * dst + Math.random() * 100e9, Math.sin(angle) * dst + Math.random() * 100e9, 0,
									Math.cos(angle + Math.PI / 2) * spd, Math.sin(angle + Math.PI / 2) * spd, 0,
									mass,
									"gray",
									"N" + i);
		}
	}
	physics_darkParticles[physics_particleCount] = new Particle(	0.0, 0.0, 0.0,
									0.0, 0.0, 0.0,
									starMass, "yellow", "Sol");
	console.log("random_galaxy");
}

function PhysicsExample_cluster() {
	PhysicsSetType(PhysicsType.CLUSTER);
	
	console.log("galaxy_cluster");
}

function PhysicsExample_supercluster() {
	PhysicsSetType(PhysicsType.SUPERCLUSTER);
	
	console.log("galaxy_supercluster");
}
