import { floorsDOM } from '../DOM/dom-elements.js';
import { Floor } from '../classes/floor.js';
import { floors } from '../../app.js';

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

export { generateFloors };
