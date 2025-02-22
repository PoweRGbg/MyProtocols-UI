import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Policy, Client, Payment } from '../models';
import { getDateDashed, oneYearFromDate, valideVehicleId } from '../common';
import { calculateDates  } from '../../common/common';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    protected validFrom: string = this.tomorrow.toISOString().split('T')[0];
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
        private clientsService: ClientsService,
        private snackbar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        const client = this.route.snapshot.paramMap.get('clientId') ?? '';
        const policy = this.route.snapshot.paramMap.get('policyId');
        if (!policy || !client) {
            this.router.navigate(['/policy-details']);
            return;
        } else {
            this.client = this.clientsService.getClientById(Number(client));
            this.policy = this.client?.policies?.find((p) => p.id === Number(policy));
            if (!this.policy) {
                this.snackbar.open('Няма такава полица', '', {
                    duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
                });
                this.router.navigate(['/protected/dashboard']);
                return;
            }
            this.populateValues(this.policy);
        }
    }

    updatePolicy(): void {
        if (!this.policy || !this.client) {
            return;
        }

        if (!this.inputsAreValid()) {
            return;
        }
        this.policy.vehicleId = this.vehicleId;
        this.policy.policyName = this.policyName;
        this.policy.company = this.company;
        this.policy.broker = this.broker;
        this.policy.policyNumber = this.policyNumber;
        this.policy.amount = this.totalAmount;
        this.policy.validTo = this.endDate;
        this.policy.payments = this.payments.length !== this.policy.payments.length ?
            this.payments :
            this.policy.payments;

        this.client.policies = this.client.policies?.map((p) => {
            if (p.id === this.policy?.id) {
                return this.policy;
            }
            return p;
        });

        this.clientsService.updateClient(this.client);
        console.log('Policy updated: ', this.policy);
        this.snackbar.open(`Полица ${this.policy.policyNumber} е обновена`, '', {
            duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
        });
        this.router.navigate([`/protected/client/${this.client.id}`]);
    }
    inputsAreValid(): boolean {
        return this.valideVehicleId(this.vehicleId) &&
            this.policyName.length > 0 &&
            this.policyNumber.length > 0 &&
            this.validFrom.length > 0 &&
            this.endDate.toString().length > 0 &&
            this.totalAmount > 0 &&
            this.payments.length > 0 &&
            this.payments.every((payment) => payment.amount > 0) &&
            this.payments.every((payment) => payment.date.length > 0);
    }

    cancelEdit(): void {
        this.router.navigate([`/protected/client/${this.client?.id}`]);
    }


    onPaymentNumberChange(): void {
        this.payments = [];
        const paymentDates = calculateDates(new Date(this.validFrom), this.numberOfPayments);
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
                const validFrom = new Date(this.validFrom);
                this.endDate = new Date(validFrom.getFullYear(), validFrom.getMonth() + 1, validFrom.getDate());
                this.numberOfPayments = 1;
                this.payments.push({
                    id: i,
                    date: getDateDashed(validFrom),
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
    
    onValidFromChange(): void {
        this.endDate = oneYearFromDate(new Date(this.validFrom));
        console.log('end date is: ', this.endDate);
        
        if (this.totalAmount > 0) {
            this.onPaymentNumberChange();
        }
    }

    private populateValues(policy: Policy): void {
        this.vehicleId = policy.vehicleId;
        this.policyName = policy.policyName;
        this.company = policy.company;
        this.broker = policy.broker;
        this.policyNumber = policy.policyNumber;
        this.totalAmount = policy.amount;
        this.numberOfPayments = policy.payments.length;
        this.onPaymentNumberChange();
        this.endDate = policy.validTo;
        this.payments = policy.payments;
    }

    protected valideVehicleId(vehicleId: string): boolean {
        return valideVehicleId(vehicleId);
    }
}
