import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { EditClientComponent } from './client-edit/edit-client.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
@NgModule({
    declarations: [
        ClientsComponent,
        AddClientComponent,
        ListClientsComponent,
        AddPolicyComponent,
        ClientDetailsComponent,
        PolicyDetailsComponent,
        EditClientComponent,
        MonthlyReportComponent,
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
        ReactiveFormsModule,
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
        MonthlyReportComponent,
    ]
})
export class ClientsModule { }
