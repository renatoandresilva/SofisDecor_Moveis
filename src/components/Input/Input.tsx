import { InputProps } from "../../interfaces/input/InputProps";
import styles from "./Input.module.css"

const Input = (props: InputProps) => {

    const setStyle = props.style

    return (
        <>
            {props.label && (<label>{props.label}</label>)}
            {
                !setStyle ? (<input {...props} className={styles.input} />) : (<input {...props} style={props.style} />)
            }
        </>
    )
}

export default Input

