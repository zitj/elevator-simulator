const elevatorsDOM = document.getElementById('elevators');
const floorsDOM = document.getElementById('floors');
const buildingDOM = document.getElementById('building');
const createBuildingForm = document.getElementById('create-building-form');
const callElevatorForm = document.getElementById('call-elevator-form');
const randomCallsSection = document.getElementById('random-calls-section');
const randomButton = document.getElementById('random-calls-button');
const stopRandomButton = document.getElementById('stop-random-calls-button');
const numberOfFloorsInput = document.getElementById('generate-number-of-floors-input');
const numberOfElevatorsInput = document.getElementById('generate-number-of-elevators-input');
const currentFloorInput = document.getElementById('current-floor-input');
const destinationFloorInput = document.getElementById('destination-floor-input');
const body = document.querySelector('body');

export {
	elevatorsDOM,
	floorsDOM,
	buildingDOM,
	createBuildingForm,
	callElevatorForm,
	randomCallsSection,
	randomButton,
	stopRandomButton,
	numberOfFloorsInput,
	numberOfElevatorsInput,
	currentFloorInput,
	destinationFloorInput,
	body,
};
