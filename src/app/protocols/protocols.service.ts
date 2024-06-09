import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Protocol } from '../protocols/protocols/protocols.component';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../public/auth.service';
import { defaultProtocolValidityInDays } from '../common/common';

@Injectable({
    providedIn: 'root'
})
export class ProtocolsService {
    private apiUrl = 'https://protocols.nightscout.bg/api/protocols';
    // private apiUrl = 'http://localhost:3030/protocols';
    protocols$: Observable<Protocol[]>;
    private protocolsSubject = new Subject<Protocol[]>();
    private protocols: Protocol[] = [];
    private user: string;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {
        this.protocols$ = this.protocolsSubject.asObservable();
        this.getAllFromApi();
        this.user = this.authService.getLoggedInUser();
    }

    addProtocol(protocol: Protocol) {
        this.addProtocolToAPI(protocol);
    }

    getAllProtocols(): Protocol[] {
        this.user = this.authService.getLoggedInUser();
        this.getAllFromApi();

        return this.protocols.filter((protocol) => protocol.user === this.user);
    }

    removeProtocol(protocolId: number) {
        this.http.delete<Protocol>(`${this.apiUrl}/${protocolId}`).subscribe(() => {
            this.getAllFromApi();
        });
    }

    renewProtocol(protocolId: number): number | undefined {
        const protocolToRenew = this.protocols.find((protocol) => protocol.id === protocolId);
        if (!protocolToRenew) {
            return;
        }

        const validityInDays = protocolToRenew.issued !== undefined ? 
            (protocolToRenew.validTo.getTime() - protocolToRenew.issued.getTime()) / (1000 * 60 * 60 * 24):
            defaultProtocolValidityInDays;
        const renewedProtocol = {
            ...protocolToRenew,
            id: this.protocols[this.protocols.length - 1].id + 1,
            validTo: new Date(new Date().getTime() + validityInDays * 24 * 60 * 60 * 1000),
            issued: new Date(),
        };
        
        this.addProtocol(renewedProtocol);
        this.removeProtocol(protocolId);
        return renewedProtocol.id;
    }

    addProtocolToAPI(protocol: Protocol): void {
        protocol.user = this.user;
        
        this.http.post<Protocol>(this.apiUrl, protocol).subscribe(() => {
            this.getAllFromApi();
        });
    }

    getAllFromApi(): void {
        this.http.get<Protocol[]>(this.apiUrl).subscribe((protocols) => {
            this.protocols = protocols
                .map(protocol => this.toProtocol(protocol))
                .filter((protocol) => protocol.user === this.user);
            this.protocolsSubject.next([...this.protocols]);
        });
    }

    getProtocolsInDays(days: number): Protocol[] {
        const now = new Date();
        const daysFromNow = new Date(now.setDate(now.getDate() + days));
        return this.protocols.filter((protocol) => protocol.validTo <= daysFromNow);
    }

    getExpiredProtocols(): Protocol[] {
        const now = new Date();
        return this.protocols.filter((protocol) => protocol.validTo < now);
    }

    toProtocol(protocol: any): Protocol {
        return {
            id: protocol.id,
            user: protocol.user,
            medicines: protocol.medicines,
            validTo: new Date(protocol.validTo)
        }
    }
}
