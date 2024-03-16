import { Component } from '@angular/core';
import { PrescriptionService } from '../prescriptions-service/prescriptions.service';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent {
  prescriptionName: string = '';
  prescriptionEnd: Date = new Date();
  prescriptionValidity: string = '';

  constructor(private prescriptionService: PrescriptionService) {}

  addPrescription() {
    if (this.prescriptionName && this.prescriptionEnd && this.prescriptionValidity) {
      this.prescriptionService.addPrescription({
        name: this.prescriptionName,
        end: this.prescriptionEnd,
        validity: this.prescriptionValidity
      });
      // Clear form fields after adding prescription
      this.prescriptionName = '';
      this.prescriptionEnd = new Date();
      this.prescriptionValidity = '';
    } else {
      alert('Please fill all fields');
    }
  }
}
