export class Elevator {
	constructor(id, status, currentFloor, coordinates, destinationFloor) {
		this.id = id;
		this.status = status;
		this.currentFloor = currentFloor;
		this.currentFloorInMotion = null;
		this.coordinates = coordinates;
		this.destinationFloor = destinationFloor;
		this.passangersToPickUp = [];
		this.pickedUpPassangers = [];
		this.isPaused = true;
	}
}
