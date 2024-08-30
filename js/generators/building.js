import { callElevatorForm, createBuildingForm, randomCallsSection, floorsDOM, elevatorsDOM, buildingDOM } from '../DOM/dom-elements.js';
import { floors, elevators, resetElevatorsAndFloors } from '../../app.js';
import { generateFloors } from './floor.js';
import { distanceBetweenElevators, generateElevators, resetDistance } from './elevator.js';

function generateBuilding(numberOfFloors, numberOfElevators) {
	if (numberOfElevators == 0 || numberOfFloors == 0) return;
	generateFloors(numberOfFloors);
	generateElevators(numberOfElevators);
	callElevatorForm.style.display = 'block';
	randomCallsSection.style.display = 'block';
}

function createBuilding() {
	const numberOfFloorsInput = document.getElementById('generate-number-of-floors-input');
	const numberOfElevatorsInput = document.getElementById('generate-number-of-elevators-input');
	if (numberOfFloorsInput.value == 0 || numberOfElevatorsInput.value == 0) {
		createBuildingForm.querySelector('.warning-message').innerHTML = 'Both values must be greater than 0.';
		return;
	}
	resetElevatorsAndFloors();
	resetDistance();
	createBuildingForm.querySelector('.warning-message').innerHTML = '';
	floorsDOM.innerHTML = ``;
	elevatorsDOM.innerHTML = ``;
	generateBuilding(Number(numberOfFloorsInput.value) + 1, Number(numberOfElevatorsInput.value));
	numberOfFloorsInput.value = null;
	numberOfElevatorsInput.value = null;
	console.log(elevators);
}

export { createBuilding };
