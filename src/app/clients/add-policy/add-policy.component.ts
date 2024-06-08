import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { ClientsService } from '../clients.service';
import { AuthService } from '../../public/auth.service';
import { Payment, Policy } from '../clients/clients.component';
import { get } from 'http';

@Component({
	selector: 'client-add-policy',
	templateUrl: './add-policy.component.html',
	styleUrl: './add-policy.component.scss'
})
export class AddPolicyComponent {
	@Input() clientId: number | undefined;
	@Output() policyAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected vehicleId: string = '';
    protected policyName: string = '';
    protected broker: string = '';
    protected policyNumber: string = '';
    protected totalAmount: number = 0;
    protected numberOfPayments: number = 1;
    protected endDate: string = '';
    protected payments: Payment[] = [];

    constructor(
        private clientsService: ClientsService,
        private authService: AuthService
    ) {}

	addPolicy() {
        const clients = this.clientsService.getAllClients();
        const client = clients.find((c) => c.id === this.clientId);
        if (client === undefined) {
            alert('Клиентът не е намерен');
            return;
        }
        if (client.policies === undefined) {
            console.log('Client has no policies');
            
            client.policies = [];
        }
        const policy: Policy = {
            id: client.policies.length + 1,
            type: 'vehicle',
            vehicleId: this.vehicleId,
            policyName: this.policyName,
            policyNumber: this.policyNumber,
            policyBroker: this.broker,
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

    onPaymentNumberChange(): void {
        if (this.endDate.length < 1) {
            alert('Моля изберете край на полицата');
            return;
        }
        if (this.totalAmount < 1) {
            alert('Моля напишете премия');
            return;
        }

        this.payments = [];
        for (let i = 0; i < this.numberOfPayments; i++) {

            const endDate = new Date(this.endDate);
            
            let paymentDate = new Date(endDate.getTime());
            paymentDate.setFullYear(paymentDate.getFullYear() - 1);
            console.log('End date', this.getDateDashed(endDate));
            
            const paymentMonth = (12 / this.numberOfPayments);
            let extraYears = paymentMonth > 12 ? Math.floor(paymentMonth / 12) : 0;
            if (extraYears > 0) {
                paymentDate.setFullYear(paymentDate.getFullYear() + extraYears);
                console.log('Extra years', extraYears, paymentDate.getFullYear());
            }
            paymentDate.setMonth(paymentDate.getMonth() + paymentMonth * i);
            console.log('Payment date', this.getDateDashed(paymentDate));
            this.payments.push({
                id: i,
                date: this.getDateDashed(paymentDate),
                amount: this.totalAmount / this.numberOfPayments,
                issued: false,
                sent: false,
                paid: false,
                clientInformed: false,
                policyId: 0,
            });
            
        }
    }

    protected getDateDashed(date: Date): string {
        return  date.getUTCDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }
}
