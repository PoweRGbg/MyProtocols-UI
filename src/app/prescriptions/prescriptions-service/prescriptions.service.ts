import { Injectable } from '@angular/core';
import { Prescription } from '../prescriptions.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PrescriptionService {
	prescriptions$: Observable<Prescription[]>;
	private prescriptionsSubject = new Subject<Prescription[]>();
	private prescriptions: Prescription[] = [];

	constructor() { 
		this.prescriptions$ = this.prescriptionsSubject.asObservable();
	}

	addPrescription(prescription: Prescription) {
		this.prescriptions.push(prescription);
		this.prescriptionsSubject.next([...this.prescriptions]);
	}

	getAllPrescriptions(): Prescription[] {
		return this.prescriptions;
	}

	removePrescription(prescription: Prescription) {
		const indexInArray = this.prescriptions.indexOf(prescription);
		this.prescriptions.splice(indexInArray, 1);
		this.prescriptionsSubject.next(this.prescriptions)
	}
}
