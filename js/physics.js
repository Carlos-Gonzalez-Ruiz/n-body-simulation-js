"use strict";

// N-body physics.

class Vector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Particle {
	constructor(posX, posY, posZ, speedX, speedY, speedZ, mass, color) {
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
		
		this.lines = {  };
	}
}

function PhysicsPreData() {
	sim_particles[0] = new Particle( 0.0,0.0,0.0,        0.0,0.0,0.0,        1.989e30, "yellow"); // a star similar to the sun
	sim_particles[1] = new Particle( 57.909e9,0.0,0.0,   0.0,47.36e3,0.0,    0.33011e24, "gray"); // a planet similar to mercury
	sim_particles[2] = new Particle( 108.209e9,0.0,0.0,  0.0,35.02e3,0.0,    4.8675e24, "orange"); // a planet similar to venus
	sim_particles[3] = new Particle( 149.596e9,0.0,0.0,  0.0,29.78e3,0.0,    5.9724e24, "green"); // a planet similar to earth
	sim_particles[4] = new Particle( 227.923e9,0.0,0.0,  0.0,24.07e3,0.0,    0.64171e24, "red"); // a planet similar to mars
	sim_particles[5] = new Particle( 778.570e9,0.0,0.0,  0.0,13e3,0.0,       1898.19e24, "brown"); // a planet similar to jupiter
	sim_particles[6] = new Particle( 1433.529e9,0.0,0.0, 0.0,9.68e3,0.0,     568.34e24, "yellow"); // a planet similar to saturn
	sim_particles[7] = new Particle( 2872.463e9,0.0,0.0, 0.0,6.80e3,0.0,     86.813e24, "lightblue"); // a planet similar to uranus
	sim_particles[8] = new Particle( 4495.060e9,0.0,0.0, 0.0,5.43e3,0.0,     102.413e24, "blue"); // a planet similar to neptune
}

function PhysicsUpdate() {
	for (const i in sim_particles) {
		let a_g = new Vector3(0, 0, 0);
		
		for (const u in sim_particles) {
			if (i != u) {
				let r_vector = new Vector3(	sim_particles[i].posX - sim_particles[u].posX,
								sim_particles[i].posY - sim_particles[u].posY, 
								sim_particles[i].posZ - sim_particles[u].posZ);
				
				let r_mag = Math.sqrt(	r_vector.x * r_vector.x +
							r_vector.y * r_vector.y +
							r_vector.z * r_vector.z);
				
				let acceleration = -1.0 * sim_gravity * (sim_particles[u].mass) / (r_mag * r_mag);
				
				let r_unit_vector = new Vector3(	r_vector.x / r_mag,
								r_vector.y / r_mag,
								r_vector.z / r_mag);
				
				a_g.x += acceleration * r_unit_vector.x;
				a_g.y += acceleration * r_unit_vector.y;
				a_g.z += acceleration * r_unit_vector.z;
			}
		}
		
		sim_particles[i].speedX += a_g.x * sim_timeFactor;
		sim_particles[i].speedY += a_g.y * sim_timeFactor;
		sim_particles[i].speedZ += a_g.z * sim_timeFactor;
	}
	
	for (const i in sim_particles) {
		sim_particles[i].posX += sim_particles[i].speedX * sim_timeFactor;
		sim_particles[i].posY += sim_particles[i].speedY * sim_timeFactor;
		sim_particles[i].posZ += sim_particles[i].speedZ * sim_timeFactor;
	}
}
