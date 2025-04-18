import { PaymentInfo } from "../sale/saleSettings"

export type EssentiolStruc = {
    clientName: string,
    initValue: 0,
    installmentList: PaymentInfo[],
    purchcaseDate: ""
}

export type entriesStruc = {
    id: string
    length: number;
    mainData: EssentiolStruc[]
}

export type Debtors = {
    debtorsList: PaymentInfo[],
    debtsValue: number,
}

export type Cost_MainStruc = {
    totalCost?: number,
    monthlyCost?: number,
    costs_fix: ListCost[],
    costs_variable: ListCost[],
}

export type mainView = {
    entries?: entriesStruc,
    costs?: Cost_MainStruc
}

export type Balance = {
    id?: string,
    bank: string,
    value: number,
    owner: string,
}

export type ListCost = {
    destination: string,
    value: 0,
    date: string,
    active: boolean
}

export type ShowCostResult = {
    totalFix: number,
    totalVariable: number,
    monthlyCost: number,
    totalCost: number,
}

// Functions
export async function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function monthNumber(number: number) {

    if (number === 1) {
        return 0
    } else if (number === 2) {
        return 1
    } else if (number === 3) {
        return 2
    } else if (number === 4) {
        return 3
    } else if (number === 5) {
        return 4
    } else if (number === 6) {
        return 5
    } else if (number === 7) {
        return 6
    } else if (number === 8) {
        return 7
    } else if (number === 9) {
        return 8
    } else if (number === 10) {
        return 9
    } else if (number === 11) {
        return 10
    } else if (number === 12) {
        return 11
    } else {
        null
    }
}

export function getMonth(date: string) {

    function monthNumber(number: number) {

        if (number === 1) {
            return 0
        } else if (number === 2) {
            return 1
        } else if (number === 3) {
            return 2
        } else if (number === 4) {
            return 3
        } else if (number === 5) {
            return 4
        } else if (number === 6) {
            return 5
        } else if (number === 7) {
            return 6
        } else if (number === 8) {
            return 7
        } else if (number === 9) {
            return 8
        } else if (number === 10) {
            return 9
        } else if (number === 11) {
            return 10
        } else if (number === 12) {
            return 11
        } else {
            null
        }
    }

    const currDate = new Date()
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth()

    let spliteDate
    date.indexOf('/') !== -1 ? spliteDate = date.split('/') : spliteDate = date.split('-')

    const [year, month, day] = spliteDate

    const currMonth_Num = monthNumber(Number(month))

    let dateRef = new Date(Number(year), currMonth_Num!, Number(day))

    if (dateRef.getFullYear() === currYear && dateRef.getMonth() === currMonth) {

        return { isRight: true, monthNumber: dateRef.getMonth(), yearNumber: dateRef.getFullYear() }
    }

    return { isRight: false, monthNumber: dateRef.getMonth(), yearNumber: dateRef.getFullYear() }
}


