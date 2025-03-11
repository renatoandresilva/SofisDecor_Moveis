
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
    purchcaseDate?: string
    dueDate?: number;
    initVlue?: number;
    qtdInstallment?: number;
    valueInstallment?: number;
    paymentInfo?: PaymentInfo[];
    docClientId?: string;
    clientName?: string;
}

