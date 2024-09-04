import { floorsDOM } from '../DOM/dom-elements.js';
import { SYMBOLS } from '../constants/symbols.js';
import { passangers } from '../../app.js';

function removePassangerDom(elevator) {
	const currentFloor = elevator.currentFloorInMotion ? elevator.currentFloorInMotion : elevator.currentFloor;
	let floorNumber = Number(currentFloor);
	const passangersContainer = floorsDOM.childNodes[floorNumber].querySelector('.passangers');
	passangersContainer.childNodes.forEach((passangerHTMLelement, index) => {
		const waitingForElevator = Number(passangerHTMLelement.dataset.waitingForElevator);
		if (waitingForElevator === elevator.id) {
			passangers.splice(index, 1);
			passangerHTMLelement.remove();
		}
	});
}

function pickUpPassanger(elevator, passanger, index) {
	elevator.domElement.querySelector('.passangers-in-elevator').innerHTML += `<span class="passanger-in-elevator">${SYMBOLS.HEAD}</span>`;
	elevator.pickedUpPassangers.push(passanger);
	elevator.passangersToPickUp.splice(index, 1);
	removePassangerDom(elevator);
}

function checkIfThereArePassangersOnThisFloor(elevator) {
	const currentFloor = elevator.currentFloorInMotion ? elevator.currentFloorInMotion : elevator.currentFloor;
	elevator.passangersToPickUp.forEach((passanger, index) => {
		if (passanger.waitingOnFloorNumber == currentFloor) {
			elevator.isPaused = true;
			pickUpPassanger(elevator, passanger, index);
		}
	});
}

function checkIfThisIsDestinationFloorOfPassanger(elevator) {
	if (elevator.pickedUpPassangers && elevator.pickedUpPassangers.length > 0) {
		elevator.pickedUpPassangers.forEach((passanger, index) => {
			if (passanger.destinationFloor == elevator.currentFloorInMotion) {
				elevator.isPaused = true;
				elevator.pickedUpPassangers.splice(index, 1);
				setTimeout(() => {
					const passangersContainer = elevator.domElement.querySelector('.passangers-in-elevator');
					if (passangersContainer.lastChild) {
						passangersContainer.removeChild(passangersContainer.lastChild);
					}
				}, 300);
			}
		});
	}
}

export { checkIfThisIsDestinationFloorOfPassanger, checkIfThereArePassangersOnThisFloor };
