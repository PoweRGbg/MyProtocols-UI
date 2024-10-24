import { Payment } from './clients/clients.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export const apiUrl: string = 'http://localhost:3030/';
// export const apiUrl: string = 'https://protocols.nightscout.bg/api/';


export function updatePaymentStatus(payment: Payment, snackBar: MatSnackBar): Payment {
    if (!payment.clientInformed) {
        payment.clientInformed = true;
        
        if (isPaymentOverdue(payment)) {
            snackBar.open('Вноската е изпратена на клиента, но не е платена', 'Затвори', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            });
        }
    } else if (payment.clientInformed && !payment.issued) {
        payment.issued = true;
        if (isPaymentOverdue(payment)) {
            snackBar.open('Вноската е издадена, но не е платена', 'Затвори', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            });
        }

    } else if (payment.issued && !payment.sent) {
        payment.sent = true;
        if (isPaymentOverdue(payment)) {
            snackBar.open('Вноската е изпратена, но не е платена', 'Затвори', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            });
        }
    } else if (payment.sent && !payment.paid) {
        payment.paid = true;
    } else if (payment.paid) {
        payment.clientInformed = false;
        payment.issued = false;
        payment.sent = false;
        payment.paid = false;
        return payment;
    }
    return payment;
}

export function isPaymentOverdue(payment: Payment): boolean {
    const today = new Date(); 
    const tomorrow = new Date(today.setDate(today.getDate() - 15));
    
    const paymentDate = convertEUStringToDate(payment.date);

    return paymentDate < tomorrow && !payment.paid;
}

export function convertEUStringToDate(targetDate: string): Date {
    return new Date(targetDate.split('/').reverse().join('/'));
}

export function getMonthAndYear(date: Date): string {
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function oneYearFromDate(date: Date): Date {
    return new Date(date.setFullYear(date.getFullYear() + 1));
}
