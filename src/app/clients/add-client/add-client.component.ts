import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientsService } from '../clients.service';
import { formatDate } from '../../prescriptions/common';
import { AuthService } from '../../public/auth.service';
import { Client } from '../clients/clients.component';

@Component({
  selector: 'add-client',
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {
    @Input() medicines: string[] | undefined;

	now = new Date();
	protected readonly todayAsString = formatDate(this.now);
	clientStart: string = this.todayAsString;
	clientName: string = '';
	contact: string = '';
	identifier: string = '';
	comment: string = '';
    
    @Output() clientAdded: EventEmitter<boolean> = new EventEmitter<boolean>();
    
	constructor(
        private clientsService: ClientsService,
        private authService: AuthService
    ) {}

	addClient() {
        if (this.clientName.length > 0) {
			this.clientsService.addClient({
				id: this.clientsService.getAllClients().length + 1,
                user: this.authService.getLoggedInUser(),
				clientName: this.clientName,
                identifier: this.identifier,
                contact: this.contact,
                comment: this.comment,
			} as Client);
            this.clientAdded.emit(true);
		} else {
            if (this.clientName.length < 1) {
			    alert('Моля добавете име на клиент');
            }
		}
	}

	protected getToday(): string {
		const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
		return today;
	}
}
