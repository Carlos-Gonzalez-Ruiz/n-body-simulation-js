"use strict";

// "Extended" draw functions.

class Line {
	constructor(x1, y1, z1, x2, y2, z2) {
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;
	}
}

function DrawParticle(particle) {
	// Translate coordinates.
	let 	coordX =	sim_Ui_cameraTransX == 'x' ? particle.posX :
				sim_Ui_cameraTransX == 'y' ? particle.posY :
				sim_Ui_cameraTransX == 'z' ? particle.posZ : 0,
		
		coordY =	sim_Ui_cameraTransY == 'x' ? particle.posX :
				sim_Ui_cameraTransY == 'y' ? particle.posY :
				sim_Ui_cameraTransY == 'z' ? particle.posZ : 0;
	
	// Apply frustrum culling if checked.
	if (	!sim_Ui_frustrumCulling || 
		((sim_Ui_cameraPosX + coordX) / sim_Ui_particleFactor > -graphics_canvas.width / 2 &&
		 (sim_Ui_cameraPosX + coordX) / sim_Ui_particleFactor < graphics_canvas.width / 2 &&
		 (sim_Ui_cameraPosY + coordY) / sim_Ui_particleFactor > -graphics_canvas.height / 2 &&
		 (sim_Ui_cameraPosY + coordY) / sim_Ui_particleFactor < graphics_canvas.height / 2)) {
		
			// Track lines
			if (sim_timeFrames % sim_Ui_particleLineRate == 0) {
				particle.lines[sim_time] = new Line(	particle.prevX,
									particle.prevY,
									particle.prevZ,
									particle.posX,
									particle.posY,
									particle.posZ);
				
				particle.prevX = particle.posX;
				particle.prevY = particle.posY;
				particle.prevZ = particle.posZ;
				
				if (Object.keys(particle.lines).length > sim_Ui_particleLineCount) {
					delete particle.lines[Reflect.ownKeys(particle.lines)[0]];
				}
			}
			
			// Draw particle
			if (sim_Ui_drawAsFlare) {
				/*DrawImage(	(coordX + sim_Ui_cameraPosX) / sim_Ui_particleFactor,
						(coordY + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
						sim_Ui_particleSize,
						sim_Ui_particleSize,
						"../img/flare.png");*/
			} else {
				DrawCircleFill(	(coordX + sim_Ui_cameraPosX) / sim_Ui_particleFactor,
						(coordY + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
						sim_Ui_particleSize,
						particle.color);
			}
			
			for (const u in particle.lines) {
				let x1, y1, x2, y2;
				
				switch (sim_Ui_cameraTransX) {
					case 'x':
						x1 = particle.lines[u].x1;
						x2 = particle.lines[u].x2;
					break;
					case 'y':
						x1 = particle.lines[u].y1;
						x2 = particle.lines[u].y2;
					break;
					case 'z':
						x1 = particle.lines[u].z1;
						x2 = particle.lines[u].z2;
					break;
				}
				
				switch (sim_Ui_cameraTransY) {
					case 'x':
						y1 = particle.lines[u].x1;
						y2 = particle.lines[u].x2;
					break;
					case 'y':
						y1 = particle.lines[u].y1;
						y2 = particle.lines[u].y2;
					break;
					case 'z':
						y1 = particle.lines[u].z1;
						y2 = particle.lines[u].z2;
					break;
				}
				
				DrawLine(	(x1 + sim_Ui_cameraPosX) / sim_Ui_particleFactor,
						(y1 + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
						(x2 + sim_Ui_cameraPosX) / sim_Ui_particleFactor,
						(y2 + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
						particle.color);
			}
		
	}
}
