import { Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, Policy } from '../clients/clients/clients.component';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../public/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private apiUrl = 'http://localhost:3030/clients';
    clients$: Observable<Client[]>;
    private clientsSubject = new Subject<Client[]>();
    private clients: Client[] = [];
    private user: string;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {
        this.clients$ = this.clientsSubject.asObservable();
        this.getAllFromApi();
        this.user = this.authService.getLoggedInUser();
    }

    addClient(client: Client) {
        this.addClientToAPI(client);
    }

    updateClient(client: Client) {
        this.updateClientToAPI(client);

    }

    getAllClients(): Client[] {
        this.user = this.authService.getLoggedInUser();
        this.getAllFromApi();
        return this.clients.filter((protocol) => protocol.user === this.user);
    }

    getClientByName(name: string): Client | undefined {
        this.getAllFromApi();
        console.log('returning', this.clients.find((client) => 
            client.user === this.user && client.clientName === name
        ));
        
        return this.clients.filter((protocol) => 
            protocol.user === this.user && protocol.clientName === name
        )[0];
    }

    removeClient(protocolId: number) {
        this.http.delete<Client>(`${this.apiUrl}/${protocolId}`).subscribe(() => {
            this.getAllFromApi();
        });
    }

    addClientToAPI(client: Client): void {
        client.user = this.user;
        console.log('addClientToAPI', client);
        
        this.http.post<Client>(this.apiUrl, client).subscribe(() => {
            this.getAllFromApi();
        });
    }

    updateClientToAPI(client: Client): void {
        client.user = this.user;
        console.log('updateClientAPI', client);
        
        this.http.put<Client>(this.apiUrl, client).subscribe(() => {
            this.getAllFromApi();
        });
    }

    addPolicy(clientId: number, policy: Policy): void {
        console.log('service addPolicy', clientId, policy);
        
        const client = this.clients.find((client) => client.id === clientId);
        if (!client) {
            console.log('Client not found', clientId);
            
            return;
        }  

        if (client.policies !== undefined) {
            client.policies.push(policy);
        } else {
            client.policies = [policy];
        }
    }

    getAllFromApi(): void {
        this.http.get<Client[]>(this.apiUrl).subscribe((clients) => {
            this.clients = clients
                .map(client => this.toClient(client))
                .filter((protocol) => protocol.user === this.user);
            this.clientsSubject.next([...this.clients]);
        });
    }

    toClient(protocol: any): Client {
        return {
            id: protocol.id,
            user: protocol.user,
            clientName: protocol.clientName,
            identifier: protocol.identifier,
            contact: protocol.contact ?? '',
            comment: protocol.comment ?? '',
            policies: protocol.policies ?? [],
        }
    }
}
