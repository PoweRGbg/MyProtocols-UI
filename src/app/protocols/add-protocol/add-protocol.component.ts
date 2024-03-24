import { Component, EventEmitter, Output } from '@angular/core';
import { ProtocolsService } from '../protocols.service';
import { formatDate } from '../../prescriptions/common';
import { AuthService } from '../../public/auth.service';

@Component({
  selector: 'add-protocol',
  templateUrl: './add-protocol.component.html',
  styleUrl: './add-protocol.component.scss'
})
export class AddProtocolComponent {
	now = new Date();
	protected readonly todayAsString = formatDate(this.now);
	protocolStart: string = this.todayAsString;
	protocolValidity: number = 90;
	medicines: string[] = [];
	medicine: string = '';
    @Output() protocolAdded: EventEmitter<boolean> = new EventEmitter<boolean>();
    
	constructor(
        private protocolsService: ProtocolsService,
        private authService: AuthService
    ) { }

	addProtocol() {
        if (this.medicines.length > 0 && this.protocolStart && this.protocolValidity) {
			const validTo: Date = new Date(
				new Date(this.protocolStart).getTime() + this.protocolValidity * 24 * 60 * 60 * 1000
			);
			this.protocolsService.addProtocol({
				id: this.protocolsService.getAllProtocols().length + 1,
                user: this.authService.getLoggedInUser(),
				medicines: this.medicines,
				validTo: validTo,
			});
            this.protocolAdded.emit(true);
			// Clear form fields after adding protocol
			this.protocolStart = this.todayAsString;
			this.protocolValidity = 30;
		} else {
            if (this.medicines.length < 1) {
			    alert('Please add at least one medicine to protocol');
            } else if (!this.protocolStart) {
                alert('Please fill in protocol start date');
            } else if (!this.protocolValidity) {
                alert('Please fill in protocol validity');
            }
		}
	}

	protected getToday(): string {
		const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
		return today;
	}

	protected addMedicineToProtocol(medicineAdded: string): void {
        if (medicineAdded.length === 0) {
            alert('Please fill in medicine name');
            return;
        }

        if (this.medicines.includes(medicineAdded)) {
            alert('Medicine already added to protocol');
            return;
        }
		this.medicines.push(medicineAdded);
	}

    protected removeMedicineFromProtocol(medicineRemoved: string): void {
        this.medicines = this.medicines.filter(medicine => medicine !== medicineRemoved);
    }
}
