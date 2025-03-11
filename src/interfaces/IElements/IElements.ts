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