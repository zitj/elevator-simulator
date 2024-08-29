class Elevator {
	constructor(id, status, currentFloor, movingInDirection) {
		this.id = id;
		(this.status = status), (this.currentFloor = currentFloor), (this.movingInDirection = movingInDirection);
	}
}

class Floor {
	constructor(id) {
		this.id = id;
	}
}

let elevators = [];
let floors = [];

//DOM
const elevatorsDOM = document.getElementById('elevators');
const floorsDOM = document.getElementById('floors');
const buildingDOM = document.getElementById('building');
const createBuildingForm = document.getElementById('create-building-form');
const callElevatorForm = document.getElementById('call-elevator-form');
createBuildingForm.querySelector('.warning-message').innerHTML = 'For more enjoyable UI/UX try inserting maximum 12 for both.';
callElevatorForm.style.display = 'none';

function generateFloors(numberOfFloors) {
	if (numberOfFloors && numberOfFloors > 0) {
		for (let i = 0; i < numberOfFloors; i++) {
			let floor = new Floor(i);
			floors.push(floor);
			let floorHTMLelement = document.createElement('div');
			floorHTMLelement.classList.add('floor');
			floorHTMLelement.dataset.id = i;
			const text = i > 0 ? i : 'Ground floor';
			floorHTMLelement.innerHTML += `<span class="floor-number">${text}</span>`;
			floorHTMLelement.innerHTML += `<div class="passangers"></div>`;
			floorsDOM.appendChild(floorHTMLelement);
		}
	} else {
		console.log(`There are no floors in this building.`);
	}
}

function setCoordinatesToElevator(elevator, htmlElement) {
	const { x, y } = floorsDOM.childNodes[elevator.currentFloor].getBoundingClientRect();
	let initialX = htmlElement.getBoundingClientRect().x;
	let initialY = htmlElement.getBoundingClientRect().y;
	distanceBetweenElevators += htmlElement.getBoundingClientRect().width + 40;
	elevator.coordinates = { initial: { x: initialX, y: initialY }, floor: { x, y } };
	elevator.coordinates.initial = { x: distanceBetweenElevators, y: initialY };
	elevator.coordinates.floor = { x, y: y - 9 };
	htmlElement.style.position = 'absolute';
	htmlElement.style.left = `${elevator.coordinates.initial.x + 10}px`;
	htmlElement.style.top = `${elevator.coordinates.floor.y}px`;
	htmlElement.dataset.id = elevator.id;
	htmlElement.innerHTML = `<span>${elevator.id + 1}</span>`;
}

function renderElevatorsDOM(elevator) {
	let elevatorHTMLelement = document.createElement('div');
	elevatorHTMLelement.classList.add('elevator');
	elevatorsDOM.appendChild(elevatorHTMLelement);
	setCoordinatesToElevator(elevator, elevatorHTMLelement);
}

function generateElevators(numberOfElevators) {
	if (numberOfElevators && numberOfElevators > 0) {
		let = distanceBetweenElevators = 0;
		for (let i = 0; i < numberOfElevators; i++) {
			// let elevator = new Elevator(i, 'idle', Math.floor(Math.random() * (4 - 1 + 1)) + 1, null);
			let elevator = new Elevator(i, 'idle', 0, null);
			elevators.push(elevator);
			renderElevatorsDOM(elevator);
		}
		// console.log(`There are ${numberOfElevators} elevators in this building: `, elevators);
	} else {
		console.log(`There are no elevetors inside this building, you will have to take stairs. :)`);
	}
}

function generateBuilding(numberOfFloors, numberOfElevators) {
	if (numberOfElevators == 0 || numberOfFloors == 0) return;
	generateFloors(numberOfFloors);
	generateElevators(numberOfElevators);
	callElevatorForm.style.display = 'block';
	createBuildingForm.classList.add('hide');
	callElevatorForm.classList.add('move-left');
}

function returnNearestAvailableElevatorFor(currentFloor, destination) {
	let arrayOfDifferencesInFloors = [];
	for (let i = 0; i < elevators.length; i++) {
		if (elevators[i].status == 'idle') {
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
		}
	});
	return elevators[nearestElevatorID];
}

function returnStatus(a, b) {
	if (a - b > 0) return 'moving UP';
	if (a - b < 0) return 'moving DOWN';
	if (a - b === 0) return 'READY';
}

function passangerShowsUpOnFloor(number, elevator) {
	floorsDOM.childNodes.forEach((floor) => {
		if (floor.dataset.id == number) {
			const passangersContainer = floor.querySelector('.passangers');
			if (passangersContainer) {
				let passangerElement = document.createElement('span');
				passangerElement.classList.add('passanger');
				passangerElement.innerHTML = '🧍🏽‍♂️';
				passangerElement.style.left = `${elevator.coordinates.initial.x}px`;
				passangerElement.dataset.waitingForElevator = elevator.id;
				passangersContainer.appendChild(passangerElement);
			}
		}
	});
}

function callElevator(passangersCurrentFloor, destinationFloor) {
	if (passangersCurrentFloor == destinationFloor) {
		let message = "You don't need an elevator to remain on the same floor :)";
		console.log(message);
		callElevatorForm.querySelector('.warning-message').innerHTML = message;
	} else {
		callElevatorForm.querySelector('.warning-message').innerHTML = ``;
		let nearestElevator = returnNearestAvailableElevatorFor(passangersCurrentFloor, destinationFloor);
		nearestElevator.status = returnStatus(passangersCurrentFloor, nearestElevator.currentFloor);
		console.log('This is nearest elevator: ', nearestElevator);
		passangerShowsUpOnFloor(Number(passangersCurrentFloor), nearestElevator);
		if (nearestElevator.status === 'READY') goTo(destinationFloor, passangersCurrentFloor, nearestElevator);
		if (nearestElevator.status !== 'READY') goTo(passangersCurrentFloor, nearestElevator.currentFloor, nearestElevator, destinationFloor);
	}
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

function goTo(destinationFloor, currentFloor, nearestElevator, finalDestination) {
	let floorCounter = 0;
	const totalFloors = Math.abs(destinationFloor - currentFloor);

	let timer = setInterval(() => {
		if (floorCounter >= totalFloors) {
			nearestElevator.status = finalDestination !== null && finalDestination !== undefined ? 'READY' : 'idle';
			nearestElevator.currentFloor = destinationFloor;
			if (nearestElevator.status === 'READY') {
				console.log(`The elevator NUMBER ${nearestElevator.id} is READY. Moving to final destination.`);
				nearestElevator.domElement.classList.add('pause');
				setTimeout(() => {
					pickUpPassanger(nearestElevator);
					nearestElevator.domElement.classList.remove('pause');
					goTo(finalDestination, destinationFloor, nearestElevator, null);
				}, 800);
			} else {
				nearestElevator.domElement.classList.remove('active');
				console.log(`The elevator NUMBER ${nearestElevator.id} is now idle again.`, nearestElevator);
			}
			clearInterval(timer);
		} else {
			floorCounter++;
			nearestElevator.status = returnStatus(destinationFloor, currentFloor);
			console.log(`The elevator NUMBER ${nearestElevator.id} is ${nearestElevator.status} ${floorCounter} floors`);

			if (finalDestination == null && finalDestination == undefined) pickUpPassanger(nearestElevator);
			if (nearestElevator.status == 'moving UP') {
				nearestElevator.coordinates.floor.y = nearestElevator.coordinates.floor.y - 1 - 50;
				nearestElevator.domElement.style.top = `${nearestElevator.coordinates.floor.y}px`;
			}
			if (nearestElevator.status == 'moving DOWN') {
				nearestElevator.coordinates.floor.y = nearestElevator.coordinates.floor.y + 1 + 50;
				nearestElevator.domElement.style.top = `${nearestElevator.coordinates.floor.y}px`;
			}
		}
	}, 700);
}

function createBuilding() {
	const numberOfFloorsInput = document.getElementById('generate-number-of-floors-input');
	const numberOfElevatorsInput = document.getElementById('generate-number-of-elevators-input');
	if (numberOfFloorsInput.value == 0 || numberOfElevatorsInput.value == 0) {
		createBuildingForm.querySelector('.warning-message').innerHTML = 'Both values must be greater than 0.';
		return;
	}
	floors = [];
	elevators = [];
	createBuildingForm.querySelector('.warning-message').innerHTML = '';
	floorsDOM.innerHTML = ``;
	elevatorsDOM.innerHTML = ``;
	generateBuilding(Number(numberOfFloorsInput.value) + 1, Number(numberOfElevatorsInput.value));
	numberOfFloorsInput.value = null;
	numberOfElevatorsInput.value = null;
}

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
	if (createBuildingForm.classList.contains('hide')) {
		createBuildingForm.classList.remove('hide');
		callElevatorForm.classList.remove('move-left');
	}
	let htmlElement = event.target;
	if (htmlElement.classList.contains('create-button')) createBuilding();
	if (htmlElement.classList.contains('hide-button')) {
		createBuildingForm.classList.add('hide');
		if (callElevatorForm.style.display == 'block') {
			callElevatorForm.classList.add('move-left');
		}
	}
});
