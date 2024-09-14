import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from '../clients/clients/clients.component';
import { ClientDetailsComponent } from '../clients/client-details/client-details.component';
import { PolicyDetailsComponent } from '../clients/policy-details/policy-details.component';
import { EditClientComponent } from '../clients/client-edit/edit-client.component';

// Routes for child Module (protectedModule). Since protected module is lazy loaded in in the 
// app-routing.module the full path is `/protected/dashboard`
const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'clients',
        component: ClientsComponent
    },
    {
        path: 'client/:clientId',
        component: ClientDetailsComponent
    },
    {
        path: 'client/update/:clientId',
        component: EditClientComponent
    },
    {
        path: 'policy/:clientId/:policyId',
        component: PolicyDetailsComponent
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProtectedRoutingModule { }
