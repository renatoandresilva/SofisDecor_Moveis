import { CSSProperties } from "react";

export type PaymentInfo = {
    paymentDate: string;
    numberInstallment: number;
    installment?: number;
    valuePaid: number;
    isPaid?: boolean;
    client?: string;
    rest?: number,
}

export const dispay_none: CSSProperties = {
    display: 'none',
}

export type Product = {
    product: string,
    price: number,
}

export type SaleStruc = {
    products: Product[],
    initValue: number,
    purchcaseDate: string,
    qtdInstallment: number,
    valueInstallment: number,
    paymentAccount: string,
    dueDate: string,
    paymentInfoList: PaymentInfo[],
    clientName: string,
}
