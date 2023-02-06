"use strict";

// Sandbox Utilities.

function SandboxFillList() {
	SandboxUtilFillList(physics_particles, document.querySelector("div#particleList"));
	SandboxUtilFillList(physics_darkParticles, document.querySelector("div#darkParticleList"));
}

function SandboxUtilFillList(particles, listContainer) {
	listContainer.innerHTML = "";
	
	for (const i in particles) {
		let element = document.createElement("div");
		element.classList.add("flex");
		element.dataset.key = i;
		
		let divLeft = document.createElement("div");
		{ // Left div content.
			let buttonSelect = document.createElement("button");
			buttonSelect.title = "Select";
			buttonSelect.innerHTML = "⌖";
			buttonSelect.dataset.key = i;
			buttonSelect.onclick = function() {
				SimParticleSelect(this.dataset.key);
			};
			divLeft.appendChild(buttonSelect);
			
			let buttonGoto = document.createElement("button");
			buttonGoto.title = "Go to particle";
			buttonGoto.innerHTML = "⇖";
			buttonGoto.dataset.key = i;
			buttonGoto.onclick = function() {
				SimParticleFollow(null);
				
				sim_Ui_cameraPosX =	sim_Ui_cameraTransX == 'x' ? -particles[this.dataset.key].posX :
							sim_Ui_cameraTransX == 'y' ? -particles[this.dataset.key].posY :
							sim_Ui_cameraTransX == 'z' ? -particles[this.dataset.key].posZ : 0,
				
				sim_Ui_cameraPosY =	sim_Ui_cameraTransY == 'x' ? -particles[this.dataset.key].posX :
							sim_Ui_cameraTransY == 'y' ? -particles[this.dataset.key].posY :
							sim_Ui_cameraTransY == 'z' ? -particles[this.dataset.key].posZ : 0;
			};
			divLeft.appendChild(buttonGoto);
			
			let buttonFollow = document.createElement("button");
			buttonFollow.title = "Follow particle";
			buttonFollow.innerHTML = "⤤";
			buttonFollow.dataset.key = i;
			buttonFollow.dataset.following = "false";
			buttonFollow.classList.add("follow");
			buttonFollow.onclick = function() {
				if (this.dataset.following == "true") {
					SimParticleFollow(null);
				} else if (this.dataset.following == "false") {
					SimParticleFollow(this.dataset.key);
				}
			};
			divLeft.appendChild(buttonFollow);
			
			let buttonRemove = document.createElement("button");
			buttonRemove.title = "Remove";
			buttonRemove.innerHTML = "×";
			buttonRemove.dataset.key = i;
			switch (particles) {
				case physics_particles:
					buttonRemove.onclick = function() {
						PhysicsParticleRemove(this.dataset.key);
					};
				break;
				case physics_darkParticles:
					buttonRemove.onclick = function() {
						PhysicsDarkParticleRemove(this.dataset.key);
					};
				break;
			}
			divLeft.appendChild(buttonRemove);
			
			let title = document.createElement("h5");
			title.style.display = "inline";
			title.innerHTML = "Particle #" + i + ": " + particles[i].name;
			divLeft.appendChild(title);
			
			element.appendChild(divLeft);
		}
		
		let divRight = document.createElement("div");
		{ // Right div content.
			let buttonInfo = document.createElement("button");
			buttonInfo.innerHTML = "▶"; // ◀ ▼ ▶
			buttonInfo.dataset.key = i;
			buttonInfo.dataset.clicked = "false";
			buttonInfo.onclick = function() {
				if (this.dataset.clicked == "true") {
					this.dataset.clicked = "false";
					buttonInfo.innerHTML = "▶";
					
					// Close detailed info.
					listContainer.querySelector("div[data-key='" + this.dataset.key + "']").nextSibling.remove();
				} else if (this.dataset.clicked == "false") {
					this.dataset.clicked = "true";
					this.innerHTML = "▼";
					
					// Open detailed info.
					let info = document.createElement("div");
					info.classList.add("info");
					{
						{ // Set posX.
							let posX = document.createElement("div");
							posX.classList.add("flex");
							
							let posXLabel = document.createElement("label");
							posXLabel.innerHTML = "Pos X";
							posX.appendChild(posXLabel);
							
							let posXInc = document.createElement("input");
							posXInc.id = "getPosXInc_" + this.dataset.key;
							posXInc.type = "number";
							posXInc.value = 1;
							posX.appendChild(posXInc);
							
							let posXAdd = document.createElement("button");
							posXAdd.innerHTML = "+";
							posXAdd.dataset.key = this.dataset.key;
							posXAdd.onclick = function() {
								particles[this.dataset.key].posX += Number(document.querySelector("input#getPosXInc_" + this.dataset.key).value);
							};
							posX.appendChild(posXAdd);
							
							let posXSub = document.createElement("button");
							posXSub.innerHTML = "-";
							posXSub.dataset.key = this.dataset.key;
							posXSub.onclick = function() {
								particles[this.dataset.key].posX -= Number(document.querySelector("input#getPosXInc_" + this.dataset.key).value);
							};
							posX.appendChild(posXSub);
							
							info.appendChild(posX);
						}
						
						{ // Set posY.
							let posY = document.createElement("div");
							posY.classList.add("flex");
							
							let posYLabel = document.createElement("label");
							posYLabel.innerHTML = "Pos Y";
							posY.appendChild(posYLabel);
							
							let posYInc = document.createElement("input");
							posYInc.id = "getPosYInc_" + this.dataset.key;
							posYInc.type = "number";
							posYInc.value = 1;
							posY.appendChild(posYInc);
							
							let posYAdd = document.createElement("button");
							posYAdd.innerHTML = "+";
							posYAdd.dataset.key = this.dataset.key;
							posYAdd.onclick = function() {
								particles[this.dataset.key].posY += Number(document.querySelector("input#getPosYInc_" + this.dataset.key).value);
							};
							posY.appendChild(posYAdd);
							
							let posYSub = document.createElement("button");
							posYSub.innerHTML = "-";
							posYSub.dataset.key = this.dataset.key;
							posYSub.onclick = function() {
								particles[this.dataset.key].posY -= Number(document.querySelector("input#getPosYInc_" + this.dataset.key).value);
							};
							posY.appendChild(posYSub);
							
							info.appendChild(posY);
						}
						
						{ // Set posZ.
							let posZ = document.createElement("div");
							posZ.classList.add("flex");
							
							let posZLabel = document.createElement("label");
							posZLabel.innerHTML = "Pos Z";
							posZ.appendChild(posZLabel);
							
							let posZInc = document.createElement("input");
							posZInc.id = "getPosZInc_" + this.dataset.key;
							posZInc.type = "number";
							posZInc.value = 1;
							posZ.appendChild(posZInc);
							
							let posZAdd = document.createElement("button");
							posZAdd.innerHTML = "+";
							posZAdd.dataset.key = this.dataset.key;
							posZAdd.onclick = function() {
								particles[this.dataset.key].posZ += Number(document.querySelector("input#getPosZInc_" + this.dataset.key).value);
							};
							posZ.appendChild(posZAdd);
							
							let posZSub = document.createElement("button");
							posZSub.innerHTML = "-";
							posZSub.dataset.key = this.dataset.key;
							posZSub.onclick = function() {
								particles[this.dataset.key].posZ -= Number(document.querySelector("input#getPosZInc_" + this.dataset.key).value);
							};
							posZ.appendChild(posZSub);
							
							info.appendChild(posZ);
						}
						
						{ // Set speedX.
							let speedX = document.createElement("div");
							speedX.classList.add("flex");
							
							let speedXLabel = document.createElement("label");
							speedXLabel.innerHTML = "Speed X";
							speedX.appendChild(speedXLabel);
							
							let speedXInc = document.createElement("input");
							speedXInc.id = "getSpeedXInc_" + this.dataset.key;
							speedXInc.type = "number";
							speedXInc.value = 1;
							speedX.appendChild(speedXInc);
							
							let speedXAdd = document.createElement("button");
							speedXAdd.innerHTML = "+";
							speedXAdd.dataset.key = this.dataset.key;
							speedXAdd.onclick = function() {
								particles[this.dataset.key].speedX += Number(document.querySelector("input#getSpeedXInc_" + this.dataset.key).value);
							};
							speedX.appendChild(speedXAdd);
							
							let speedXSub = document.createElement("button");
							speedXSub.innerHTML = "-";
							speedXSub.dataset.key = this.dataset.key;
							speedXSub.onclick = function() {
								particles[this.dataset.key].speedX -= Number(document.querySelector("input#getSpeedXInc_" + this.dataset.key).value);
							};
							speedX.appendChild(speedXSub);
							
							info.appendChild(speedX);
						}
						
						{ // Set speedY.
							let speedY = document.createElement("div");
							speedY.classList.add("flex");
							
							let speedYLabel = document.createElement("label");
							speedYLabel.innerHTML = "Speed Y";
							speedY.appendChild(speedYLabel);
							
							let speedYInc = document.createElement("input");
							speedYInc.id = "getSpeedYInc_" + this.dataset.key;
							speedYInc.type = "number";
							speedYInc.value = 1;
							speedY.appendChild(speedYInc);
							
							let speedYAdd = document.createElement("button");
							speedYAdd.innerHTML = "+";
							speedYAdd.dataset.key = this.dataset.key;
							speedYAdd.onclick = function() {
								particles[this.dataset.key].speedY += Number(document.querySelector("input#getSpeedYInc_" + this.dataset.key).value);
							};
							speedY.appendChild(speedYAdd);
							
							let speedYSub = document.createElement("button");
							speedYSub.innerHTML = "-";
							speedYSub.dataset.key = this.dataset.key;
							speedYSub.onclick = function() {
								particles[this.dataset.key].speedY -= Number(document.querySelector("input#getSpeedYInc_" + this.dataset.key).value);
							};
							speedY.appendChild(speedYSub);
							
							info.appendChild(speedY);
						}
						
						{ // Set speedZ.
							let speedZ = document.createElement("div");
							speedZ.classList.add("flex");
							
							let speedZLabel = document.createElement("label");
							speedZLabel.innerHTML = "Speed Z";
							speedZ.appendChild(speedZLabel);
							
							let speedZInc = document.createElement("input");
							speedZInc.id = "getSpeedZInc_" + this.dataset.key;
							speedZInc.type = "number";
							speedZInc.value = 1;
							speedZ.appendChild(speedZInc);
							
							let speedZAdd = document.createElement("button");
							speedZAdd.innerHTML = "+";
							speedZAdd.dataset.key = this.dataset.key;
							speedZAdd.onclick = function() {
								particles[this.dataset.key].speedZ += Number(document.querySelector("input#getSpeedZInc_" + this.dataset.key).value);
							};
							speedZ.appendChild(speedZAdd);
							
							let speedZSub = document.createElement("button");
							speedZSub.innerHTML = "-";
							speedZSub.dataset.key = this.dataset.key;
							speedZSub.onclick = function() {
								particles[this.dataset.key].speedZ -= Number(document.querySelector("input#getSpeedZInc_" + this.dataset.key).value);
							};
							speedZ.appendChild(speedZSub);
							
							info.appendChild(speedZ);
						}
						
						{ // Set mass.
							let mass = document.createElement("div");
							mass.classList.add("flex");
							
							let massLabel = document.createElement("label");
							massLabel.for = "getMass_" + this.dataset.key;
							massLabel.innerHTML = "Mass";
							mass.appendChild(massLabel);
							
							let massInput = document.createElement("input");
							massInput.id = "getMass_" + this.dataset.key;
							massInput.type = "number";
							massInput.value = particles[this.dataset.key].mass;
							mass.appendChild(massInput);
							
							let massButton = document.createElement("button");
							massButton.innerHTML = "Set";
							massButton.dataset.key = this.dataset.key;
							massButton.onclick = function() {
								particles[this.dataset.key].mass = Number(document.querySelector("input#getMass_" + this.dataset.key).value);
							};
							mass.appendChild(massButton);
							
							info.appendChild(mass);
						}
					}
					
					listContainer.querySelector("div[data-key='" + this.dataset.key + "']").after(info);
				}
			};
			
			divRight.style.maxWidth = "10%";
			divRight.appendChild(buttonInfo);
			
			element.appendChild(divRight);
		}
		
		listContainer.appendChild(element);
		listContainer.appendChild(document.createElement("hr"));
	}
}
