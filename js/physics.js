"use strict";

// N-body physics.

// Enums

const PhysicsPreDataType = Object.freeze({
	SOLAR_SYSTEM: Symbol("SOLAR_SYSTEM"),
	RANDOM_SYSTEM: Symbol("RANDOM_SYSTEM"),
	GALAXY: Symbol("GALAXY"),
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
