import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { PrescriptionsComponent } from './prescriptions.component';

@NgModule({
  declarations: [
    AddPrescriptionComponent,
    PrescriptionsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddPrescriptionComponent,
    PrescriptionsComponent,
  ]
})
export class PrescriptionModule { }
