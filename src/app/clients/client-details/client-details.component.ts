import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientsService } from '../clients.service';
import { Client, Payment, Policy } from '../clients/clients.component';
import { log } from 'console';
import { convertDateToEU } from '../../common/common';


@Component({
    selector: 'client-details',
    templateUrl: './client-details.component.html',
    styleUrl: './client-details.component.scss'
})
export class ClientDetailsComponent implements OnInit, OnChanges, OnDestroy{
    addProtocol: boolean = false;

    protected clientName: string = '';
    protected client: Client | undefined;
    private sub: Subscription = new Subscription();
    protected policies: Policy[] = [];

    constructor(
        private route: ActivatedRoute,
        private clientsService: ClientsService,
        private router: Router,
    ) {}

    async ngOnInit() {
        this.clientName = this.route.snapshot.paramMap.get('clientName') ?? '';
        this.clientsService.getAllClients();
        this.clientsService.clients$.subscribe((clients) => {
            this.client = clients.find((c) => c.clientName === this.clientName);
            this.policies = this.client?.policies?.sort() || [];
        });
    }

    async ngOnChanges() {
        this.client = this.clientsService.getClientByName(this.clientName);
        this.policies = this.client?.policies?.sort() || [];
    }
    
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    protected policyAdded(isAdded: boolean): void {

        this.toggleAddPolicy();
    }

    protected toggleAddPolicy(): void {
        this.addProtocol = !this.addProtocol;
    }

    protected goBack(): void {
        this.router.navigate(['/protected/dashboard']);
    }

    protected onPaymentClicked(policyId: number, paymentId: number): void {
        console.log('Payment clicked', policyId, paymentId);
        // update payment status
        const policy = this.policies?.find((p) => p.id === policyId);
        if (!policy ) {
            console.error('Policy not found');
            return;
        }
        const payment = policy.payments?.find((p) => p.id === paymentId);
        if (!payment) {
            console.error('Payment not found');
            return;
        }
        const updatedPayment = this.updatePaymentStatus(payment);
        const updatedPolicy = this.client?.policies?.find((p) => p.id === policyId);
        if (!updatedPolicy) {
            console.error('Policy not found when updating payment');
            return;
        }
        updatedPolicy!.payments!.map((p) => {
            if (p.id === paymentId) {
                return updatedPayment;
            }
            return p;
        });

        if (!this.client) {
            console.error('Client not found when updating payment');
            return;
        }
        //replace policy in client with updated policy
        const updatedPolicies = this.client.policies?.map((p) => {
            if (p.id === policyId) {
                return updatedPolicy;
            }
            return p;
        });
        console.log('Updated policies', this.client.policies);
        
        this.clientsService.updateClient(this.client);
        this.ngOnChanges();
    }

    removePolicy(policyId: number): void {
        if (!this.client) {
            console.error('Client not found');
            return;
        }
        const updatedPolicies = this.client.policies?.filter((p) => p.id !== policyId);
        this.client.policies = updatedPolicies;
        this.clientsService.updateClient(this.client);
        this.ngOnChanges();
    }

    protected isPaymentOverdue(payment: Payment): boolean {
        const today = new Date(); 
        const tomorrow = new Date(today.setDate(today.getDate() - 15));
        // payment date + 15 days


        console.log('Tomorrow', convertDateToEU(tomorrow));
        
        const paymentDate = new Date(payment.date.split('/').reverse().join('-'));

        return paymentDate < tomorrow && !payment.paid;
    }

    private updatePaymentStatus(payment: Payment): Payment {
        if (!payment.clientInformed) {
            payment.clientInformed = true;
            console.log('Client informed');
        } else if (payment.clientInformed && !payment.issued) {
            payment.issued = true;
            console.log('Payment issued');
        } else if (payment.issued && !payment.sent) {
            payment.sent = true;
            console.log('Payment sent');
        } else if (payment.sent && !payment.paid) {
            console.log('Payment paid');
            payment.paid = true;
        } else if (payment.paid) {
            payment.clientInformed = false;
            payment.issued = false;
            payment.sent = false;
            payment.paid = false;
            return payment;
        }
        return payment;
    }
}
