import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrescriptionService } from '../prescriptions-service/prescriptions.service';
import { AuthService } from '../../public/auth.service';
import { convertDateToEU } from '../../common/common';

@Component({
	selector: 'prescription-add',
	templateUrl: './add-prescription.component.html',
	styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent implements OnInit {
	now = new Date();
	protected readonly todayAsString = convertDateToEU(this.now.toISOString());
    @Input() medicineName: string | undefined;

    @Output() prescriptionAdded: EventEmitter<string> = new EventEmitter<string>();
    
	protected prescriptionName: string = '';
	protected prescriptionStart: Date = this.now;
	protected prescriptionValidity: number = 30;

	constructor(
        private prescriptionService: PrescriptionService,
        private authService: AuthService,
    ) {}
    
    ngOnInit(): void {
        this.prescriptionName = this.medicineName ?? '';
    }

	addPrescription() {
        if (this.prescriptionService.isThereAValidPrescription(this.prescriptionName, this.prescriptionValidity)) {
            alert('Вече имате рецепта за този медикамент!');
            return;
        }

        if (this.prescriptionValidity <= 0) {
            alert('Моля да бъдем сериозни!');
            return;
        }

		if (this.prescriptionName && this.prescriptionStart && this.prescriptionValidity) {
            console.log('Adding prescription', this.prescriptionName, this.prescriptionStart, this.prescriptionValidity);
			const validTo: Date = new Date(
				new Date(this.prescriptionStart).getTime() + this.prescriptionValidity * 24 * 60 * 60 * 1000
			);
			this.prescriptionService.addPrescription({
				id: this.prescriptionService.getAllPrescriptions().length + 1,
                user: this.authService.getLoggedInUser(),
				medicineName: this.prescriptionName,
				validTo: validTo,
			});
            this.prescriptionAdded.emit(this.prescriptionName);
			// Clear form fields after adding prescription
			this.prescriptionName = '';
			this.prescriptionStart = this.now;
			this.prescriptionValidity = 30;
		} else {
			alert('Попълнете всички полета!');
		}
	}

	protected getToday(): string {
		const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
		return today;
	}
}
