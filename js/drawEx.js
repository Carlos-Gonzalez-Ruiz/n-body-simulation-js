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

function DrawParticle(particle, isDarkParticle) {
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
		
			// Track line rate.
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
				
				while (Object.keys(particle.lines).length > sim_Ui_particleLineCount) {
					delete particle.lines[Reflect.ownKeys(particle.lines)[0]];
				}
			}
			
			// Draw particle.
			if (sim_Ui_drawAsFlare) {
				DrawImage(	(coordX + sim_Ui_cameraPosX) / sim_Ui_particleFactor,
						(coordY + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
						sim_Ui_particleSize * 4,
						sim_Ui_particleSize * 4,
						"flare",
						particle.color,
						true);
			} else {
				DrawCircleFill(	(coordX + sim_Ui_cameraPosX) / sim_Ui_particleFactor,
						(coordY + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
						sim_Ui_particleSize,
						particle.color);
			}
			
			// Particle hovering. (when there hasn't previously been any particle hovered)
			// Also show info if particle is selected.
			if (	sim_Ui_particleSelect == particle ||
				(!sim_Ui_particleHovering &&
				 keyboard_Cursor_posX > graphics_canvas.width / 2 + ((sim_Ui_cameraPosX + coordX) / sim_Ui_particleFactor - sim_Ui_particleSize) &&
				 keyboard_Cursor_posX < graphics_canvas.width / 2 + ((sim_Ui_cameraPosX + coordX) / sim_Ui_particleFactor + sim_Ui_particleSize) &&
				 keyboard_Cursor_posY > graphics_canvas.height / 2 + ((sim_Ui_cameraPosY + coordY) / sim_Ui_particleFactor - sim_Ui_particleSize) &&
				 keyboard_Cursor_posY < graphics_canvas.height / 2 + ((sim_Ui_cameraPosY + coordY) / sim_Ui_particleFactor + sim_Ui_particleSize) ) ) {
				
					// Only if info is being shown not because if particle being selected.
					if (sim_Ui_particleSelect != particle) {
						// Inform about hovering.
						sim_Ui_particleHovering = true;
						
						// Select particle.
						if (keyboard_Cursor_leftReleased) {
							if (isDarkParticle != undefined && isDarkParticle) {
								SimDarkParticleSelect(particle.id);
							} else {
								SimParticleSelect(particle.id);
							}
						}
					} else {
						// Unselect particle.
						if (keyboard_Cursor_leftReleased) {
							SimParticleSelect(null);
						}
					}
					
					DrawCircle(	(coordX + sim_Ui_cameraPosX) / sim_Ui_particleFactor,
							(coordY + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
							sim_Ui_particleSize + 2,
							"#909090");
						
					DrawText(	(coordX + sim_Ui_cameraPosX) / sim_Ui_particleFactor + 24,
							(coordY + sim_Ui_cameraPosY) / sim_Ui_particleFactor,
							"[ " + particle.name + " ]\n" +
							"Mass: " + (particle.mass + particle.tmpMass) + "\n" +
							"Speed X: " + particle.speedX + "\n" +
							"Speed Y: " + particle.speedY + "\n" +
							"Speed Z: " + particle.speedZ,
							"#909090",
							12);
				
			}
			
			// Draw lines.
			if (	sim_Ui_particleLineShow ||
				(sim_Ui_particleSelectedLineShow && sim_Ui_particleSelect == particle)) {
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
}
