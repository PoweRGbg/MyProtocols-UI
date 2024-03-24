import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { PrescriptionsListComponent } from './prescriptions-list/prescriptions-list.component';
import { PrescriptionsComponent } from './prescriptions.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../public/auth.service';

@NgModule({
  declarations: [
    AddPrescriptionComponent,
    PrescriptionsComponent,
    PrescriptionsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
  ],
  providers: [
    AuthService,
  ],
  exports: [
    AddPrescriptionComponent,
    PrescriptionsComponent,
  ],
})
export class PrescriptionModule { }
