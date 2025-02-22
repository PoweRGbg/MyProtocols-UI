import { Component } from '@angular/core';

@Component({
    selector: 'clients',
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent {
    addClient: boolean = false;

    protected clientAdded(added: boolean): void {
        this.addClient = !added;
    }

    protected showAddClient(): void {
        this.addClient = !this.addClient;
    }
}
