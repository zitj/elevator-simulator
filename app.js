import * as DOMElements from './js/DOM/dom-elements.js';
import { createBuilding } from './js/generators/building.js';
import { passangersShowsUpRandomly } from './js/generators/passanger.js';
import { callElevator } from './js/main-logic.js';

const { createBuildingForm, callElevatorForm, randomCallsSection, startRandomButton, stopRandomButton } = DOMElements;

export let elevators = [];
export let floors = [];
export let randomElevatorCalls = false;
export function resetRandomElevatorCalls() {
	randomElevatorCalls = false;
}
export function resetElevatorsAndFloors() {
	elevators = [];
	floors = [];
}

const messageAdvice = 'For more enjoyable UI/UX try inserting maximum 10 for both.';

createBuildingForm.querySelector('.warning-message').innerHTML = messageAdvice;
callElevatorForm.style.display = 'none';
randomCallsSection.style.display = 'none';

callElevatorForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const currentFloorInput = document.getElementById('current-floor-input');
	const destinationFloorInput = document.getElementById('destination-floor-input');
	const currentFloor = currentFloorInput.value;
	const destinationFloor = destinationFloorInput.value;
	if (currentFloor >= floors.length || destinationFloor >= floors.length) {
		callElevatorForm.querySelector('.warning-message').innerHTML = `This building only has ${floors.length - 1} floors.`;
		return;
	}
	callElevatorForm.querySelector('.warning-message').innerHTML = '';
	callElevator(currentFloor, destinationFloor);
});

createBuildingForm.addEventListener('click', (event) => {
	event.preventDefault();
	let htmlElement = event.target;
	if (htmlElement.classList.contains('create-button')) createBuilding();
});

startRandomButton.addEventListener('click', (event) => {
	randomElevatorCalls = true;
	passangersShowsUpRandomly();
});

stopRandomButton.addEventListener('click', (event) => {
	randomElevatorCalls = false;
});
