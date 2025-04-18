import { useState, InputHTMLAttributes, FormEvent, useEffect } from 'react'

import { FaCheck } from 'react-icons/fa6'

import styles from './checkbox.module.css'

interface Checkbox extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name: string;
    update?: string;
}


const Checkbox = (props: Checkbox) => {

    const [isChecked, setIsChecked] = useState(false)
    const [change, setChange] = useState(false)


    const handleChecked = (e: FormEvent) => {
        const target = e.target as HTMLInputElement
        console.log(props.update);

        if (props.update !== '') {

            if (props.update === 'yes') {
                setChange(true)
                console.log(props.update);
            }

            setChange(false)
            return
        }

        console.log('estou fora');
        setIsChecked(Boolean(target.checked));
    }
    useEffect(() => {
        console.log('estou aqui...');

        setIsChecked(change)
    }, [change])

    return (

        <label className={styles.container}>
            <span className={styles.title}>Ativo</span>
            <div className={styles.input_container}>
                <input
                    {...props}
                    type='checkbox'
                    value={props.update === '' ? `${isChecked}` : props.update}
                    onChange={handleChecked}
                />
                <span>{isChecked ? <FaCheck size={20} /> : ''}</span>
            </div>
        </label>
    )
}

export default Checkbox
