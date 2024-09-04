export class Passanger {
	constructor(id, waitingOnFloorNumber, waitingForElevator, destinationFloor) {
		this.id = id;
		this.waitingOnFloorNumber = waitingOnFloorNumber;
		this.waitingForElevator = waitingForElevator;
		this.destinationFloor = destinationFloor;
		this.status = 'waiting';
	}
}
