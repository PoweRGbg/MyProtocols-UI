import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrescriptionService } from '../prescriptions-service/prescriptions.service';
import { formatDate } from '../common';

@Component({
	selector: 'prescription-add',
	templateUrl: './add-prescription.component.html',
	styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent implements OnInit {
	now = new Date();
	protected readonly todayAsString = formatDate(this.now);
    @Input() medicineName: string | undefined;

    @Output() prescriptionAdded: EventEmitter<string> = new EventEmitter<string>();
    
	protected prescriptionName: string = '';
	protected prescriptionStart: string = this.todayAsString;
	protected prescriptionValidity: number = 30;

	constructor(private prescriptionService: PrescriptionService) {}

    ngOnInit(): void {
        this.prescriptionName = this.medicineName ?? '';
        console.log('this.medicineName', this.medicineName);
        console.log('this.prescriptionName', this.prescriptionName);
    }

	addPrescription() {
        if (this.prescriptionService.isThereAValidPrescription(this.prescriptionName)) {
            alert('There is already a valid prescription for this medicine');
            return;
        }

		if (this.prescriptionName && this.prescriptionStart && this.prescriptionValidity) {
			const validTo: Date = new Date(
				new Date(this.prescriptionStart).getTime() + this.prescriptionValidity * 24 * 60 * 60 * 1000
			);
			this.prescriptionService.addPrescription({
				id: this.prescriptionService.getAllPrescriptions().length + 1,
				medicineName: this.prescriptionName,
				validTo: validTo,
			});
            this.prescriptionAdded.emit(this.prescriptionName);
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
