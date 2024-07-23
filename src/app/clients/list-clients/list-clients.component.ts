import { Component, Input } from '@angular/core';
import { ClientsService } from '../clients.service';
import { Client } from '../clients/clients.component';
import { convertDateToEU } from '../../common/common';
import { NavigationExtras, Router } from '@angular/router';

@Component({
    selector: 'list-clients',
    templateUrl: './list-clients.component.html',
    styleUrl: './list-clients.component.scss'
})

export class ListClientsComponent {
    protected medicinesForPrescriptions: string[] = [];
    protected clients: Client[] = [];
    protected searchText: string = '';

    constructor(private clientsService: ClientsService, private router: Router) {}

    ngOnInit(): void {
        if (this.clients.length === 0) {
            this.getAll();
        }
        
        this.clientsService.clients$.subscribe((clients) => {
            this.clients = clients;
        });
    }

    onSearch(): void {
        if (this.searchText === '') {
            this.getAll();
            return;
        }
        const searchResult = 
            this.clients.filter((client) => 
                client.clientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
                client.contact?.toLowerCase().includes(this.searchText.toLowerCase()) ||
                client.identifier.toLowerCase().includes(this.searchText.toLowerCase()) ||
                client.policies?.some((policy) => 
                    policy.vehicleId.toLowerCase().includes(this.searchText.toLowerCase()))
        );

        if (searchResult.length === 0 && this.searchText !== '') {
            console.log('No search results');
        } else 
        this.clients = searchResult;
    }

    getAll() {
        this.clients = [...this.clientsService.getAllClients()];
    }

    protected daysLeft(targetDate: Date): string {
        const today = new Date();

        const differenceInMs = targetDate.getTime() - today.getTime();

        const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
        if (daysDifference > 0) {
            return daysDifference.toString();
        }

        return "ИЗТЕКЪЛ!";
    }

    getClientVehicles(client: Client): string {
        const vehicles: string[] = [];
        client.policies?.forEach((policy) => {
            if (policy.vehicleId) {
                vehicles.push(policy.vehicleId);
            }
        });
        return vehicles.join(', ');
    }

    protected removeClient(clientId: number): void {
        if (confirm("Сигурни ли сте, че искате да изтриете клиента? Не може да го възстановите след това!")) {
            this.clientsService.removeClient(clientId);
        }
    }
    
    protected formatDate(targetDate: Date): string {
        return convertDateToEU(targetDate.toISOString());
    }

    protected updateClient(clientId: number): void {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                clientId: clientId,
            }
        }
        this.router.navigate([`/protected/client/update/${clientId}`], navigationExtras);
    }

    protected navigate(clientName: string): void {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                clientName: clientName,
            }
        }
        this.router.navigate([`/protected/client/${clientName}`], navigationExtras);
    }
}
