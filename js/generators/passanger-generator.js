import { floorsDOM, timerNumberDOM, randomCurrentFloorDOM, randomDestinationFloorDOM } from '../DOM/dom-elements.js';
import { randomElevatorCalls, floors, passangers, intervals } from '../../app.js';
import { callElevator } from '../main-logic.js';
import { Passanger } from '../classes/passanger.js';
import { SYMBOLS } from '../constants/symbols.js';

function checkIfThereArePassangersOnThisFloor(elevator) {
	const currentFloor = elevator.currentFloorInMotion ? elevator.currentFloorInMotion : elevator.currentFloor;
	elevator.passangersToPickUp.forEach((passanger, index) => {
		if (passanger.waitingOnFloorNumber == currentFloor) {
			elevator.isPaused = true;
			pickUpPassanger(elevator, passanger, index);
		}
	});
	// console.log('Check if ther is passanger to pick up: ', elevator.passangersToPickUp);
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
		// console.log('Check if there are passangers to leave: ', elevator.pickedUpPassangers);
	}
}

function passangerShowsUpOnFloor(number, elevator) {
	const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	// const randomisePersonTypeNumber = Math.floor(Math.random() * 7);
	const passanger = new Passanger(uniqueId, number, elevator.id, elevator.destinationFloor);
	passangers.push(passanger);
	elevator.passangersToPickUp.push(passanger);

	floorsDOM.childNodes.forEach((floor) => {
		if (floor.dataset.id == number) {
			const passangersContainer = floor.querySelector('.passangers');
			if (passangersContainer) {
				let passangerElement = document.createElement('span');
				passangerElement.classList.add('passanger');
				passangerElement.innerHTML = `<span class='icon'>${SYMBOLS.PERSON}</span><span class='words'>To floor no: ${elevator.destinationFloor}</span>`;
				passangerElement.style.left = `${elevator.coordinates.initial.x + 10}px`;
				passangerElement.dataset.waitingForElevator = elevator.id;
				passangersContainer.appendChild(passangerElement);
			}
		}
	});
	// console.log('Passanger shows up on floor: ', elevator);
}

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

function passangersShowsUpRandomly() {
	let time = 5;

	let timerCounter = setInterval(() => {
		time--;
		if (time < 0) time = 4;
		if (!randomElevatorCalls) {
			time = 0;
			randomCurrentFloorDOM.innerHTML = '-';
			randomDestinationFloorDOM.innerHTML = '-';
			clearInterval(timerCounter);
		}
		timerNumberDOM.innerHTML = `${time}`;
	}, 1000);
	intervals.push(timerCounter);

	let timer = setInterval(() => {
		time = 0;
		if (randomElevatorCalls) {
			let randomCurrentFloor = Math.floor(Math.random() * floors.length);
			let randomDestinationFloor = Math.floor(Math.random() * floors.length);
			while (randomCurrentFloor === randomDestinationFloor) {
				randomDestinationFloor = Math.floor(Math.random() * floors.length);
			}
			randomCurrentFloorDOM.innerHTML = `${randomCurrentFloor}`;
			randomDestinationFloorDOM.innerHTML = `${randomDestinationFloor}`;
			callElevator(randomCurrentFloor, randomDestinationFloor, true);
		} else {
			clearInterval(timer);
		}
	}, 5000);
	intervals.push(timer);
}

export { pickUpPassanger, passangerShowsUpOnFloor, passangersShowsUpRandomly, checkIfThereArePassangersOnThisFloor, checkIfThisIsDestinationFloorOfPassanger };
