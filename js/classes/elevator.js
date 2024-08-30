export class Elevator {
	constructor(id, status, currentFloor, movingInDirection) {
		this.id = id;
		(this.status = status), (this.currentFloor = currentFloor), (this.movingInDirection = movingInDirection);
	}
}
