export type Arr = []

export const selectionList: string[] = [
    ' Variável',
    'Fixo Detrminado',
    'Fixo Indeterminado',
]

export type Datatype = {
    cost_with: string;
    cost_value: number;
    cost_categoy: string;
    cost_active: boolean;
    cost_month?: '';
    id?: number,
}

export type Structure = {
    data: Datatype
    docId: string,
}

