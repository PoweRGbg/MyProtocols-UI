import { Component } from '@angular/core';
import { ProtocolsService } from '../protocols.service';
import { Protocol } from '../protocols/protocols.component';
import { formatDate } from '../../prescriptions/common';
import { convertDateToEU } from '../../common/common';

@Component({
    selector: 'list-protocols',
    templateUrl: './list-protocols.component.html',
    styleUrl: './list-protocols.component.scss'
})

export class ListProtocolsComponent {
    protected medicinesForPrescriptions: string[] = [];
    protected protocols: Protocol[] = [];

    constructor(private protocolsService: ProtocolsService) {}

    ngOnInit(): void {
        this.getAll();
        this.protocolsService.protocols$.subscribe((protocols) => {
            this.protocols = protocols.sort((a, b) => a.validTo.getTime() - b.validTo.getTime());
            console.log('Protocols updated');
            
        });
    }

    getAll() {
        this.protocols = this.protocolsService.getAllProtocols()
            .sort((a, b) => a.validTo.getTime() - b.validTo.getTime());
    }

    protected daysLeft(targetDate: Date): string {
        const today = new Date();

        const differenceInMs = targetDate.getTime() - today.getTime();

        const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
        if (daysDifference > 0) {
            return daysDifference.toString();
        }

        return "ИЗТЕКЪЛ!";
    }

    protected removeProtocol(protocolId: number): void {
        if (confirm("Сигурни ли сте, че искате да изтриете протокола? Не може да го възстановите след това!")) {
            this.protocolsService.removeProtocol(protocolId);
        }
    }

    protected renewProtocol(protocol: Protocol): void {
        if (confirm("Сигурни ли сте, че искате да подновите протокола? Не може да го възстановите след това!")) {
            if (protocol.validTo > new Date()) {
                console.log('Protocol is not expired');
                return;
            } else {
                const renewdProtocolId = this.protocolsService.renewProtocol(protocol.id);

                setTimeout(() => {
                    this.getAll();
                    const renewedProtocol = this.protocols.find((protocol) => protocol.id === renewdProtocolId);
                    
                    if (renewedProtocol !== undefined) {
                        
                        this.protocolsService.removeProtocol(protocol.id);
                        this.getAll();
                        if (this.protocols.find((protocolFormDatabase) => protocol.id === protocolFormDatabase.id) !== undefined) {
                            console.log('Protocol not deleted!');
                        }
                    } else {
                        console.log('Protocol not renewed!');
                    }
                }, 5000);
            }
        }
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
    
    protected isExpired(protocol: Protocol): boolean {
        const today = new Date();

        return protocol.validTo.getTime() < today.getTime();
    }
    
    protected formatDate(targetDate: Date): string {
        return convertDateToEU(targetDate.toISOString());
    }
}
