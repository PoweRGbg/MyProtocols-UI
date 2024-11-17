import { Component } from '@angular/core';
import { ClientsService } from '../clients.service';
import { Client, Policy } from '../models';
import { convertDateToEU, convertDateFromEU } from '../../common/common';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import {
    areAllPaymentsPaid,
    filterPolicysByDate,
    getLastPaymentComment,
    getLastPaymentDateAsDate,
    sortClientsByDate,
} from '../common';

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
        let savedDate = localStorage.getItem('filterDate');
        if (savedDate) {
            this.filterDate.setValue(moment(savedDate, 'MM/YYYY'));
            this.filterByDate();
        } else if (this.clients.length === 0) {
            this.getAll();
        } 

        this.clientsService.clients$.subscribe((clients) => {
            savedDate = localStorage.getItem('filterDate');
            this.clients = clients;
            if (savedDate) {
                this.filterDate.setValue(moment(savedDate, 'MM/YYYY'));
                this.filterByDate();
            }        
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
                vehicles
                    .push(
                        `${policy.vehicleId} (${policy.policyName}:${policy.policyNumber} - ${this.getLastPaymentDate(policy)})`
                    );
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
        this.router.navigate([`/protected/client/update/${clientId}`]);
    }

    protected navigate(clientId: string): void {
        console.log('clientId is', clientId);
        
        this.router.navigate([`/protected/client/${clientId}`]);
    }

    protected setFilterDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.filterDate.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.filterDate.setValue(ctrlValue);
        datepicker.close();
        localStorage.setItem('filterDate', ctrlValue.format('MM/YYYY'));
        this.filterByDate();
    }

    protected filterByDate(): void {
        if (this.clients.length === 0) {
            console.error('No clients to filter');
            this.getAll();
            return;
        }
        
        if (this.filterDate.value !== null && this.clients.length > 0) {
            const date = this.filterDate.value.toDate();
            
            const filterDate = this.formatDate(date).split('/');
            const filterMonthAndYear = filterDate[1] + '/' + filterDate[2];
            let filteredClients = this.clients.map((client) => {
                if (client.policies) {
                    client.policies = filterPolicysByDate(client.policies, filterDate);
                }
                return client;
            });
            filteredClients = filteredClients.filter((client) => client.policies?.length);
            filteredClients = sortClientsByDate(filteredClients, filterMonthAndYear);
            
            this.clients = filteredClients;
        }
    }

    protected clearFilter(): void {
        this.filterDate.setValue(null);
        localStorage.removeItem('filterDate');
        this.getAll();
    }

    //function to get last payment date for each policy that is not paid yet
    protected getLastPaymentDate(policy: Policy): string {
        if (this.filterDate.value !== null) {
            const date = this.filterDate.value.toDate();
            const filterDate = this.formatDate(date).split('/');
            const filterMonthYear = filterDate[1] + '/' + filterDate[2];
            
            if (policy.payments.length > 0) {
                const paymentOnFilterDate = policy.payments.find(
                  (payment) =>
                    convertDateToEU(payment.date).endsWith(filterMonthYear)
                );
                if (paymentOnFilterDate === undefined) {
                    return `изтича на ${convertDateToEU(this.getPolcyEndDate(policy))} ${getLastPaymentComment(policy)}`;
                }

                let paymentText = `падеж на ${convertDateToEU(paymentOnFilterDate?.date)}`;
                return paymentText +  
                    `${paymentOnFilterDate?.paid ? 
                        ' платен' :
                        ` неплатен ${getLastPaymentComment(policy)}`
                    }`;
            } 
        }

        if(areAllPaymentsPaid(policy)) {
            return `изтича на ${convertDateToEU(policy.validTo)}`;
        } else {
            policy.payments.filter((payment) => !payment.paid);
            return `падеж на ${convertDateToEU(policy.payments[0].date)}`;
        }
    }

    protected getPolcyEndDate(policy: Policy): Date {
        const lastPaymentDate = getLastPaymentDateAsDate(policy);

        const paymentEveryMonths = 12 / policy.payments.length;
        let calculatedPolicyEnd = convertDateFromEU(policy.payments[policy.payments.length - 1].date);
        return new Date(calculatedPolicyEnd.setMonth(lastPaymentDate.getMonth() + paymentEveryMonths));
    }
}
