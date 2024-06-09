import { Component, Input } from '@angular/core';
import { Prescription } from '../../../prescriptions/prescriptions.component';
import { Protocol } from '../../../protocols/protocols/protocols.component';
import { convertDateToEU } from '../../../common/common';
import { Client, Payment, Policy } from '../../../clients/clients/clients.component';
import { ClientsService } from '../../../clients/clients.service';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'dashboard-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class DashboardNotificationsComponent {
    @Input() prescriptions?: Prescription[] = [];
    @Input() protocols?: Protocol[] = [];

	prescriptionsIn7Days: Prescription[] = [];
    paymentsIn15Days: Client[] = [];
    paymentsOverdue: Client[] = [];
    protocolsIn7Days: Protocol[] = [];
    expiredPrescriptions: Prescription[] = [];
    expiredProtocols: Protocol[] = [];
    protected clients: Client[] = [];

	constructor(
        private clientsService: ClientsService,
        private router: Router,
    ) { }

    ngOnChanges(): void {
        this.clientsService.clients$.subscribe((clients) => {
            this.clients = clients;
            this.paymentsIn15Days = this.getPaymentsInDays(15);
            this.paymentsOverdue = this.getPaymentsOverdue();
        });
    }
    
    // getProtocolsInDays(days: number): Protocol[] {
    //     const now = new Date();
    //     const daysFromNow = new Date(now.setDate(now.getDate() + days));
    //     return this.protocols.filter((protocol) => protocol.validTo <= daysFromNow && protocol.validTo.getDate() < now.getDate());
    // }
    
    // getPrescriptionsInDays(days: number): Prescription[] {
    //     const now = new Date();
    //     const daysFromNow = new Date(now.setDate(now.getDate() + days));
    //     return this.prescriptions.filter((protocol) => protocol.validTo <= daysFromNow);
    // }

    getPaymentsInDays(days: number): Client[] {
        return this.clientsService.clientsWithDuesNextDays(days);
        
    }

    getPaymentsOverdue(): Client[] {
        return this.clientsService.clientsWithOverdues();
    }

    getPaymentStatus(payment: Payment): string {
        if (payment.paid) {
            return 'Платенa';
        }
        if (payment.sent) {
            return 'Изпратенa';
        }
        if (payment.issued) {
            return 'Издаденa';
        }
        if (payment.clientInformed) {
            return 'Информиран';
        }
       return 'Клиента не е уведомен';
    }

    protected formatDate(targetDate: Date): string {
        return convertDateToEU(targetDate.toISOString());
    }

    protected euStringToDate(targetDate: string): Date {
        return new Date(targetDate.split('/').reverse().join('/'));
    }

    protected clientHasPayments(client: Client): boolean {
        if (!client.policies) {
            return false;
        }
        return client.policies?.some((policy) => policy.payments.length > 0);
    }

    protected navigate(clientName: string, policyId: number): void {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                clientName: clientName,
                policyId: policyId,
            }
        }
        this.router.navigate([`/protected/policy/${clientName}/${policyId}`], navigationExtras);
    }
}
