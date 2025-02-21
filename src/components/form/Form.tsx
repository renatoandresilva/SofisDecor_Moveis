import { FormHTMLAttributes, useState } from "react";
import { CSSProperties } from 'react';

import Input from "../Input/Input";
import styles from "./Form.module.css";
import db from '../../service/db.json';

type Data = typeof db

interface IData extends Data {

}

interface IFormProps extends FormHTMLAttributes<HTMLFormElement> {
    label?: string;
    customCSS?: CSSProperties | undefined;
    data?: IData;
}




const Form = (props: IFormProps) => {
    const [data] = useState<IData | undefined>(db)

    const setStyle = props.customCSS

    console.log(data!.address);


    return (
        <>
            {
                !setStyle ? (
                    <form {...props} className={styles.form}>

                    </form>
                ) : (
                    <form {...props} style={props.customCSS}>
                        <Input />
                    </form>
                )
            }

        </>
    )
}

export default Form