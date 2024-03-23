import { Component } from '@angular/core';
import { ProtocolsService } from '../protocols.service';
import { Protocol } from '../protocols/protocols.component';
import { formatDate } from '../../prescriptions/common';

@Component({
    selector: 'list-protocols',
    templateUrl: './list-protocols.component.html',
    styleUrl: './list-protocols.component.scss'
})

export class ListProtocolsComponent {
    protected medicinesForPrescriptions: string[] = [];
    protected protocols: Protocol[] = [];

    constructor(private protocolsService: ProtocolsService) { }

    ngOnInit(): void {
        this.getAll();
        this.protocolsService.protocols$.subscribe((protocols) => {
            this.protocols = protocols;
        });
    }

    getAll() {
        this.protocols = this.protocolsService.getAllProtocols();
    }

    protected daysLeft(targetDate: Date): string {
        const today = new Date();

        const differenceInMs = targetDate.getTime() - today.getTime();

        const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
        if (daysDifference > 0) {
            return daysDifference.toString();
        }

        return "EXPIRED!";
    }

    protected removeProtocol(protocolId: number): void {
        if (confirm("Are you sure you want to remove this protocol?")) {
            this.protocolsService.removeProtocol(protocolId);
        }
    }

    protected formatDate(targetDate: Date): string {
        return formatDate(targetDate);
    }

    protected addPrescriptions(medicines: string[]): void {
        if (medicines.length !== 0) {
            this.medicinesForPrescriptions = [...medicines];
        }
    }

    protected prescriptionAdded(medicineName: string): void {
        this.medicinesForPrescriptions = this.medicinesForPrescriptions
            .filter((medicine) => medicine !== medicineName);
    }
}
