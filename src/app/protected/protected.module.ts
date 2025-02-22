import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { DashboardNotificationsComponent } from './dashboard/notifications/notifications.component';
import { ClientsModule } from '../clients/clients.module';
import { LastChangesComponent } from '../clients/latest-changes/latest-changes.component';

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardNotificationsComponent,
    ],
    imports: [
        CommonModule,
        ProtectedRoutingModule,
        MatButtonModule,
        ClientsModule,
    ]
})
export class ProtectedModule { }