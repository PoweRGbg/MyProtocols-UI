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
    protocols: Protocol[] = [];

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
        this.protocolsService.removeProtocol(protocolId);
    }

    protected formatDate(targetDate: Date): string {
        return formatDate(targetDate);
    }
}
