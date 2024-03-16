import { Component } from '@angular/core';
export interface Prescription {
	medicineName: string;
  issued?: Date;
	validTo: Date;
}
@Component({
  selector: 'prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss'
})
export class PrescriptionsComponent {

}
