import { Component } from '@angular/core';
export interface Prescription {
  id: number;
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
