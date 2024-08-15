import { Component } from '@angular/core';
import { ClientsService } from '../clients.service';
import { Client } from '../clients/clients.component';
import { convertDateToEU } from '../../common/common';
import { NavigationExtras, Router } from '@angular/router';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import {default as _rollupMoment, Moment} from 'moment';
import { getMonthAndYear } from '../common';
import { get } from 'http';

const moment = _rollupMoment || _moment;
export const MY_FORMATS_MONTH = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
  

@Component({
    selector: 'list-clients',
    templateUrl: './list-clients.component.html',
    styleUrl: './list-clients.component.scss',
})

export class ListClientsComponent {
    protected medicinesForPrescriptions: string[] = [];
    protected clients: Client[] = [];
    protected searchText: string = '';
    readonly filterDate = new FormControl();

    constructor(private clientsService: ClientsService, private router: Router) {
        moment.locale('bg'); // Set moment.js locale globally
    }
    
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

    protected removeClient(event: Event, clientId: number): void {
        event.stopPropagation();
        if (confirm("Сигурни ли сте, че искате да изтриете клиента? Не може да го възстановите след това!")) {
            this.clientsService.removeClient(clientId);
        }
    }
    
    protected formatDate(targetDate: Date): string {
        return convertDateToEU(targetDate.toISOString());
    }

    protected updateClient(event: Event, clientId: number): void {
        event.stopPropagation();
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

    protected setFilterDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.filterDate.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.filterDate.setValue(ctrlValue);
        datepicker.close();
        this.filterByDate();
    }

    protected filterByDate(): void {
        
        if (this.filterDate.value !== null) {
            const date = this.filterDate.value.toDate();
            const filteredClients = this.clients.filter((client) => {
                return client.policies?.some((policy) => {
                    const filterDate = this.formatDate(date).split('/');
                    const policyValidTo = getMonthAndYear(new Date(policy.validTo)).split('/');
                    
                    return policy.payments?.some((payment) => {
                        const paymentDate = payment.date.split('/');
                        return paymentDate[1] === filterDate[1] && paymentDate[2] === filterDate[2];
                    }) || policyValidTo[0] === filterDate[1] && policyValidTo[1] === filterDate[2]; // Check if the policy is valid for the selected month
                });
            });
            
            this.clients = [...filteredClients];
        }
    }

    protected clearFilter(): void {
        this.filterDate.setValue(null);
        this.getAll();
    }
}
