import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'protocol-add-medicine',
	templateUrl: './add-medicine.component.html',
	styleUrl: './add-medicine.component.scss'
})
export class AddMedicineComponent {
	medicineName: string = '';
	@Output() medicineAdded: EventEmitter<string> = new EventEmitter<string>();

	addToProtocol() {
		this.medicineAdded.emit(this.medicineName);
	}
}
