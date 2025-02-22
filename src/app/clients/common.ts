import { convertDateFromEU, convertDateToEU } from '../common/common';
import { Client, Payment, Policy } from './models';
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

export function areAllPaymentsPaid(policy: Policy): boolean {
    return policy.payments.every((payment) => payment.paid);
}

export function filterPoliciessByDate(policies: Policy[], filterDate: string[]): Policy[] {
    const filterMonthYear = filterDate[1] + '/' + filterDate[2];
    console.log('filtering for ', filterMonthYear);
    return policies.filter((policy) => {
        const paymentEveryMonths = 12 / policy.payments.length;
        let calculatedPolicyEnd = convertDateFromEU(policy.payments[policy.payments.length - 1].date);
        calculatedPolicyEnd.setMonth(getLastPaymentDateAsDate(policy).getMonth() + paymentEveryMonths);

        const calculatedEndDate = getMonthAndYear(calculatedPolicyEnd).split('/');
        if (calculatedEndDate.join('/').endsWith(filterMonthYear)) {
            return true;
        }
        return policy.payments?.filter((payment) => {
            return payment.date.endsWith(filterMonthYear) && !payment.paid;
        });
    })
}

export function getLastPaymentDateAsDate(policy: Policy): Date {
    return convertDateFromEU(policy.payments[policy.payments.length - 1].date);
}

export function filterPolicysByDate(policies: Policy[], filterDate: string[]): Policy[] {
    let hits = 0;
    const filterMonthYear = filterDate[1] + '/' + filterDate[2];
    console.log('filtering for ', filterMonthYear);
    let filteredPolicies: Policy[] = policies.filter((policy) => {
        let calculatedPolicyEnd = new Date(policy.validTo);

        // calculatedPolicyEnd.setMonth(getLastPaymentDateAsDate(policy).getMonth() + paymentEveryMonths);
        
        const calculatedEndDate = getMonthAndYear(calculatedPolicyEnd);
     
        if (calculatedEndDate.endsWith(filterMonthYear)) {
            hits++;
            return true;
        }
        
        return policy.payments?.some((payment) => {
            return payment.date.endsWith(filterMonthYear);
        });
    });
    
    filteredPolicies.forEach((policy) => {
        policy.payments.map((payment) => {
            payment.date.endsWith(filterMonthYear);
        });
    });
    return filteredPolicies;
}

export function getLastPaymentComment(policy: Policy): string {
    let lastComment = '';
    policy.payments.forEach((payment) => {
        if (payment.comment) {
            lastComment = payment.comment;
        }
    })
    return lastComment;
}

export function sortClientsByDate(clients: Client[], filterMonthAndYear: string): Client[] {
    return clients.sort((a, b) => {
        if (!a.policies || !b.policies) {
            return 0;
        };

        let dateA: Date | undefined = a.policies!.find((policy) =>
          convertDateToEU(policy.validTo).endsWith(filterMonthAndYear)
        )?.validTo;
        let dateB: Date | undefined = b.policies!.find((policy) =>
          convertDateToEU(policy.validTo).endsWith(filterMonthAndYear)
        )?.validTo;
        
        if (!dateA) {
            const filteredA = getFilteredDate(a, filterMonthAndYear);
            dateA = convertDateFromEU(filteredA!);
        }

        if (!dateB) {
            const filteredB = getFilteredDate(b, filterMonthAndYear);
            dateB = convertDateFromEU(filteredB!);
        }
        
        if (typeof dateB === 'string') {
            dateB = new Date(dateB);
        }
        if (typeof dateA === 'string') {
            dateA = new Date(dateA);
        }
        
        if (dateA && dateB) {
            return dateA.getTime() - dateB.getTime();
        }            
        if (dateA) {
            return -1;
        }
        if (dateB) {
            return 1;
        }
        return 0;
    });
}

export function getFilteredDate(client: Client, filterMonthAndYear: string): string | undefined {
  return client
    .policies!.find((policy) =>
      policy.payments.find((payment) =>
        convertDateToEU(payment.date).endsWith(filterMonthAndYear)
      )
    )!
    .payments.find((payment) => payment.date.endsWith(filterMonthAndYear))
    ?.date;
}

export function getDateDashed(date: Date): string {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}
