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
	body,
	randomButton,
} from '../DOM/dom-elements.js';

import { elevators, resetElevatorsAndFloors, resetRandomElevatorCalls } from '../../app.js';
import { generateFloors } from './floor.js';
import { generateElevators, resetDistanceBetweenElevators } from './elevator.js';
import { BUTTONS } from '../constants/buttons.js';

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
	randomButton.innerText = BUTTONS.START;
	if ((Number(numberOfFloorsInput.value) + 1 > 7 && window.screen.width < 1800) || Number(numberOfFloorsInput.value) + 1 > 11) {
		body.classList.add('alternative-view');
	} else {
		if (body.classList.contains('alternative-view')) body.classList.remove('alternative-view');
	}
	generateBuilding(Number(numberOfFloorsInput.value) + 1, Number(numberOfElevatorsInput.value));
	numberOfFloorsInput.value = null;
	numberOfElevatorsInput.value = null;
	currentFloorInput.value = null;
	destinationFloorInput.value = null;
}

export { createBuilding };
