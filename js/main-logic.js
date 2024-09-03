import { callElevatorForm, currentFloorInput, destinationFloorInput, elevatorsDOM } from './DOM/dom-elements.js';
import { elevators, filterPassangers, intervals, passangers } from '../app.js';
import { checkIfThereArePassangersOnThisFloor, checkIfThisIsDestinationFloorOfPassanger, passangerShowsUpOnFloor, pickUpPassanger } from './generators/passanger-generator.js';
import { STATUS } from './constants/status.js';
import { SYMBOLS } from './constants/symbols.js';

function returnNearestAvailableElevatorFor(passangerCurrentFloor, destinationFloor, isRandomCall) {
	let arrayOfDifferencesInFloors = [];
	for (let i = 0; i < elevators.length; i++) {
		let differenceInFloors = 0;

		if (elevators[i].status == STATUS.IDLE) differenceInFloors = Math.abs(passangerCurrentFloor - elevators[i].currentFloor);
		if (elevators[i].status !== STATUS.IDLE) {
			differenceInFloors = Math.abs(+(elevators[i].currentFloorInMotion - passangerCurrentFloor) - +(passangerCurrentFloor - elevators[i].destinationFloor));
		}
		let elevator = { id: elevators[i].id, differenceInFloors, status: elevators[i].status };
		arrayOfDifferencesInFloors.push(elevator);
	}
	// arrayOfDifferencesInFloors.sort((a, b) => {
	// 	if (a.differenceInFloors === 0) return -1;
	// 	if (b.differenceInFloors === 0) return 1;
	// 	return +a.differenceInFloors - +b.differenceInFloors;
	// });
	arrayOfDifferencesInFloors.sort((a, b) => {
		if (a.differenceInFloors === b.differenceInFloors) {
			if (a.status === STATUS.IDLE && b.status !== STATUS.IDLE) return -1;
			if (a.status !== STATUS.IDLE && b.status === STATUS.IDLE) return 1;
			return 0;
		}
		return a.differenceInFloors - b.differenceInFloors;
	});
	console.log('This is array of differences in floors: ', arrayOfDifferencesInFloors);
	const nearestElevatorID = arrayOfDifferencesInFloors[0] ? arrayOfDifferencesInFloors[0].id : null;
	// console.log(`This elevator NUMBER ${nearestElevatorID} is closest to you: `, elevators[nearestElevatorID]);
	elevatorsDOM.childNodes.forEach((elevatorDOMelement) => {
		if (elevatorDOMelement.dataset.id == nearestElevatorID) {
			elevators[nearestElevatorID].domElement = elevatorDOMelement;
		}
	});
	return elevators[nearestElevatorID];
}

function returnStatus(a, b) {
	if (a - b > 0) return STATUS.MOVING_UP;
	if (a - b < 0) return STATUS.MOVING_DOWN;
	if (a - b === 0) return STATUS.READY;
}

// NEW LOGIC
function activateElevator(elevator) {
	const styleClass = elevator.isRandomCall ? 'active-random' : 'active';
	elevator.domElement.classList.add(styleClass);
	elevator.domElement.querySelector('.destination-floor').innerHTML = `${elevator.destinationFloor}`;
}

function physicallyMove(elevator) {
	const arrowElement = elevator.domElement.querySelector('.arrow');
	const direction = elevator.status == STATUS.MOVING_UP ? 'up' : 'down';
	const opositeDirection = elevator.status == STATUS.MOVING_UP ? 'down' : 'up';
	const arrowSymbol = elevator.status == STATUS.MOVING_UP ? SYMBOLS.ARROW_UP : SYMBOLS.ARROW_DOWN;
	const moveDistance = elevator.status == STATUS.MOVING_UP ? elevator.coordinates.floor.y - 1 - 50 : elevator.coordinates.floor.y + 1 + 50;
	arrowElement.classList.remove(`moving-${opositeDirection}`);
	arrowElement.classList.add(`moving-${direction}`);
	arrowElement.innerHTML = arrowSymbol;
	elevator.coordinates.floor.y = moveDistance;
	elevator.domElement.style.top = `${elevator.coordinates.floor.y}px`;
}

function stopMovement(elevator, interval) {
	elevator.status = STATUS.IDLE;
	elevator.domElement.classList.remove('active');
	elevator.domElement.classList.remove('active-random');
	elevator.domElement.innerHTML = `<span class="arrow"></span><span class='destination-floor'></span><span class='passangers-in-elevator'></span>`;
	elevator.currentFloor = elevator.currentFloorInMotion;
	clearInterval(interval);
}

export function pauseMovement(elevator, interval, pauseDuration) {
	elevator.isPaused = true;
	elevator.domElement.classList.add('pause');
	clearInterval(interval);
	setTimeout(() => {
		elevator.isPaused = false;
		elevator.domElement.classList.remove('pause');
		startMoving(elevator);
	}, pauseDuration);
}

function returnHighestFloorOfPassangersToPickUp(passangers) {
	if (passangers && passangers.length > 0) {
		return passangers.sort((a, b) => b.waitingOnFloorNumber - a.waitingOnFloorNumber)[0].waitingOnFloorNumber;
	} else {
		return null;
	}
}
function returnLowestFloorOfPassangersToLeave(passangers) {
	if (passangers && passangers.length > 0) {
		return passangers.sort((a, b) => a.destinationFloor - b.destinationFloor)[0].destinationFloor;
	} else {
		return null;
	}
}

export function startMoving(elevator) {
	let timer = setInterval(() => {
		elevator.currentFloorInMotion = elevator.currentFloorInMotion !== null ? elevator.currentFloorInMotion : elevator.currentFloor;
		let highestDestinationFloor = returnHighestFloorOfPassangersToPickUp(elevator.passangersToPickUp);
		let lowestDestinationFloor = returnLowestFloorOfPassangersToLeave(elevator.pickedUpPassangers);
		if (highestDestinationFloor !== null) elevator.destinationFloor = +highestDestinationFloor;
		if (lowestDestinationFloor !== null && highestDestinationFloor == null) elevator.destinationFloor = +lowestDestinationFloor;
		elevator.status = returnStatus(elevator.destinationFloor, elevator.currentFloorInMotion);

		if (elevator.passangersToPickUp.length == 0 && elevator.pickedUpPassangers.length == 0) {
			stopMovement(elevator, timer);
		}

		if (elevator.status !== STATUS.IDLE) activateElevator(elevator);
		checkIfThereArePassangersOnThisFloor(elevator);
		checkIfThisIsDestinationFloorOfPassanger(elevator);
		if (elevator.isPaused) {
			pauseMovement(elevator, timer, 500);
		} else {
			if (elevator.status == STATUS.READY && elevator.currentFloorInMotion == elevator.destinationFloor) {
				stopMovement(elevator, timer);
				startMoving(elevator);
			}

			if (elevator.status !== STATUS.IDLE) {
				if (elevator.status == STATUS.MOVING_UP) elevator.currentFloorInMotion = Number(elevator.currentFloorInMotion) + 1;
				if (elevator.status == STATUS.MOVING_DOWN) elevator.currentFloorInMotion = Number(elevator.currentFloorInMotion) - 1;
				elevator.currentFloorInMotion = +elevator.currentFloorInMotion;
				physicallyMove(elevator);
			}
		}
		// console.log('Current floor in motion: ', elevator.currentFloorInMotion);
	}, 700);
	intervals.push(timer);
}

function goToDesiredFloor(elevator) {
	if (elevator.passangersToPickUp && elevator.passangersToPickUp.length > 0) {
		if (elevator.status === STATUS.IDLE) startMoving(elevator);
	}
}

function callElevator(passangersCurrentFloor, destinationFloor, isRandomCall) {
	if (passangersCurrentFloor == destinationFloor) {
		let message = "You don't need an elevator to remain on the same floor :)";
		console.log(message);
		callElevatorForm.querySelector('.warning-message').innerHTML = message;
	} else {
		if (!isRandomCall) {
			currentFloorInput.value = null;
			destinationFloorInput.value = null;
		}
		callElevatorForm.querySelector('.warning-message').innerHTML = ``;
		let nearestElevator = returnNearestAvailableElevatorFor(passangersCurrentFloor, destinationFloor);
		nearestElevator.destinationFloor = destinationFloor;
		nearestElevator.isRandomCall = isRandomCall;
		passangerShowsUpOnFloor(Number(passangersCurrentFloor), nearestElevator);
		goToDesiredFloor(nearestElevator);
	}
}

export { callElevator };
