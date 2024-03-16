import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { PrescriptionsListComponent } from './prescriptions-list/prescriptions-list.component';
import { PrescriptionsComponent } from './prescriptions.component';

@NgModule({
  declarations: [
    AddPrescriptionComponent,
    PrescriptionsComponent,
    PrescriptionsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AddPrescriptionComponent,
    PrescriptionsComponent,
  ]
})
export class PrescriptionModule { }
