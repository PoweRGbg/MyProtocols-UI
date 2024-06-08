import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { PrescriptionModule } from '../prescriptions/prescriptions.module';
import { ProtocolsModule } from '../protocols/protocols.module';
import { DashboardNotificationsComponent } from './dashboard/notifications/notifications.component';
import { ClientsModule } from '../clients/clients.module';

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardNotificationsComponent,
    ],
    imports: [
        CommonModule,
        ProtectedRoutingModule,
        MatButtonModule,
        PrescriptionModule,
        ProtocolsModule,
        ClientsModule,
    ]
})
export class ProtectedModule { }