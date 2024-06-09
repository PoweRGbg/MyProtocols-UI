import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddClientComponent } from './add-client/add-client.component';
import { ClientsComponent } from './clients/clients.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { MatButtonModule } from '@angular/material/button';
import { PrescriptionModule } from '../prescriptions/prescriptions.module';
import { AuthService } from '../public/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AddPolicyComponent } from './add-policy/add-policy.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { PolicyDetailsComponent } from './policy-details/policy-details.component';
@NgModule({
    declarations: [
        ClientsComponent,
        AddClientComponent,
        ListClientsComponent,
        AddPolicyComponent,
        ClientDetailsComponent,
        PolicyDetailsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        PrescriptionModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatRadioButton,
        MatRadioGroup,
        MatSelectModule,
    ],
    providers: [
        AuthService,
        provideNativeDateAdapter(),
    ],
    exports: [
        ClientsComponent,
        ClientDetailsComponent,
        AddClientComponent,
        AddPolicyComponent,
        PolicyDetailsComponent,
    ]
})
export class ClientsModule { }
