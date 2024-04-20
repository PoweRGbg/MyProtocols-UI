import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prescription } from '../prescriptions.component';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../public/auth.service';

@Injectable({
	providedIn: 'root'
})
export class PrescriptionService {
	private apiUrl = 'http://localhost:3000/prescriptions';
	prescriptions$: Observable<Prescription[]>;
	private prescriptionsSubject = new Subject<Prescription[]>();
	private prescriptions: Prescription[] = [];
    private user: string;

	constructor(private http: HttpClient, private authService: AuthService) { 
		this.prescriptions$ = this.prescriptionsSubject.asObservable();
        this.user = this.authService.getLoggedInUser();
		this.getAllFromApi();
	}

	addPrescription(prescription: Prescription) {
        prescription.user = this.user;
		this.addPrescriptionToAPI(prescription);
	}

	getAllPrescriptions(): Prescription[] {
        this.getAllFromApi();
		return this.prescriptions.filter((prescription) => prescription.user === this.user);
	}

	removePrescription(prescriptionId: number) {
		this.http.delete<Prescription>(`${this.apiUrl}/${prescriptionId}`).subscribe(() => {
			this.getAllFromApi();
		});
	}

	fulfillPrescription(prescriptionId: number) {
        const body = { status: Date.now() };
        this.http.put<Prescription>(
            `${this.apiUrl}/${prescriptionId}`,
            body,
            { headers: {
                'Content-Type': 'application/json',
            }
        }).subscribe(() => {
			this.getAllFromApi();
		});
	}

	addPrescriptionToAPI(prescription: Prescription): void {
		this.http.post<Prescription>(this.apiUrl, prescription).subscribe(() => {
			this.getAllFromApi();
		});
	}

	getAllFromApi(): void {
        this.user = this.authService.getLoggedInUser();
        console.log('getting all prescriptions from API for user', this.user);
		this.http.get<Prescription[]>(this.apiUrl).subscribe((prescriptions) => {
			this.prescriptions = prescriptions
                .filter(prescription => prescription.user === this.user)
                .map(prescription => this.toPrescription(prescription));
			this.prescriptionsSubject.next([...this.prescriptions.sort((a, b) => a.validTo.getTime() - b.validTo.getTime())]);
		});
	}

    isThereAValidPrescription(medicineName: string): boolean {
        const prescriptionsForMedicine = this.prescriptions
            .filter(prescription => 
                prescription.medicineName === medicineName && prescription.user === this.user);
        const today = new Date();
        const validPrescriptions = prescriptionsForMedicine
            .filter(prescription => prescription.validTo >= today);
        return validPrescriptions.length > 0;
    }

    // method to get all prescriptions expiring in the next 7 days
    getPrescriptionsExpiringInDays(days: number): Prescription[] {
        const today = new Date();
        const nextDays = new Date(today);
        nextDays.setDate(today.getDate() + days);
        if (!this.prescriptions.length) {
            console.log('getting all prescriptions from API');
            this.getAllFromApi();
        }
        console.log('prescriptions in service', this.prescriptions);
        
        return this.prescriptions
            .filter(prescription => prescription.validTo >= today && prescription.validTo <= nextDays);
    }

    getExpiredPrescriptions(): Prescription[] {
        const today = new Date();
        return this.prescriptions
            .filter(prescription => prescription.validTo < today);
    }

	toPrescription(prescription: any): Prescription {
		return {
			id: prescription.id,
            user: prescription.user,
			medicineName: prescription.medicineName,
			validTo: new Date(prescription.validTo),
            fulfilledDate: 
                prescription.fulfilledDate ? new Date(prescription.fulfilledDate) : undefined,
		}
	}
}
