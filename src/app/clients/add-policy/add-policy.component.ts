import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientsService } from '../clients.service';
import { Payment, Policy } from '../clients/clients.component';
import { oneYearFromDate } from '../common';

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
    protected company: string | undefined;
    protected broker: string | undefined;
    protected policyNumber: string = '';
    protected totalAmount: number = 0;
    protected numberOfPayments: number = 1;
    private readonly today = new Date();
    protected tomorrow = new Date(this.today.setDate(this.today.getDate() + 1));
    protected startDate: string = this.tomorrow.toISOString().split('T')[0];
    protected endDate: Date = oneYearFromDate(this.tomorrow);
    protected payments: Payment[] = [];
    protected policyTypes: string[] = [
        'Каско',
        'ГО',
        'Карта СБА',
    ];
    // I want to add an option to choose if the policy is valid for only one month which will set the end date to the start date plus one month and the maximum amount to the total amount divided by the number of payments to one
    protected monthlyPolicy: boolean = false;

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
        console.log('Adding policy to client: ', client);
        client.policies.push(policy);
		this.clientsService.updateClient(client);
        this.policyAdded.emit(true);
	}

    onPaymentNumberChange(): void {
        this.payments = [];
        const startDate = new Date(this.startDate);
        let paymentDate = new Date(startDate.getTime()+3*1000*60*60);
        const remainder = ((this.totalAmount * 100) % this.numberOfPayments) / 100;
        
        if (!this.endDate) {
            alert('Моля изберете край на полицата');
            return;
        }
        if (this.totalAmount < 1) {
            alert('Моля напишете премия');
            return;
        }

        if (this.monthlyPolicy) {
            this.numberOfPayments = 1;
        }
        
        for (let i = 0; i < this.numberOfPayments; i++) {
            if(this.monthlyPolicy) {
                console.log('monthly policy');
                
                const startDate = new Date(this.startDate);
                this.endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
                this.numberOfPayments = 1;
                this.payments.push({
                    id: i,
                    date: this.getDateDashed(startDate),
                    amount: this.totalAmount,
                    issued: false,
                    sent: false,
                    paid: false,
                    clientInformed: false,
                    policyId: 0,
                    vehicleId: this.vehicleId,
                })
            } else {
                const paymentMonth = (12 / this.numberOfPayments);
                let extraYears = paymentMonth > 12 ? Math.floor(paymentMonth / 12) : 0;
                if (extraYears > 0) {
                    paymentDate.setFullYear(paymentDate.getFullYear() + extraYears);
                }
                paymentDate.setMonth(paymentDate.getMonth() + paymentMonth * i);
                
                paymentDate.setDate(paymentDate.getDate());
                
                this.payments.push({
                    id: i,
                    date: this.getDateDashed(paymentDate),
                    amount: Math.floor((this.totalAmount / this.numberOfPayments) * 100) / 100,
                    issued: false,
                    sent: false,
                    paid: false,
                    clientInformed: false,
                    policyId: 0,
                    vehicleId: this.vehicleId,
                });
            }

            if (remainder > 0 && this.numberOfPayments > 1) {
                this.payments[0].amount = Number((this.payments[i].amount + remainder).toFixed(2));
            }
            
        }
    }

    onStartDateChange(): void {
        this.endDate = oneYearFromDate(new Date(this.startDate));
        console.log('end date is: ', this.endDate);
        
        if (this.totalAmount > 0) {
            this.onPaymentNumberChange();
        }
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
        if (this.policyNumber.length < 1) {
            errorMessages.push('Моля въведете номер на полицата');
        }
        if (this.totalAmount < 1) {
            errorMessages.push('Моля въведете премия');
        }
        if (!this.endDate) {
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
}
