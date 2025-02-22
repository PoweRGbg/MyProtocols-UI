import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { get } from 'http';
import { Policy, Client, Payment } from '../models';
import { getDateDashed, oneYearFromDate } from '../common';
import { calculateDates } from '../../common/common';

@Component({
    selector: 'edit-policy',
    templateUrl: './edit-policy.component.html',
    styleUrl: './edit-policy.component.scss'
})
export class EditPolicyComponent implements OnInit {
    protected policy: Policy | undefined;
    protected client: Client | undefined;
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
    protected monthlyPolicy: boolean = false;
    protected policyTypes: string[] = [
        'Каско',
        'ГО',
        'Карта СБА',
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientsService: ClientsService
    ) { }

    ngOnInit(): void {
        const client = this.route.snapshot.paramMap.get('clientId') ?? '';
        const policy = this.route.snapshot.paramMap.get('policyId');
        if (!policy || !client) {
            console.log('No policy or client id', policy, client);
            
            this.router.navigate(['/policy-details']);
            return;
        } else {
            this.client = this.clientsService.getClientById(Number(client));
            this.policy = this.client?.policies?.find((p) => p.id === Number(policy));
        }
    }

    updatePolicy(): void {
        if (!this.policy || !this.client) {
            return;
        }
        this.clientsService.updateClient(this.client);
        console.log('Policy updated: ', this.policy);
        this.router.navigate(['/policy-details', this.client.id]);
    }

    onPaymentNumberChange(): void {
        this.payments = [];
        const paymentDates = calculateDates(new Date(this.startDate), this.numberOfPayments);
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
                const startDate = new Date(this.startDate);
                this.endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
                this.numberOfPayments = 1;
                this.payments.push({
                    id: i,
                    date: getDateDashed(startDate),
                    amount: this.totalAmount,
                    issued: false,
                    sent: false,
                    paid: false,
                    clientInformed: false,
                    policyId: 0,
                    vehicleId: this.vehicleId,
                })
            } else {
                this.payments.push({
                    id: i,
                    date: getDateDashed(paymentDates[i]),
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
    protected valideVehicleId(): boolean {
        const vehicleIdPattern = /^[A-Za-z0-9]+$/;
        if (!vehicleIdPattern.test(this.vehicleId)) {
            alert('Регистрационният номер трябва да съдържа само латински букви и цифри');
            return false;
        }
        return true;
    }
}