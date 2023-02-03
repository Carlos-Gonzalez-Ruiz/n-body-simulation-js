"use strict";

// N-body physics.

// Enums

const PhysicsPreDataType = Object.freeze({
	SOLAR_SYSTEM: Symbol("SOLAR_SYSTEM"),
	RANDOM_SYSTEM: Symbol("RANDOM_SYSTEM"),
	RANDOM_GALAXY: Symbol("RANDOM_GALACY"),
	CLUSTER: Symbol("CLUSTER"),
	SUPERCLUSTER: Symbol("SUPERCLUSTER")
})

const PhysicsType = Object.freeze({
	STAR: Symbol("STAR"),
	GALAXY: Symbol("GALAXY"),
	CLUSTER: Symbol("CLUSTER"),
	SUPERCLUSTER: Symbol("SUPERCLUSTER")
})


// Classes

class Vector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Particle {
	constructor(posX, posY, posZ, speedX, speedY, speedZ, mass, color, name, type) {
		this.posX = posX;
		this.posY = posY;
		this.posZ = posZ;
		this.speedX = speedX;
		this.speedY = speedY;
		this.speedZ = speedZ;
		this.mass = mass;
		
		this.prevX = 0;
		this.prevY = 0;
		this.prevZ = 0;
		
		if (color == undefined) {
			this.color = '#' + (Math.random().toString(16) + "000000").substring(2,8);
		} else {
			this.color = color;
		}
		
		if (name == undefined) {
			this.name = "Particle #" + physics_particleCount;
		} else {
			this.name = name;
		}
		this.id = physics_particleCount++;
		
		this.lines = {  };
	}
}


// Global variables

let physics_type = PhysicsType.STAR;

let physics_particles = {};
let physics_particleCount = 0;

let physics_darkParticles = {};
let physics_darkParticleCount = 0;


// Functions

function PhysicsPreData(example) {
	SimRestart();
	SimEmpty();
	
	if (example == undefined) {
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
	} else {
		switch (example.toString()) {
			case PhysicsPreDataType.SOLAR_SYSTEM.toString():
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
			break;
			case PhysicsPreDataType.RANDOM_SYSTEM.toString():
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
			break;
			case PhysicsPreDataType.RANDOM_GALAXY.toString():
				PhysicsSetType(PhysicsType.GALAXY);
				
				/*let dst = 0, starMass = 2e30 * Math.random();
				for (let i = 1; i < 11; ++i) {
					dst += Math.random() * 150e9;
					
					for (let u = 0; u < (10 - i) * i; ++u) {
						let	angle = Math.random() * 2 * Math.PI,
							mass = Math.random() * 100e24,
							spd = Math.pow(sim_gravity * starMass / (dst * (1 + Math.random())), 1 / 2);
						
						starMass += mass;
						
						physics_particles[i * 10 + u] = new Particle(	Math.cos(angle) * dst + Math.random() * 100e9, Math.sin(angle) * dst + Math.random() * 100e9, 0,
												Math.cos(angle + Math.PI / 2) * spd, Math.sin(angle + Math.PI / 2) * spd, 0,
												mass*0,
												"gray",
												"N" + i);
					}
				}
				physics_particles[0] = new Particle( 0.0,0.0,0.0,        0.0,0.0,0.0,        starMass, "yellow", "Sol");*/
				console.log("random_galaxy");
			break;
			case PhysicsPreDataType.CLUSTER.toString():
				PhysicsSetType(PhysicsType.CLUSTER);
				
				console.log("galaxy_cluster");
			break;
			case PhysicsPreDataType.SUPERCLUSTER.toString():
				PhysicsSetType(PhysicsType.SUPERCLUSTER);
				
				console.log("galaxy_supercluster");
			break;
		}
	}
}

function PhysicsUpdate() {
	switch (physics_type.toString()) {
		case PhysicsType.STAR.toString():
			for (const i in physics_particles) {
				let a_g = new Vector3(0, 0, 0);
				
				for (const u in physics_particles) {
					if (i != u) {
						let r_vector = new Vector3(	physics_particles[i].posX - physics_particles[u].posX,
										physics_particles[i].posY - physics_particles[u].posY, 
										physics_particles[i].posZ - physics_particles[u].posZ);
						
						let r_mag = Math.sqrt(	r_vector.x * r_vector.x +
									r_vector.y * r_vector.y +
									r_vector.z * r_vector.z);
						
						let acceleration = -sim_gravity * (physics_particles[u].mass) / (r_mag * r_mag);
						
						let r_unit_vector = new Vector3(	r_vector.x / r_mag,
										r_vector.y / r_mag,
										r_vector.z / r_mag);
						
						a_g.x += acceleration * r_unit_vector.x;
						a_g.y += acceleration * r_unit_vector.y;
						a_g.z += acceleration * r_unit_vector.z;
					}
				}
				
				physics_particles[i].speedX += a_g.x * sim_timeFactor;
				physics_particles[i].speedY += a_g.y * sim_timeFactor;
				physics_particles[i].speedZ += a_g.z * sim_timeFactor;
			}

			for (const i in physics_particles) {
				physics_particles[i].posX += physics_particles[i].speedX * sim_timeFactor;
				physics_particles[i].posY += physics_particles[i].speedY * sim_timeFactor;
				physics_particles[i].posZ += physics_particles[i].speedZ * sim_timeFactor;
			}
		break;
		case PhysicsType.GALAXY.toString():
			for (const i in physics_particles) {
				let a_g = new Vector3(0, 0, 0);
				
				for (const u in physics_darkParticles) {
					let r_vector = new Vector3(	physics_particles[i].posX - physics_darkParticles[u].posX,
									physics_particles[i].posY - physics_darkParticles[u].posY,
									physics_particles[i].posZ - physics_darkParticles[u].posZ);
					
					let r_mag = Math.sqrt(	r_vector.x * r_vector.x +
								r_vector.y * r_vector.y +
								r_vector.z * r_vector.z);
					
					let acceleration = -sim_gravity * (physics_darkParticles[u].mass) / (r_mag * r_mag);
					
					let r_unit_vector = new Vector3(	r_vector.x / r_mag,
									r_vector.y / r_mag,
									r_vector.z / r_mag);
					
					a_g.x += acceleration * r_unit_vector.x;
					a_g.y += acceleration * r_unit_vector.y;
					a_g.z += acceleration * r_unit_vector.z;
				}
				
				physics_particles[i].speedX += a_g.x * sim_timeFactor;
				physics_particles[i].speedY += a_g.y * sim_timeFactor;
				physics_particles[i].speedZ += a_g.z * sim_timeFactor;
			}

			for (const i in physics_particles) {
				physics_particles[i].posX += physics_particles[i].speedX * sim_timeFactor;
				physics_particles[i].posY += physics_particles[i].speedY * sim_timeFactor;
				physics_particles[i].posZ += physics_particles[i].speedZ * sim_timeFactor;
			}
		break;
		case PhysicsType.CLUSTER.toString():
			for (const i in physics_particles) {
				let a_g = new Vector3(0, 0, 0);
				
				for (const u in physics_darkParticles) {
					let r_vector = new Vector3(	physics_particles[i].posX - physics_darkParticles[u].posX,
									physics_particles[i].posY - physics_darkParticles[u].posY,
									physics_particles[i].posZ - physics_darkParticles[u].posZ);
					
					let r_mag = Math.sqrt(	r_vector.x * r_vector.x +
								r_vector.y * r_vector.y +
								r_vector.z * r_vector.z);
					
					let acceleration = -sim_gravity * (physics_darkParticles[u].mass) / (r_mag * r_mag);
					
					let r_unit_vector = new Vector3(	r_vector.x / r_mag,
									r_vector.y / r_mag,
									r_vector.z / r_mag);
					
					a_g.x += acceleration * r_unit_vector.x;
					a_g.y += acceleration * r_unit_vector.y;
					a_g.z += acceleration * r_unit_vector.z;
				}
				
				physics_particles[i].speedX += a_g.x * sim_timeFactor;
				physics_particles[i].speedY += a_g.y * sim_timeFactor;
				physics_particles[i].speedZ += a_g.z * sim_timeFactor;
			}
			
			for (const i in physics_particles) {
				physics_particles[i].posX += physics_particles[i].speedX * sim_timeFactor;
				physics_particles[i].posY += physics_particles[i].speedY * sim_timeFactor;
				physics_particles[i].posZ += physics_particles[i].speedZ * sim_timeFactor;
			}
		break;
		case PhysicsType.SUPERCLUSTER.toString():
			for (const i in physics_particles) {
				let a_g = new Vector3(0, 0, 0);
				
				for (const u in physics_darkParticles) {
					let r_vector = new Vector3(	physics_particles[i].posX - physics_darkParticles[u].posX,
									physics_particles[i].posY - physics_darkParticles[u].posY,
									physics_particles[i].posZ - physics_darkParticles[u].posZ);
					
					let r_mag = Math.sqrt(	r_vector.x * r_vector.x +
								r_vector.y * r_vector.y +
								r_vector.z * r_vector.z);
					
					let acceleration = -sim_gravity * (physics_darkParticles[u].mass) / (r_mag * r_mag);
					
					let r_unit_vector = new Vector3(	r_vector.x / r_mag,
									r_vector.y / r_mag,
									r_vector.z / r_mag);
					
					a_g.x += acceleration * r_unit_vector.x;
					a_g.y += acceleration * r_unit_vector.y;
					a_g.z += acceleration * r_unit_vector.z;
				}
				
				physics_particles[i].speedX += a_g.x * sim_timeFactor;
				physics_particles[i].speedY += a_g.y * sim_timeFactor;
				physics_particles[i].speedZ += a_g.z * sim_timeFactor;
			}
			
			for (const i in physics_particles) {
				physics_particles[i].posX += physics_particles[i].speedX * sim_timeFactor;
				physics_particles[i].posY += physics_particles[i].speedY * sim_timeFactor;
				physics_particles[i].posZ += physics_particles[i].speedZ * sim_timeFactor;
			}
		break;
	}
}

function PhysicsSetType(type) {
	physics_type = type;
}

function PhysicsParticleAdd(particle) {
	physics_particles[Object.keys(physics_particles).length] = particle;
	
	SandboxFillList();
}

function PhysicsParticleRemove(key) {
	delete physics_particles[key];
	
	SandboxFillList();
}

function PhysicsCalculateEscapeVelocity(starMass, dstToStar) {
	// https://es.wikipedia.org/wiki/Velocidad_de_escape
	// Math.sqrt(6.67e-11 * 2e30 / 150e9)
	return Math.sqrt(sim_gravity * starMass / dstToStar);
}
