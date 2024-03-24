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
    ],
    providers: [
        AuthService
    ],
    exports: [
        ProtocolsComponent,
        AddProtocolComponent,
    ]
})
export class ProtocolsModule { }
