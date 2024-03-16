import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  prescriptions: any[] = [];

  constructor() {}

  addPrescription(prescription: any) {
    this.prescriptions.push(prescription);
  }
}
