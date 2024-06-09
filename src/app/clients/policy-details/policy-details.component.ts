import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientsService } from '../clients.service';
import { Client, Payment, Policy } from '../clients/clients.component';
import { convertDateToEU } from '../../common/common';
import { updatePaymentStatus, isPaymentOverdue } from '../common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'policy-details',
    templateUrl: './policy-details.component.html',
    styleUrl: './policy-details.component.scss'
})
export class PolicyDetailsComponent implements OnInit, OnChanges, OnDestroy{
    addProtocol: boolean = false;

    protected clientName: string = '';
    protected policyRequested: string = '';
    protected client: Client | undefined;
    private sub: Subscription = new Subscription();
    protected policies: Policy[] = [];
    protected policy: Policy | undefined;

    constructor(
        private route: ActivatedRoute,
        private clientsService: ClientsService,
        private snackbar: MatSnackBar,
        private router: Router,
    ) {}

    async ngOnInit() {
        this.clientName = this.route.snapshot.paramMap.get('clientName') ?? '';
        this.policyRequested = this.route.snapshot.paramMap.get('policyId') ?? '';
        this.clientsService.getAllClients();
        this.clientsService.clients$.subscribe((clients) => {
            this.client = clients.find((c) => c.clientName === this.clientName);
            this.policies = this.client?.policies?.sort() || [];
            this.policy = this.client?.policies?.find((p) => p.id === Number(this.policyRequested));
        });
    }

    async ngOnChanges() {
        this.client = this.clientsService.getClientByName(this.clientName);
        this.policies = this.client?.policies?.sort() || [];
        this.policy = this.client?.policies?.find((p) => p.id === Number(this.policyRequested));
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
        // update payment status
        console.log('Payment clicked', policyId, paymentId);
        
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
        const updatedPayment = updatePaymentStatus(payment, this.snackbar);
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
        return isPaymentOverdue(payment);
    }
}
