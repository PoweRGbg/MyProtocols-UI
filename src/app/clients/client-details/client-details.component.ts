import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientsService } from '../clients.service';
import { Client, Payment, Policy } from '../clients/clients.component';
import { convertDateToEU as convertDateToEU } from '../../common/common';
import { isPaymentOverdue, updatePaymentStatus } from '../common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'client-details',
    templateUrl: './client-details.component.html',
    styleUrl: './client-details.component.scss'
})
export class ClientDetailsComponent implements OnInit, OnChanges, OnDestroy{
    addProtocol: boolean = false;

    protected clientId: string = '';
    protected client: Client | undefined;
    private sub: Subscription = new Subscription();
    protected policies: Policy[] = [];

    constructor(
        private route: ActivatedRoute,
        private clientsService: ClientsService,
        private snackbar: MatSnackBar,
        private router: Router,
    ) {}

    async ngOnInit() {
        this.clientId = this.route.snapshot.paramMap.get('clientId') ?? '';
        this.clientsService.getAllClients();
        this.clientsService.clients$.subscribe((clients) => {
            this.client = clients.find((c) => c.id === Number(this.clientId));
            this.policies = this.client?.policies?.sort() || [];
        });
    }

    async ngOnChanges() {
        this.client = this.clientsService.getClientById(this.clientId);
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

    
    protected updateClient(): void {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                clientId: this.client?.id,
            }
        }
        this.router.navigate([`/protected/client/update/${this.client?.id}`], navigationExtras);
    }

    protected isPaymentOverdue(payment: Payment): boolean {
        return isPaymentOverdue(payment);
    }

    protected formatDate(targetDate: Date): string {
        return convertDateToEU(targetDate);
    }
}
