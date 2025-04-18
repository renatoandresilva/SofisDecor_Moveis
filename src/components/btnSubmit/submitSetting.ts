import { ButtonHTMLAttributes, CSSProperties } from "react"

// Btn Submit
export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    style?: CSSProperties;
    callback: (clicked?: boolean) => boolean;

}

