import { floorsDOM, randomCallsSection } from '../DOM/dom-elements.js';
import { randomElevatorCalls, floors } from '../../app.js';
import { callElevator } from '../main-logic.js';

function passangerShowsUpOnFloor(number, elevator) {
	floorsDOM.childNodes.forEach((floor) => {
		if (floor.dataset.id == number) {
			const passangersContainer = floor.querySelector('.passangers');
			if (passangersContainer) {
				let passangerElement = document.createElement('span');
				passangerElement.classList.add('passanger');
				passangerElement.innerHTML = `<span class='icon'>🧍🏽‍♂️</span><span class='words'>To floor no: ${elevator.destinationFloor}</span>`;
				passangerElement.style.left = `${elevator.coordinates.initial.x}px`;
				passangerElement.dataset.waitingForElevator = elevator.id;
				passangersContainer.appendChild(passangerElement);
			}
		}
	});
}

function pickUpPassanger(elevator) {
	let floorNumber = Number(elevator.currentFloor);
	const passangersContainer = floorsDOM.childNodes[floorNumber].querySelector('.passangers');
	passangersContainer.childNodes.forEach((passanger) => {
		const waitingForElevatorNumber = Number(passanger.dataset.waitingForElevator);
		if (waitingForElevatorNumber === elevator.id) {
			passanger.remove();
		}
	});
}

function passangersShowsUpRandomly() {
	let time = 5;
	const timerNumberDOM = randomCallsSection.querySelector('.timer').querySelector('.number');
	const randomCurrentFloorDOM = randomCallsSection.querySelector('.current-floor').querySelector('.number');
	const randomDestinationFloorDOM = randomCallsSection.querySelector('.destination-floor').querySelector('.number');
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
}

export { pickUpPassanger, passangerShowsUpOnFloor, passangersShowsUpRandomly };
