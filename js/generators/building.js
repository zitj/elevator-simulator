import {
	callElevatorForm,
	createBuildingForm,
	randomCallsSection,
	floorsDOM,
	elevatorsDOM,
	numberOfFloorsInput,
	numberOfElevatorsInput,
	currentFloorInput,
	destinationFloorInput,
} from '../DOM/dom-elements.js';

import { elevators, resetElevatorsAndFloors, resetRandomElevatorCalls } from '../../app.js';
import { generateFloors } from './floor.js';
import { generateElevators, resetDistanceBetweenElevators } from './elevator.js';

function generateBuilding(numberOfFloors, numberOfElevators) {
	if (numberOfElevators == 0 || numberOfFloors == 0) return;
	generateFloors(numberOfFloors);
	generateElevators(numberOfElevators);
	callElevatorForm.style.display = 'block';
	randomCallsSection.style.display = 'block';
}

function createBuilding() {
	if (numberOfFloorsInput.value == 0 || numberOfElevatorsInput.value == 0) {
		createBuildingForm.querySelector('.warning-message').innerHTML = 'Both values must be greater than 0.';
		return;
	}
	resetElevatorsAndFloors();
	resetDistanceBetweenElevators();
	resetRandomElevatorCalls();

	createBuildingForm.querySelector('.warning-message').innerHTML = '';
	floorsDOM.innerHTML = ``;
	elevatorsDOM.innerHTML = ``;
	generateBuilding(Number(numberOfFloorsInput.value) + 1, Number(numberOfElevatorsInput.value));
	numberOfFloorsInput.value = null;
	numberOfElevatorsInput.value = null;
	currentFloorInput.value = null;
	destinationFloorInput.value = null;
}

export { createBuilding };
