import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prescription } from '../prescriptions.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PrescriptionService {
	private apiUrl = 'http://localhost:3000/prescriptions';
	prescriptions$: Observable<Prescription[]>;
	private prescriptionsSubject = new Subject<Prescription[]>();
	private prescriptions: Prescription[] = [];

	constructor(private http: HttpClient) { 
		this.prescriptions$ = this.prescriptionsSubject.asObservable();
		this.getAllFromApi();
	}

	addPrescription(prescription: Prescription) {
		this.addPrescriptionToAPI(prescription);
	}

	getAllPrescriptions(): Prescription[] {
		return this.prescriptions;
	}

	removePrescription(prescriptionId: number) {
		this.http.delete<Prescription>(`${this.apiUrl}/${prescriptionId}`).subscribe(() => {
			this.getAllFromApi();
		});
	}

	addPrescriptionToAPI(prescription: Prescription): void {
		this.http.post<Prescription>(this.apiUrl, prescription).subscribe(() => {
			this.getAllFromApi();
		});
	}

	getAllFromApi(): void {
		this.http.get<Prescription[]>(this.apiUrl).subscribe((prescriptions) => {
			console.log('Got prescriptions from API: ' + JSON.stringify(prescriptions));
			
			this.prescriptions = prescriptions.map(prescription => this.toPrescription(prescription));
			console.log('Prescriptions after API: ',this.prescriptions);
			
			this.prescriptionsSubject.next([...this.prescriptions]);
		});
	}

	toPrescription(prescription: any): Prescription {
		return {
			id: prescription.id,
			medicineName: prescription.medicineName,
			validTo: new Date(prescription.validTo)
		}
	}
}
