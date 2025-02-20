import { InputHTMLAttributes } from "react"
import { CSSProperties } from 'react';

import styles from "./Input.module.css"


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    customCSS?: CSSProperties | undefined;
}

const Input = (props: InputProps) => {

    const setStyle = props.customCSS

    return (
        <>
            {props.label && (<label>{props.label}</label>)}
            {
                !setStyle ? (<input {...props} className={styles.input} />) : (<input {...props} style={props.customCSS} />)
            }
        </>
    )
}

export default Input

/*
    style={props.customCSS}
    className={styles.input}

*/