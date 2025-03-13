import { InputHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from "react"
import { CSSProperties } from 'react';

// Input
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    style?: CSSProperties | undefined;
}

// Select
type Option = React.OptionHTMLAttributes<HTMLOptionElement>

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    placeholder?: string;
    option?: Option;
    values: string[];
    style?: CSSProperties | undefined;
    str?: string;
}

// Btn Submit
export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    style?: CSSProperties | undefined;
    click(): void
}

//Dopdown
export type Dopdown = {
    contents: string[],
    label?: string,
    placeholder?: string,
    owner_styles?: CSSProperties,
    change: (str: string) => void
    update?: string,
}


// const selectStyle: CSSProperties = {
//     flex: "1 0 60%",
//     height: "40px",
//     width: "100%",
//     padding: ".7rem 2em",
//     border: ".8px solid #ccc",
//     borderRadius: "6px",
// }
