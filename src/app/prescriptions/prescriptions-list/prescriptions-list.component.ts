import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../prescriptions-service/prescriptions.service';
import { Prescription } from '../prescriptions.component';
import { formatDate } from '../common';
import { AuthService } from '../../public/auth.service';
import { convertDateToEU } from '../../common/common';

@Component({
	selector: 'prescriptions-list',
	templateUrl: './prescriptions-list.component.html',
	styleUrls: ['./prescriptions-list.component.scss']
})
export class PrescriptionsListComponent implements OnInit {
	prescriptions: Prescription[] = [];

	constructor(
        private prescriptionService: PrescriptionService,
        private authService: AuthService,
    ) { }

	ngOnInit(): void {
		this.getAllRecipes();
		this.prescriptionService.prescriptions$.subscribe((prescriptions) => {
			this.prescriptions = prescriptions.filter((prescription) => prescription.user === this.authService.getLoggedInUser());
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
		return "ИЗТЕКЛА!";
	}

	protected removeRecipe(prescriptionId: number): void {
        if (confirm('Сигурни ли сте, че искате да премахнете тази рецепта?')) {
            this.prescriptionService.removePrescription(prescriptionId);
        }
	}

	protected fulfillRecipe(prescriptionId: number): void {
        if (confirm('Сигурни ли сте, че таззи рецепта е изпълнена?')) {
            this.prescriptionService.fulfillPrescription(prescriptionId);
        }
	}

    protected isExpired(recipe: Prescription): boolean {
        const today = new Date();

        return recipe.validTo.getTime() < today.getTime();
    }

    protected formatDate(targetDate: Date): string {
        return convertDateToEU(targetDate.toISOString());
    }
}
