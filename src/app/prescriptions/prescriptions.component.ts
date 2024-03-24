import { Component } from '@angular/core';
export interface Prescription {
    id: number;
    medicineName: string;
    user: string;
    issued?: Date;
    validTo: Date;
    fulfilledDate?: Date;
}
@Component({
    selector: 'prescriptions',
    templateUrl: './prescriptions.component.html',
    styleUrl: './prescriptions.component.scss'
})
export class PrescriptionsComponent {
    protected showAddPrescriptionForm: boolean = false;

    protected showHideAddForm(): void {
        this.showAddPrescriptionForm = !this.showAddPrescriptionForm;
    }

    protected prescriptionAdded(): void {
        this.showAddPrescriptionForm = false;
    }
}
