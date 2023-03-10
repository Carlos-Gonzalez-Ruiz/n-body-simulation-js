"use strict";

// N-body physics.

// Enums

const PhysicsPreDataType = Object.freeze({
	SOLAR_SYSTEM: Symbol("SOLAR_SYSTEM"),
	RANDOM_SYSTEM: Symbol("RANDOM_SYSTEM"),
	GALAXY: Symbol("GALAXY"),
	GALAXY_COLLISION: Symbol("GALAXY_COLLISION"),
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
		this.tmpMass = 0;
		
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
//let physics_darkParticleCount = 0;


// Functions

function PhysicsPreData(example) {
	SimRestart();
	SimEmpty();
	
	if (example == undefined) {
		PhysicsExample_solarSystem();
	} else {
		switch (example.toString()) {
			case PhysicsPreDataType.SOLAR_SYSTEM.toString():
				PhysicsExample_solarSystem();
			break;
			case PhysicsPreDataType.RANDOM_SYSTEM.toString():
				PhysicsExample_randomSystem();
			break;
			case PhysicsPreDataType.GALAXY.toString():
				PhysicsExample_galaxy();
			break;
			case PhysicsPreDataType.GALAXY_COLLISION.toString():
				PhysicsExample_galaxy2();
			break;
			case PhysicsPreDataType.CLUSTER.toString():
				PhysicsExample_cluster();
			break;
			case PhysicsPreDataType.SUPERCLUSTER.toString():
				PhysicsExample_supercluster();
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
			// Regular particles.
			for (const i in physics_particles) {
				let a_g = new Vector3(0, 0, 0);
				
				for (const u in physics_darkParticles) {
					let r_vector = new Vector3(	physics_particles[i].posX - physics_darkParticles[u].posX,
									physics_particles[i].posY - physics_darkParticles[u].posY,
									physics_particles[i].posZ - physics_darkParticles[u].posZ);
					
					let r_mag = Math.sqrt(	r_vector.x * r_vector.x +
								r_vector.y * r_vector.y +
								r_vector.z * r_vector.z);
					
					// TODO: Allow dark particles to swallow regular particles.
					
					// Flat speed
					if (r_mag < 10e10) {
						r_mag = 10e10;
					} else if (r_mag > 10e12 && r_mag < 10e14) {
						// "Smooth" out range
						r_mag = 10e12 + (r_mag - 10e12) / (10e14 - 10e12) / 4;
						
						let u_speed = Math.sqrt(	physics_particles[i].speedX * physics_particles[i].speedX +
									physics_particles[i].speedY * physics_particles[i].speedY +
									physics_particles[i].speedZ * physics_particles[i].speedZ);
						if (u_speed > 15e4) {
							r_mag = -r_mag / 2;
							
							// espcae
							let escapeVel = PhysicsCalculateEscapeVelocity(physics_darkParticles[u].mass, r_mag);
							let dirX = Math.atan2(r_vector.y, r_vector.x);
							let dirY = Math.atan2(r_vector.z, Math.sqrt(r_vector.x * r_vector.x + r_vector.y * r_vector.y));
							
							r_vector.x += escapeVel * -Math.sin(dirX - Math.PI) * Math.cos(dirY) * r_mag / 10e5;
							r_vector.y += escapeVel * Math.cos(dirX - Math.PI) * Math.cos(dirY) * r_mag / 10e5;
							r_vector.z += escapeVel * Math.sin(dirY) * r_mag / 10e5;
						}
					}
					
					let acceleration = -sim_gravity * (physics_darkParticles[u].mass - physics_darkParticles[u].tmpMass) / (r_mag * r_mag);
					
					let r_unit_vector = new Vector3(	r_vector.x / r_mag,
									r_vector.y / r_mag,
									r_vector.z / r_mag);
					
					a_g.x += acceleration * r_unit_vector.x;
					a_g.y += acceleration * r_unit_vector.y;
					a_g.z += acceleration * r_unit_vector.z;
				}
				
				let speedX = physics_particles[i].speedX + a_g.x * sim_timeFactor;
				let speedY = physics_particles[i].speedY + a_g.y * sim_timeFactor;
				let speedZ = physics_particles[i].speedZ + a_g.z * sim_timeFactor;
				
				let u_speed = Math.sqrt(	speedX * speedX +
							speedY * speedY +
							speedZ * speedZ);
				
				if (u_speed < 15e4) {
					physics_particles[i].speedX += a_g.x * sim_timeFactor;
					physics_particles[i].speedY += a_g.y * sim_timeFactor;
					physics_particles[i].speedZ += a_g.z * sim_timeFactor;
				}
			}

			for (const i in physics_particles) {
				physics_particles[i].posX += physics_particles[i].speedX * sim_timeFactor;
				physics_particles[i].posY += physics_particles[i].speedY * sim_timeFactor;
				physics_particles[i].posZ += physics_particles[i].speedZ * sim_timeFactor;
			}
			
			// Dark particles.
			for (const i in physics_darkParticles) {
				let a_g = new Vector3(0, 0, 0);
				
				for (const u in physics_darkParticles) {
					if (i != u) {
						let r_vector = new Vector3(	physics_darkParticles[i].posX - physics_darkParticles[u].posX,
										physics_darkParticles[i].posY - physics_darkParticles[u].posY,
										physics_darkParticles[i].posZ - physics_darkParticles[u].posZ);
						
						let r_mag = Math.sqrt(	r_vector.x * r_vector.x +
									r_vector.y * r_vector.y +
									r_vector.z * r_vector.z);
						
						// TODO: Allow dark particles to swallow other dark particles.
						
						// Flat speed
						if (r_mag < 10e5 * sim_timeFactor) {
							if (physics_darkParticles[i].mass < physics_darkParticles[u].mass) {
								let factor = physics_darkParticles[i].mass / physics_darkParticles[u].mass / 10e2;
								
								physics_darkParticles[i].speedX /= 1 + (sim_timeFactor / 10e4) * factor;
								physics_darkParticles[i].speedY /= 1 + (sim_timeFactor / 10e4) * factor;
								physics_darkParticles[i].speedZ /= 1 + (sim_timeFactor / 10e4) * factor;
							} else {
								let factor = physics_darkParticles[u].mass / physics_darkParticles[i].mass / 10e2;
								
								physics_darkParticles[u].speedX /= 1 + (sim_timeFactor / 10e4) * factor;
								physics_darkParticles[u].speedY /= 1 + (sim_timeFactor / 10e4) * factor;
								physics_darkParticles[u].speedZ /= 1 + (sim_timeFactor / 10e4) * factor;
							}
							
							r_mag = 10e5 * sim_timeFactor;
						}
						
						let acceleration = -sim_gravity * (physics_darkParticles[u].mass) / (r_mag * r_mag);
						
						let r_unit_vector = new Vector3(	r_vector.x / r_mag,
										r_vector.y / r_mag,
										r_vector.z / r_mag);
						
						a_g.x += acceleration * r_unit_vector.x;
						a_g.y += acceleration * r_unit_vector.y;
						a_g.z += acceleration * r_unit_vector.z;
					}
				}
				
				let speedX = physics_darkParticles[i].speedX + a_g.x * sim_timeFactor;
				let speedY = physics_darkParticles[i].speedY + a_g.y * sim_timeFactor;
				let speedZ = physics_darkParticles[i].speedZ + a_g.z * sim_timeFactor;
				
				let u_speed = Math.sqrt(	speedX * speedX +
							speedY * speedY +
							speedZ * speedZ);
				
				if (u_speed < 10e4) {
					physics_darkParticles[i].speedX += a_g.x * sim_timeFactor;
					physics_darkParticles[i].speedY += a_g.y * sim_timeFactor;
					physics_darkParticles[i].speedZ += a_g.z * sim_timeFactor;
				}
			}

			for (const i in physics_darkParticles) {
				physics_darkParticles[i].posX += physics_darkParticles[i].speedX * sim_timeFactor;
				physics_darkParticles[i].posY += physics_darkParticles[i].speedY * sim_timeFactor;
				physics_darkParticles[i].posZ += physics_darkParticles[i].speedZ * sim_timeFactor;
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
	let current = document.querySelector("span#physicsTypeCurrent");
	switch (type.toString()) {
		case PhysicsType.STAR.toString():
			current.innerText = TEXT_STAR;
		break;
		case PhysicsType.GALAXY.toString():
			current.innerText = TEXT_GALAXY;
		break;
		case PhysicsType.CLUSTER.toString():
			current.innerText = TEXT_CLUSTER;
		break;
		case PhysicsType.SUPERCLUSTER.toString():
			current.innerText = TEXT_SUPERCLUSTER;
		break;
	}
	
	physics_type = type;
}

function PhysicsParticleFastAdd(particle) {
	// Since JS will first construct the object, physics_particleCount and particle ID will hold different values,
	// hence the physics_particleCount - 1.
	physics_particles[physics_particleCount - 1] = particle;
}

function PhysicsParticleAdd(particle) {
	// Since JS will first construct the object, physics_particleCount and particle ID will hold different values,
	// hence the physics_particleCount - 1.
	physics_particles[physics_particleCount - 1] = particle;
	
	SandboxFillList();
}

function PhysicsParticleRemove(key) {
	delete physics_particles[key];
	
	SandboxFillList();
}

function PhysicsDarkParticleFastAdd(particle) {
	// Since JS will first construct the object, physics_particleCount and particle ID will hold different values,
	// hence the physics_particleCount - 1.
	physics_darkParticles[physics_particleCount - 1] = particle;
}

function PhysicsDarkParticleAdd(particle) {
	// Since JS will first construct the object, physics_particleCount and particle ID will hold different values,
	// hence the physics_particleCount - 1.
	physics_darkParticles[physics_particleCount - 1] = particle;
	
	SandboxFillList();
}

function PhysicsDarkParticleRemove(key) {
	delete physics_darkParticles[key];
	
	SandboxFillList();
}

function PhysicsCalculateEscapeVelocity(starMass, dstToStar) {
	// https://es.wikipedia.org/wiki/Velocidad_de_escape
	// Math.sqrt(6.67e-11 * 2e30 / 150e9)
	return Math.sqrt(sim_gravity * starMass / dstToStar);
}
