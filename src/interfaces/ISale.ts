
export type PaymentInfo = {
    paymentDate: string;
    numberInstallment: number;
    valuePaid: number;
}

export type CurrentProduct = {
    prod: string,
    price: number
}

export interface ISale {
    products: CurrentProduct[];
    dueDate?: string
    qtdInstallment?: number;
    valueInstallment?: number;
    paymentInfo?: PaymentInfo[];
    docClientId?: string;
    clientName?: string;

}

