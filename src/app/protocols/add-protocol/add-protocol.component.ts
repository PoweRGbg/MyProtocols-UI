import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProtocolsService } from '../protocols.service';
import { formatDate } from '../../prescriptions/common';
import { AuthService } from '../../public/auth.service';

@Component({
  selector: 'add-protocol',
  templateUrl: './add-protocol.component.html',
  styleUrl: './add-protocol.component.scss'
})
export class AddProtocolComponent {
    @Input() medicines: string[] | undefined;

	now = new Date();
	protected readonly todayAsString = formatDate(this.now);
	protocolStart: string = this.todayAsString;
	protocolValidity: number = 90;
	medicinesInProtocol: string[] = [];
	medicine: string = '';
    
    @Output() protocolAdded: EventEmitter<boolean> = new EventEmitter<boolean>();
    
	constructor(
        private protocolsService: ProtocolsService,
        private authService: AuthService
    ) {
        this.medicinesInProtocol = this.medicines ?? [];
     }

	addProtocol() {
        if (this.medicinesInProtocol.length > 0 && this.protocolStart && this.protocolValidity) {
			const validTo: Date = new Date(
				new Date(this.protocolStart).getTime() + this.protocolValidity * 24 * 60 * 60 * 1000
			);
			this.protocolsService.addProtocol({
				id: this.protocolsService.getAllProtocols().length + 1,
                user: this.authService.getLoggedInUser(),
				medicines: this.medicinesInProtocol,
				validTo: validTo,
			});
            this.protocolAdded.emit(true);
			// Clear form fields after adding protocol
			this.protocolStart = this.todayAsString;
			this.protocolValidity = 30;
		} else {
            if (this.medicinesInProtocol.length < 1) {
			    alert('Моля добавете лекарства към протокола');
            } else if (!this.protocolStart) {
                alert('Моля попълнете начална дата на протокола');
            } else if (!this.protocolValidity) {
                alert('Моля попълнете валидност на протокола в дни');
            }
		}
	}

	protected getToday(): string {
		const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
		return today;
	}

	protected addMedicineToProtocol(medicineAdded: string): void {
        if (medicineAdded.length === 0) {
            alert('Моля въведете име на лекарство');
            return;
        }

        if (this.medicinesInProtocol.includes(medicineAdded)) {
            alert('Това лекарство вече е добавено към протокола');
            return;
        }
		this.medicinesInProtocol.push(medicineAdded);
	}

    protected removeMedicineFromProtocol(medicineRemoved: string): void {
        this.medicines = this.medicinesInProtocol.filter(medicine => medicine !== medicineRemoved);
    }
}
