import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ClientsService } from '../clients.service';
import { AuthService } from '../../public/auth.service';
import { Client } from '../models';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'edit-client',
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss'
})
export class EditClientComponent implements OnInit {
	@Input() clientId: number | undefined;
	@Output() clientEditted: EventEmitter<boolean> = new EventEmitter<boolean>();

	now = new Date();
    protected client: Client | undefined;
	protected readonly todayAsString = formatDate(this.now, 'dd/MM/yyyy', 'en-EU');
	clientStart: string = this.todayAsString;
	clientName: string = '';
	contact: string = '';
	identifier: string = '';
	comment: string = '';
    
	constructor(
        private clientsService: ClientsService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        console.log('EditClientComponent: ngOnInit');
        
        const requestedClientId = this.route.snapshot.paramMap.get('clientId');
        if (requestedClientId === null) {
            alert('Клиентът не е намерен');
            return;
        }

        this.clientsService.getAllClients();

        this.clientId = Number(requestedClientId);

        this.clientsService.clients$.subscribe((clients) => {
            this.client = clients.find((c) => c.id === this.clientId);
            if (this.client === undefined) {
                alert('Клиентът не е намерен');
                return;
            }
            this.clientName = this.client?.clientName || '';
            this.contact = this.client?.contact || '';
            this.identifier = this.client?.identifier || '';
            this.comment = this.client?.comment || '';
        });
    }

	updateClient() {
        if (this.client === undefined) {
            alert('Клиентът не е намерен');
            return;
        } else {
            if (this.client.clientName.length < 1) {
                alert('Моля добавете име на клиент');
                return;
            }
            this.client.clientName = this.clientName;
            this.client.contact = this.contact;
            this.client.identifier = this.identifier;
            this.client.comment = this.comment;
            this.clientsService.updateClient(this.client);
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    clientName: this.client.clientName,
                }
            }
            this.router.navigate([`/protected/client/${this.client.clientName}`], navigationExtras);
        }
	}

	protected getToday(): string {
		const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
		return today;
	}
}
