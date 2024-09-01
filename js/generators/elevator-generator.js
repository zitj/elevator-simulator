import { Elevator } from '../classes/elevator.js';
import { elevators } from '../../app.js';
import { elevatorsDOM, floorsDOM } from '../DOM/dom-elements.js';
import { STATUS } from '../constants/status.js';

export let distanceBetweenElevators = 0;

function resetDistanceBetweenElevators() {
	distanceBetweenElevators = 0;
}

function setCoordinatesToElevator(elevator, htmlElement, numberOfElevators) {
	const { x, y } = floorsDOM.childNodes[elevator.currentFloor].getBoundingClientRect();
	const floorWidth = floorsDOM.childNodes[elevator.currentFloor].getBoundingClientRect().width;
	let initialX = htmlElement.getBoundingClientRect().x;
	let initialY = htmlElement.getBoundingClientRect().y;
	let divider = 2;
	if (numberOfElevators * 40 + numberOfElevators * (floorWidth / numberOfElevators / divider)) divider = 4;
	distanceBetweenElevators += htmlElement.getBoundingClientRect().width + floorWidth / numberOfElevators / divider;
	elevator.coordinates = { initial: { x: initialX, y: initialY }, floor: { x, y } };
	elevator.coordinates.initial = { x: distanceBetweenElevators, y: initialY };
	elevator.coordinates.floor = { x, y: y - 9 };
	htmlElement.style.position = 'absolute';
	htmlElement.style.left = `${elevator.coordinates.initial.x + 10}px`;
	htmlElement.style.top = `${elevator.coordinates.floor.y}px`;
	htmlElement.dataset.id = elevator.id;
}

function renderElevatorsDOM(elevator, numberOfElevators) {
	let elevatorHTMLelement = document.createElement('div');
	elevatorHTMLelement.classList.add('elevator');
	elevatorsDOM.appendChild(elevatorHTMLelement);
	setCoordinatesToElevator(elevator, elevatorHTMLelement, numberOfElevators);
}

function generateElevators(numberOfElevators) {
	if (numberOfElevators && numberOfElevators > 0) {
		for (let i = 0; i < numberOfElevators; i++) {
			let elevator = new Elevator(i, STATUS.IDLE, 0, null, null);
			elevators.push(elevator);
			renderElevatorsDOM(elevator, numberOfElevators);
		}
	} else {
		console.log(`There are no elevetors inside this building, you will have to take stairs. :)`);
	}
}

export { generateElevators, resetDistanceBetweenElevators };
