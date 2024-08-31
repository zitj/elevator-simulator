import { callElevatorForm, elevatorsDOM } from './DOM/dom-elements.js';
import { elevators } from '../app.js';
import { passangerShowsUpOnFloor, pickUpPassanger } from './generators/passanger.js';
import { STATUS } from './constants/status.js';

function returnNearestAvailableElevatorFor(currentFloor, destination, isRandomCall) {
	let arrayOfDifferencesInFloors = [];
	for (let i = 0; i < elevators.length; i++) {
		if (elevators[i].status == STATUS.IDLE) {
			let differenceInFloors = 0;
			let elevator = { id: elevators[i].id, differenceInFloors };

			elevator.differenceInFloors = Math.abs(currentFloor - elevators[i].currentFloor);
			arrayOfDifferencesInFloors.push(elevator);
		}
	}
	arrayOfDifferencesInFloors.sort((a, b) => {
		if (a.differenceInFloors === 0) return -1;
		if (b.differenceInFloors === 0) return 1;
		return +a.differenceInFloors - +b.differenceInFloors;
	});
	const nearestElevatorID = arrayOfDifferencesInFloors[0].id;
	console.log(`This elevator NUMBER ${nearestElevatorID} is closest to you: `, elevators[nearestElevatorID]);
	elevatorsDOM.childNodes.forEach((elevatorDOMelement) => {
		if (elevatorDOMelement.dataset.id == nearestElevatorID) {
			elevators[nearestElevatorID].domElement = elevatorDOMelement;
			elevatorDOMelement.classList.add('active');
			if (isRandomCall) elevatorDOMelement.classList.add('active-random');
		}
	});
	return elevators[nearestElevatorID];
}

function returnStatus(a, b) {
	if (a - b > 0) return STATUS.MOVING_UP;
	if (a - b < 0) return STATUS.MOVING_DOWN;
	if (a - b === 0) return STATUS.READY;
}

function goTo(destinationFloor, currentFloor, nearestElevator, finalDestination) {
	let floorCounter = 0;
	const totalFloors = Math.abs(destinationFloor - currentFloor);
	nearestElevator.domElement.innerHTML = `<span class="arrow"></span><span class='destination-floor'>${destinationFloor}</span>`;
	if (nearestElevator.status == STATUS.MOVING_UP) nearestElevator.domElement.querySelector('.arrow').innerHTML = '&#8679;';
	if (nearestElevator.status == STATUS.MOVING_DOWN) nearestElevator.domElement.querySelector('.arrow').innerHTML = '&#8681;';
	let timer = setInterval(() => {
		if (floorCounter >= totalFloors) {
			nearestElevator.status = finalDestination !== null && finalDestination !== undefined ? STATUS.READY : STATUS.IDLE;
			nearestElevator.currentFloor = destinationFloor;
			if (nearestElevator.status == STATUS.MOVING_UP) nearestElevator.domElement.querySelector('.arrow').innerHTML = '&#8679;';
			if (nearestElevator.status == STATUS.MOVING_DOWN) nearestElevator.domElement.querySelector('.arrow').innerHTML = '&#8681;';
			if (nearestElevator.status === STATUS.READY) {
				console.log(`The elevator NUMBER ${nearestElevator.id} is READY. Moving to final destination.`);
				nearestElevator.domElement.classList.add('pause');
				setTimeout(() => {
					pickUpPassanger(nearestElevator);
					nearestElevator.domElement.classList.remove('pause');

					goTo(finalDestination, destinationFloor, nearestElevator, null);
				}, 800);
			} else {
				nearestElevator.domElement.classList.remove('active');
				nearestElevator.domElement.classList.remove('active-random');
				nearestElevator.domElement.innerHTML = ``;
				console.log(`The elevator NUMBER ${nearestElevator.id} is now idle again.`, nearestElevator);
			}
			clearInterval(timer);
		} else {
			floorCounter++;
			nearestElevator.status = returnStatus(destinationFloor, currentFloor);
			console.log(`The elevator NUMBER ${nearestElevator.id} is ${nearestElevator.status} ${floorCounter} floors`);

			if (finalDestination == null && finalDestination == undefined) pickUpPassanger(nearestElevator);
			if (nearestElevator.status == STATUS.MOVING_UP) {
				nearestElevator.domElement.querySelector('.arrow').classList.remove('moving-down');
				nearestElevator.domElement.querySelector('.arrow').classList.add('moving-up');
				nearestElevator.domElement.querySelector('.arrow').innerHTML = '&#8679;';
				nearestElevator.coordinates.floor.y = nearestElevator.coordinates.floor.y - 1 - 50;
				nearestElevator.domElement.style.top = `${nearestElevator.coordinates.floor.y}px`;
			}
			if (nearestElevator.status == STATUS.MOVING_DOWN) {
				nearestElevator.domElement.querySelector('.arrow').classList.remove('moving-up');
				nearestElevator.domElement.querySelector('.arrow').classList.add('moving-down');
				nearestElevator.domElement.querySelector('.arrow').innerHTML = '&#8681;';
				nearestElevator.coordinates.floor.y = nearestElevator.coordinates.floor.y + 1 + 50;
				nearestElevator.domElement.style.top = `${nearestElevator.coordinates.floor.y}px`;
			}
		}
	}, 700);
}

function callElevator(passangersCurrentFloor, destinationFloor, isRandomCall) {
	if (passangersCurrentFloor == destinationFloor) {
		let message = "You don't need an elevator to remain on the same floor :)";
		console.log(message);
		callElevatorForm.querySelector('.warning-message').innerHTML = message;
	} else {
		callElevatorForm.querySelector('.warning-message').innerHTML = ``;
		let nearestElevator = returnNearestAvailableElevatorFor(passangersCurrentFloor, destinationFloor, isRandomCall);
		nearestElevator.status = returnStatus(passangersCurrentFloor, nearestElevator.currentFloor);
		console.log('This is nearest elevator: ', nearestElevator);
		nearestElevator.destinationFloor = destinationFloor;
		passangerShowsUpOnFloor(Number(passangersCurrentFloor), nearestElevator);
		if (nearestElevator.status === STATUS.READY) goTo(destinationFloor, passangersCurrentFloor, nearestElevator);
		if (nearestElevator.status !== STATUS.READY) goTo(passangersCurrentFloor, nearestElevator.currentFloor, nearestElevator, destinationFloor);
	}
}

export { callElevator };
