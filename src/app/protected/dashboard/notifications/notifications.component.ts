import { Component, Input } from '@angular/core';
import { PrescriptionService } from '../../../prescriptions/prescriptions-service/prescriptions.service';
import { Prescription } from '../../../prescriptions/prescriptions.component';
import { Protocol } from '../../../protocols/protocols/protocols.component';
import { ProtocolsService } from '../../../protocols/protocols.service';
import { convertDateToEU } from '../../../common/common';
@Component({
  selector: 'dashboard-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class DashboardNotificationsComponent {
    @Input() prescriptions: Prescription[] = [];
    @Input() protocols: Protocol[] = [];

	prescriptionsIn7Days: Prescription[] = [];
    protocolsIn7Days: Protocol[] = [];
    expiredPrescriptions: Prescription[] = [];
    expiredProtocols: Protocol[] = [];

	constructor(
        private prescriptionService: PrescriptionService,
        private protocolsService: ProtocolsService,
    ) { }

    ngOnChanges(): void {
        this.prescriptionsIn7Days = this.getPrescriptionsInDays(7);
        this.protocolsIn7Days = this.getProtocolsInDays(7);
        this.expiredPrescriptions = this.prescriptionService.getExpiredPrescriptions();
        this.expiredProtocols = this.protocolsService.getExpiredProtocols();
    }
    
    getProtocolsInDays(days: number): Protocol[] {
        const now = new Date();
        const daysFromNow = new Date(now.setDate(now.getDate() + days));
        return this.protocols.filter((protocol) => protocol.validTo <= daysFromNow && protocol.validTo.getDate() < now.getDate());
    }
    
    getPrescriptionsInDays(days: number): Prescription[] {
        const now = new Date();
        const daysFromNow = new Date(now.setDate(now.getDate() + days));
        return this.prescriptions.filter((protocol) => protocol.validTo <= daysFromNow);
    }

    protected formatDate(targetDate: Date): string {
        return convertDateToEU(targetDate.toISOString());
    }
}
