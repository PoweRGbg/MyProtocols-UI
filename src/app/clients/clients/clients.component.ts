import { Component } from '@angular/core';

export interface Client {
    id: number;
    user: string;
    clientName: string;
    identifier: string;
    comment?: string;
    contact?: string;
    policies?: Policy[];
}

export interface Policy {
    id: number;
    vehicleId: string;
    policyName: string;
    policyNumber: string;
    broker: string;
    company: string;
    amount: number;
    validTo: Date;
    payments: Payment[];
}

export interface Payment {
    id: number;
    date: string;
    amount: number;
    issued: boolean;
    clientInformed: boolean;
    sent: boolean;
    paid: boolean;
    policyId: number;
    vehicleId: string;
}

@Component({
    selector: 'clients',
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent {
    addClient: boolean = false;

    protected clientAdded(added: boolean): void {
        this.addClient = !added;
    }

    protected showAddClient(): void {
        this.addClient = !this.addClient;
    }
}
