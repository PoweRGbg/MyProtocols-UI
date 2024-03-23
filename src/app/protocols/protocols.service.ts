import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Protocol } from '../protocols/protocols/protocols.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ProtocolsService {
	private apiUrl = 'http://localhost:3000/protocols';
	protocols$: Observable<Protocol[]>;
	private protocolsSubject = new Subject<Protocol[]>();
	private protocols: Protocol[] = [];

	constructor(private http: HttpClient) { 
		this.protocols$ = this.protocolsSubject.asObservable();
		this.getAllFromApi();
	}

	addProtocol(protocol: Protocol) {
        console.log('Adding protocol to API: ', protocol);
		this.addProtocolToAPI(protocol);
	}

	getAllProtocols(): Protocol[] {
		return this.protocols;
	}

	removeProtocol(protocolId: number) {
		this.http.delete<Protocol>(`${this.apiUrl}/${protocolId}`).subscribe(() => {
			this.getAllFromApi();
		});
	}

	addProtocolToAPI(protocol: Protocol): void {
		this.http.post<Protocol>(this.apiUrl, protocol).subscribe(() => {
			this.getAllFromApi();
		});
	}

	getAllFromApi(): void {
		this.http.get<Protocol[]>(this.apiUrl).subscribe((protocols) => {
			console.log('Got protocols from API: ' + JSON.stringify(protocols));
			
			this.protocols = protocols.map(protocol => this.toProtocol(protocol));
			console.log('Protocols after API: ',this.protocols);
			
			this.protocolsSubject.next([...this.protocols]);
		});
	}

	toProtocol(protocol: any): Protocol {
		return {
			id: protocol.id,
			medicines: protocol.medicines,
			validTo: new Date(protocol.validTo)
		}
	}
}
