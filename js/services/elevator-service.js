import { checkIfThereArePassangersOnThisFloor, checkIfThisIsDestinationFloorOfPassanger } from './passanger-service.js';
import { elevatorsDOM, currentFloorInput, destinationFloorInput, callElevatorForm } from '../DOM/dom-elements.js';
import { elevators } from '../../app.js';
import { STATUS } from '../constants/status.js';
import { SYMBOLS } from '../constants/symbols.js';
import { passangerShowsUpOnFloor } from '../generators/passanger-generator.js';
export function returnNearestAvailableElevatorFor(passangerCurrentFloor, destinationFloor, isRandomCall) {
	let arrayOfDifferencesInFloors = [];
	for (let i = 0; i < elevators.length; i++) {
		let differenceInFloors = 0;

		if (elevators[i].status == STATUS.IDLE) {
			differenceInFloors = Math.abs(passangerCurrentFloor - elevators[i].currentFloor);
		}
		if (elevators[i].status !== STATUS.IDLE) {
			differenceInFloors = Math.abs(+(elevators[i].currentFloorInMotion - passangerCurrentFloor));
			if (elevators[i].status === STATUS.MOVING_UP || elevators[i].destinationFloor - elevators[i].currentFloorInMotion > 0) {
				if (Math.abs(destinationFloor - elevators[i].destinationFloor) < Math.abs(elevators[i].currentFloorInMotion - elevators[i].destinationFloor)) {
					// differenceInFloors = Math.abs(elevators[i].destinationFloor - elevators[i].currentFloorInMotion) + Math.abs(elevators[i].destinationFloor - destinationFloor);
					// console.log(differenceInFloors);
				}
			}
			if (elevators[i].status === STATUS.MOVING_DOWN || elevators[i].destinationFloor - elevators[i].currentFloorInMotion < 0) {
				if (passangerCurrentFloor < destinationFloor) {
					differenceInFloors = Math.abs(+(elevators[i].destinationFloor - elevators[i].currentFloorInMotion)) + Math.abs(destinationFloor);
				}
			}
		}
		const elevator = {
			id: elevators[i].id,
			differenceInFloors,
			status: elevators[i].status,
			destinationFloor,
			passangerCurrentFloor,
			currentFloor: elevators[i].currentFloorInMotion,
			elevatorCurrentDestinationFloor: elevators[i].destinationFloor,
		};
		arrayOfDifferencesInFloors.push(elevator);
		arrayOfDifferencesInFloors = arrayOfDifferencesInFloors.filter(
			(elevator) =>
				!(elevator.status === STATUS.MOVING_DOWN && elevator.currentFloor < passangerCurrentFloor) && !(elevator.status === STATUS.MOVING_UP && elevator.currentFloor > passangerCurrentFloor)
		);
	}

	arrayOfDifferencesInFloors.sort((a, b) => {
		const aIsMovingDownAndBelow = a.status === STATUS.MOVING_DOWN && a.currentFloor < passangerCurrentFloor;
		const aIsMovingUpAndAbove = a.status === STATUS.MOVING_UP && a.currentFloor > passangerCurrentFloor;
		const bIsMovingDownAndBelow = b.status === STATUS.MOVING_DOWN && b.currentFloor < passangerCurrentFloor;
		const bIsMovingUpAndAbove = b.status === STATUS.MOVING_UP && b.currentFloor > passangerCurrentFloor;

		if (aIsMovingDownAndBelow && !bIsMovingDownAndBelow) return 1;
		if (!aIsMovingDownAndBelow && bIsMovingDownAndBelow) return -1;
		if (aIsMovingUpAndAbove && !bIsMovingUpAndAbove) return 1;
		if (!aIsMovingUpAndAbove && bIsMovingUpAndAbove) return -1;

		if (a.differenceInFloors === b.differenceInFloors) {
			if (a.status === STATUS.IDLE && b.status !== STATUS.IDLE) return -1;
			if (a.status !== STATUS.IDLE && b.status === STATUS.IDLE) return 1;
			return 0;
		}
		return +a.differenceInFloors - +b.differenceInFloors;
	});

	const nearestElevatorID = arrayOfDifferencesInFloors[0] ? arrayOfDifferencesInFloors[0].id : null;
	elevatorsDOM.childNodes.forEach((elevatorDOMelement) => {
		if (elevatorDOMelement.dataset.id == nearestElevatorID) {
			elevators[nearestElevatorID].domElement = elevatorDOMelement;
		}
	});
	return elevators[nearestElevatorID];
}

// NEW LOGIC
function activateElevator(elevator) {
	let styleClass = elevator.isRandomCall ? 'active-random' : 'active';
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
	elevator.domElement.querySelector('.destination-floor').innerHTML = `${elevator.currentFloorInMotion}`;
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
function returnDestinationFloorToLeave(elevator) {
	const passangers = elevator.pickedUpPassangers;
	if (passangers && passangers.length > 0) {
		// if (elevator.status === STATUS.MOVING_DOWN) return passangers.sort((a, b) => a.destinationFloor - b.destinationFloor)[0].destinationFloor;
		// if (elevator.status === STATUS.MOVING_UP) return passangers.sort((a, b) => b.destinationFloor - a.destinationFloor)[0].destinationFloor;
		// if (elevator.status === STATUS.READY) {
		// 	return passangers.sort((a, b) => a.destinationFloor - b.destinationFloor)[0].destinationFloor;
		// }
		return passangers[0].destinationFloor;
	} else {
		return null;
	}
}

function returnStatus(a, b, previousStatus) {
	// if ((previousStatus === STATUS.MOVING_UP || previousStatus === STATUS.MOVING_DOWN) && a - b === 0) return previousStatus;
	if (a - b > 0) return STATUS.MOVING_UP;
	if (a - b < 0) return STATUS.MOVING_DOWN;
	if (a - b === 0) return STATUS.READY;
}

export function startMoving(elevator) {
	let timer = setInterval(() => {
		elevator.currentFloorInMotion = elevator.currentFloorInMotion !== null ? elevator.currentFloorInMotion : elevator.currentFloor;
		let highestDestinationFloor = returnHighestFloorOfPassangersToPickUp(elevator.passangersToPickUp);
		let destinationFloor = returnDestinationFloorToLeave(elevator);
		if (highestDestinationFloor !== null) elevator.destinationFloor = +highestDestinationFloor;
		if (destinationFloor !== null && highestDestinationFloor == null) elevator.destinationFloor = +destinationFloor;
		elevator.status = returnStatus(elevator.destinationFloor, elevator.currentFloorInMotion, elevator.status);

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
	// intervals.push(timer);
}

function goToDesiredFloor(elevator) {
	if (elevator.passangersToPickUp && elevator.passangersToPickUp.length > 0) {
		if (elevator.status === STATUS.IDLE) startMoving(elevator);
	}
}

export function callElevator(passangersCurrentFloor, destinationFloor, isRandomCall) {
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
		if (nearestElevator !== null && nearestElevator !== undefined) {
			nearestElevator.destinationFloor = destinationFloor;
			nearestElevator.isRandomCall = isRandomCall;
			passangerShowsUpOnFloor(Number(passangersCurrentFloor), nearestElevator);
			goToDesiredFloor(nearestElevator);
		}
	}
}
