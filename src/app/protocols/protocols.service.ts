import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Protocol } from '../protocols/protocols/protocols.component';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../public/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProtocolsService {
    private apiUrl = 'http://localhost:3000/protocols';
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
        return this.protocols.filter((protocol) => protocol.user === this.user);
    }

    removeProtocol(protocolId: number) {
        this.http.delete<Protocol>(`${this.apiUrl}/${protocolId}`).subscribe(() => {
            this.getAllFromApi();
        });
    }

    addProtocolToAPI(protocol: Protocol): void {
        protocol.user = this.user;
        console.log('adding protocol', protocol);
        
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

    toProtocol(protocol: any): Protocol {
        return {
            id: protocol.id,
            user: protocol.user,
            medicines: protocol.medicines,
            validTo: new Date(protocol.validTo)
        }
    }
}
