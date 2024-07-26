import { Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, Policy } from '../clients/clients/clients.component';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../public/auth.service';
import { apiUrl, convertEUStringToDate } from './common';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private apiUrl = apiUrl + 'clients';
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
        return this.clients;
    }

    getClientByName(name: string): Client | undefined {
        this.getAllFromApi();
        
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
        
        this.http.post<Client>(this.apiUrl, client).subscribe(() => {
            this.getAllFromApi();
        });
    }

    updateClientToAPI(client: Client): void {
        client.user = this.user;
        
        this.http.put<Client>(this.apiUrl, client).subscribe(() => {
            this.getAllFromApi();
        });
    }

    addPolicy(clientId: number, policy: Policy): void {
        
        const client = this.clients.find((client) => client.id === clientId);
        policy.payments = policy.payments.map((payment) => {
            payment.issued = false;
            payment.clientInformed = false;
            payment.sent = false;
            payment.paid = false;
            payment.policyId = policy.id;
            return payment;
        });
        if (!client) {
            return;
        }  

        if (client.policies !== undefined) {
            client.policies.push(policy);
        } else {
            client.policies = [policy];
        }
    }

    getAllFromApi(): void {
        console.log('Getting all clients from API');
        
        this.http.get<Client[]>(this.apiUrl).subscribe((clients) => {
            this.clients = clients
                .map(client => this.toClient(client));
                
            this.clientsSubject.next([...this.clients]);
        });
    }

    clientsWithOverdues(): Client[] {
        const now = new Date();
        const clientsWithOverduePayments = this.clients.map((client) => {
            const policiesWithOverduePayments = client.policies?.map((policy) => {
                const payments = policy.payments.filter((payment) => {
                    const paymentDate = convertEUStringToDate(payment.date);
                    return paymentDate < now && payment.paid === false;
                });
                return { ...policy, payments };
            });
            return { ...client, policies: policiesWithOverduePayments };
        });

        return clientsWithOverduePayments
            .map((client) => {
                let policiesOverdue: Policy[] = [];
                client.policies?.forEach((policy) => {
                    if (policy.payments.length > 0) {
                        policiesOverdue.push(policy);
                    }
                });
                return { ...client, policies: policiesOverdue};
            })
            .filter((client) => this.clientHasPayments(client) === true);
    }

    clientsWithDuesNextDays(numberOfDays: number): Client[] {
        const now = new Date();
        const daysFromNow = new Date(now.setDate(now.getDate() + numberOfDays));
        const clientsWithOverduePayments = this.clients.map((client) => {
            const policiesWithOverduePayments = client.policies?.map((policy) => {
                const payments = policy.payments.filter((payment) => {
                    const paymentDate = convertEUStringToDate(payment.date);
                    if (client.clientName === 'Румен') {
                        console.log('Payment date', this.formatDate(paymentDate),
                            'Now', this.formatDate(now),
                            'Days from now', this.formatDate(daysFromNow));
                    }
                    return paymentDate <= daysFromNow
                        && paymentDate >= new Date() 
                        && payment.paid === false;
                });
                return { ...policy, payments };
            });

            return { ...client, policies: policiesWithOverduePayments };
        });

        return clientsWithOverduePayments
            .map((client) => {
                let policiesOverdue: Policy[] = [];
                client.policies?.forEach((policy) => {
                    if (policy.payments.length > 0) {
                        policiesOverdue.push(policy);
                    }
                });
                return { ...client, policies: policiesOverdue};
            })
            .filter((client) => this.clientHasPayments(client) === true);
    }

    filterClientsByDate(date: Date): Client[] {
        this.getAllFromApi();
        const filteredClients = this.clients.filter((client) => {
            return client.policies?.some((policy) => {
                return policy.payments?.some((payment) => {
                    const paymentDate = payment.date.split('/');
                    const filterDate = this.formatDate(date).split('/');
                    
                    return paymentDate[1] === filterDate[1] && paymentDate[2] === filterDate[2];
                });
            });
        });
        console.log('Filtered clients', filteredClients);
        
        this.clientsSubject.next([...filteredClients]);
        return filteredClients;
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
    
    protected clientHasPayments(client: Client): boolean {
        if (!client.policies) {
            return false;
        }
        return client.policies?.some((policy) => policy.payments.length > 0);
    }

    protected formatDate(targetDate: Date): string {
        return targetDate.getDate() + '/' + (targetDate.getMonth() + 1) + '/' + targetDate.getFullYear();
    }
}
