import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../prescriptions-service/prescriptions.service';
import { Prescription } from '../prescriptions.component';
import { formatDate } from '../common';

@Component({
	selector: 'prescriptions-list',
	templateUrl: './prescriptions-list.component.html',
	styleUrls: ['./prescriptions-list.component.scss']
})
export class PrescriptionsListComponent implements OnInit {
	prescriptions: Prescription[] = [];

	constructor(private prescriptionService: PrescriptionService) { }

	ngOnInit(): void {
		this.getAllRecipes();
		this.prescriptionService.prescriptions$.subscribe((prescriptions) => {
			this.prescriptions = prescriptions;
		});
	}

	getAllRecipes() {
		this.prescriptions = this.prescriptionService.getAllPrescriptions();
	}

	protected daysLeft(targetDate: Date): string {
		const today = new Date();

		const differenceInMs = targetDate.getTime() - today.getTime();

		const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
		if (daysDifference > 0) {
			return daysDifference.toString();
		}
		return "EXPIRED!";
	}

	protected removeRecipe(prescriptionId: number): void {
        if (confirm('Are you sure you want to remove this prescription?')) {
            this.prescriptionService.removePrescription(prescriptionId);
        }
	}

	protected fulfillRecipe(prescriptionId: number): void {
        if (confirm('Are you sure you want to fulfill this prescription?')) {
            this.prescriptionService.fulfillPrescription(prescriptionId);
        }
	}

	protected formatDate(targetDate: Date): string {
		return formatDate(targetDate);
	}
}
