import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { PrescriptionsListComponent } from './prescriptions-list/prescriptions-list.component';
import { PrescriptionsComponent } from './prescriptions.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../public/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

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
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  providers: [
    AuthService,
    provideNativeDateAdapter(),
  ],
  exports: [
    AddPrescriptionComponent,
    PrescriptionsComponent,
  ],
})
export class PrescriptionModule { }
