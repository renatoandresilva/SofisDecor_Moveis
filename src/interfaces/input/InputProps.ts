import { InputHTMLAttributes, SelectHTMLAttributes } from "react"
import { CSSProperties } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    style?: CSSProperties | undefined;
}

type Option = React.OptionHTMLAttributes<HTMLOptionElement>
type seleElementRef = React.RefObject<HTMLSelectElement | null>

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    option?: Option;
    values: string[];
    style?: CSSProperties | undefined;
    elementRef?: seleElementRef
}

