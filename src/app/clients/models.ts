export interface Client {
    id: number;
    user: string;
    clientName: string;
    identifier: string;
    comment?: string;
    contact?: string;
    policies?: Policy[];
}

export interface Policy {
    id: number;
    vehicleId: string;
    policyName: string;
    policyNumber: string;
    broker?: string;
    company?: string;
    comment?: string;
    amount: number;
    validTo: Date;
    payments: Payment[];
}

export interface Payment {
    id: number;
    date: string;
    amount: number;
    issued: boolean;
    comment?: string;
    clientInformed: boolean;
    sent: boolean;
    paid: boolean;
    policyId: number;
    vehicleId: string;
}