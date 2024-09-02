import { BUTTONS } from './js/constants/buttons.js';
import * as DOMElements from './js/DOM/dom-elements.js';
import { createBuilding } from './js/generators/building-generator.js';
import { passangersShowsUpRandomly } from './js/generators/passanger-generator.js';
import { callElevator } from './js/main-logic.js';

const { createBuildingForm, callElevatorForm, randomCallsSection, randomButton, timerNumberDOM, randomDestinationFloorDOM, randomCurrentFloorDOM } = DOMElements;

export let elevators = [];
export let floors = [];
export let passangers = [];

export let intervals = [];

export let randomElevatorCalls = false;
export function resetRandomElevatorCalls() {
	randomElevatorCalls = false;
}
export function resetElevatorsFloorsAndPassangers() {
	elevators = [];
	floors = [];
	passangers = [];
}
export function clearAllIntervals() {
	intervals.forEach((interval) => {
		clearTimeout(interval);
	});
	timerNumberDOM.innerText = '0';
	randomCurrentFloorDOM.innerText = '-';
	randomDestinationFloorDOM.innerText = '-';
}

const messageAdvice = 'For more enjoyable UI/UX try inserting max 12 for both.';

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

randomButton.addEventListener('click', (event) => {
	if (randomButton.innerText === BUTTONS.START) {
		randomElevatorCalls = true;
		randomButton.innerText = BUTTONS.STOP;
		passangersShowsUpRandomly();
	} else {
		randomButton.innerText = BUTTONS.START;
		randomElevatorCalls = false;
		clearAllIntervals();
	}
});
