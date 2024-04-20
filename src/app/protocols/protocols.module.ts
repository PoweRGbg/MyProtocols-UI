import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddProtocolComponent } from './add-protocol/add-protocol.component';
import { ProtocolsComponent } from './protocols/protocols.component';
import { AddMedicineComponent } from './add-medicine/add-medicine.component';
import { ListProtocolsComponent } from './list-protocols/list-protocols.component';
import { MatButtonModule } from '@angular/material/button';
import { PrescriptionModule } from '../prescriptions/prescriptions.module';
import { AuthService } from '../public/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
@NgModule({
    declarations: [
        ProtocolsComponent,
        AddMedicineComponent,
        AddProtocolComponent,
        ListProtocolsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        PrescriptionModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
    ],
    providers: [
        AuthService,
        provideNativeDateAdapter(),
    ],
    exports: [
        ProtocolsComponent,
        AddProtocolComponent,
    ]
})
export class ProtocolsModule { }
