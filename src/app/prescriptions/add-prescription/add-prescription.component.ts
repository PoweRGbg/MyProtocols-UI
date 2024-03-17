import { Component } from '@angular/core';
import { PrescriptionService } from '../prescriptions-service/prescriptions.service';
import { formatDate } from '../common';

@Component({
	selector: 'prescription-add',
	templateUrl: './add-prescription.component.html',
	styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent {
	now = new Date();
	protected readonly todayAsString = formatDate(this.now);
	prescriptionName: string = '';
	prescriptionStart: string = this.todayAsString;
	prescriptionValidity: number = 30;

	constructor(private prescriptionService: PrescriptionService) { }

	addPrescription() {
		console.log('now', this.now);

		console.log('Today is ', this.todayAsString);

		if (this.prescriptionName && this.prescriptionStart && this.prescriptionValidity) {
			const validTo: Date = new Date(
				new Date(this.prescriptionStart).getTime() + this.prescriptionValidity * 24 * 60 * 60 * 1000
			);
			this.prescriptionService.addPrescription({
				id: this.prescriptionService.getAllPrescriptions().length + 1,
				medicineName: this.prescriptionName,
				validTo: validTo,
			});
			// Clear form fields after adding prescription
			this.prescriptionName = '';
			this.prescriptionStart = this.todayAsString;
			this.prescriptionValidity = 30;
		} else {
			alert('Please fill all fields');
		}
	}

	protected getToday(): string {
		const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
		return today;
	}
}
