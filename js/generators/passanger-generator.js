import { floorsDOM, timerNumberDOM, randomCurrentFloorDOM, randomDestinationFloorDOM } from '../DOM/dom-elements.js';
import { randomElevatorCalls, floors, passangers, intervals } from '../../app.js';
import { callElevator } from '../services/elevator-service.js';
import { Passanger } from '../classes/passanger.js';
import { SYMBOLS } from '../constants/symbols.js';

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

export { passangerShowsUpOnFloor, passangersShowsUpRandomly };
