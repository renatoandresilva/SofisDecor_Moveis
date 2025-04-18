import { ChangeEvent, CSSProperties, FormEvent, InputHTMLAttributes } from "react"

export type OnAction = string | FormEvent | ChangeEvent | MouseEvent


//Dopdown
export interface Dopdown extends InputHTMLAttributes<HTMLInputElement> {
    contents: string[];
    label?: string;
    placeholder?: string;
    owner_styles?: CSSProperties;
    name?: string;
    input: string;
}


// const selectStyle: CSSProperties = {
//     flex: "1 0 60%",
//     height: "40px",
//     width: "100%",
//     padding: ".7rem 2em",
//     border: ".8px solid #ccc",
//     borderRadius: "6px",
// }


/*
    type="text"
    placeholder={props.placeholder ?? 'Selecione uma opção...'}
    className={styles.input}
    value={input}
    onChange={handleChange}
    onClick={handleShowOptions}
*/