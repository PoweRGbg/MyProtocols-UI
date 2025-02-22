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
    type: string;
    vehicleId: string;
    policyName: string;
    policyNumber: string;
    broker?: string;
    company?: string;
    comment?: string;
    amount: number;
    validFrom?: Date;
    validTo: Date;
    created?: Date;
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