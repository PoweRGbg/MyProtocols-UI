import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientsService } from '../clients.service';
import { Payment, Policy } from '../clients/clients.component';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import moment from 'moment';

@Component({
	selector: 'monthly-report',
	templateUrl: './monthly-report.component.html',
	styleUrl: './monthly-report.component.scss'
})
export class MonthlyReportComponent {
	@Input() clientId: number | undefined;
	@Output() policyAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected vehicleId: string = '';
    protected policyName: string = '';
    protected company: string = '';
    protected broker: string = '';
    protected policyNumber: string = '';
    protected totalAmount: number = 0;
    protected numberOfPayments: number = 1;
    private readonly today = new Date();
    protected tomorrow = new Date(this.today.setDate(this.today.getDate() + 1));
    protected oneYearFromNow = new Date(this.tomorrow.getFullYear() + 1, this.today.getMonth(),this.today.getDate()+1);
    protected endDate: string = this.oneYearFromNow.toISOString().split('T')[0];
    protected payments: Payment[] = [];
    protected policyTypes: string[] = [
        'Каско',
        'ГО',
        'Карта СБА',
    ];
    readonly date = new FormControl(moment());

    constructor(
        private clientsService: ClientsService,
    ) {}

	addPolicy() {
        const clients = this.clientsService.getAllClients();
        const client = clients.find((c) => c.id === this.clientId);
        if (client === undefined) {
            alert('Клиентът не е намерен');
            return;
        }
        this.payments = this.payments.map((payment) => {
            payment.policyId = client.policies === undefined ? 1 : client.policies.length + 1;
            return payment;
        });
        if (!this.validatePolicy()) {
            return;
        }

        if (client.policies === undefined) {
            client.policies = [];
        }

        this.payments = this.payments.map((payment) => {
            payment.policyId = client.policies === undefined ? 1 : client.policies.length + 1;
            return payment;
        });

        const policy: Policy = {
            id: client.policies.length + 1,
            type: 'vehicle',
            vehicleId: this.vehicleId,
            policyName: this.policyName,
            policyNumber: this.policyNumber,
            broker: this.broker,
            company: this.company,
            amount: this.totalAmount,
            validTo: new Date(this.endDate),
            payments: this.payments,
        } as Policy;
        if (this.clientId === undefined) {
            alert('Моля изберете клиент');
            return;
        }

        client.policies.push(policy);
		this.clientsService.updateClient(client);
        this.policyAdded.emit(true);
	}

    protected getDateDashed(date: Date): string {
        return  date.getUTCDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    protected validatePolicy(): boolean {
        let errorMessages = [];
        if (this.vehicleId.length < 1) {
            errorMessages.push('Моля въведете регистрационен номер');
        }
        if (this.policyName.length < 1) {
            errorMessages.push('Моля въведете име на полицата');
        }
        if (this.company.length < 1) {
            errorMessages.push('Моля въведете застрахователна компания');
        }
        if (this.broker.length < 1) {
            errorMessages.push('Моля въведете брокер');
        }
        if (this.policyNumber.length < 1) {
            errorMessages.push('Моля въведете номер на полицата');
        }
        if (this.totalAmount < 1) {
            errorMessages.push('Моля въведете премия');
        }
        if (this.endDate.length < 1) {
            errorMessages.push('Моля въведете край на полицата');
        }
        if (this.payments.length < 1) {
            errorMessages.push('Моля въведете поне едно плащане');
        }
        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'));
            return false;
        }


        
        return this.vehicleId.length > 0
            && this.valideVehicleId()
            && this.policyName.length > 0
            && this.company.length > 0
            && this.broker.length > 0
            && this.policyNumber.length > 0
            && this.totalAmount > 0
            && this.endDate.toString().length > 0
            && this.payments.length > 0;
    }

    protected valideVehicleId(): boolean {
        const vehicleIdPattern = /^[A-Za-z0-9]+$/;
        if (!vehicleIdPattern.test(this.vehicleId)) {
            alert('Регистрационният номер трябва да съдържа само латински букви и цифри');
            return false;
        }
        return true;
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value ?? moment();
        console.log('ctrlValue',ctrlValue);
        if ( normalizedMonthAndYear) {
            // ctrlValue.month(normalizedMonthAndYear.month());
            // ctrlValue.year(normalizedMonthAndYear.year());
        }
        datepicker.close();
    }
}
