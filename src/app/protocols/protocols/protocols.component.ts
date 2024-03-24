import { Component } from '@angular/core';

export interface Protocol {
    id: number;
    user: string;
    medicines: string[];
    issued?: Date;
    validTo: Date;
}

@Component({
    selector: 'protocols',
    templateUrl: './protocols.component.html',
    styleUrl: './protocols.component.scss'
})
export class ProtocolsComponent {
    addProtocol: boolean = false;

    protected protocolAdded(added: boolean): void {
        this.addProtocol = !added;
    }

    protected showAddProtocol(): void {
        this.addProtocol = !this.addProtocol;
    }
}
