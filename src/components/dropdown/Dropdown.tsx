import { useEffect, useState } from 'react'
import styles from './Dropdown.module.css'

import { Dopdown } from '../../interfaces/IElements/IElements'

const Dropdown = (props: Dopdown) => {
    const [input, setInput] = useState('');
    const [showOptions, setShowOptions] = useState(false)

    // Handles Functions
    const handleShowOptions = () => {
        !showOptions ? setShowOptions(true) : setShowOptions(false)
    }

    const setInputData = (str: string) => {

        if (str !== "") {
            props.change(str)
            setInput(str)
            setShowOptions(false)
        }
    }

    useEffect(() => {
        if (props.update !== undefined) {
            setInput(props.update)
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.container_input}>
                <label>{props.label}</label>
                <input
                    type="text"
                    placeholder={props.placeholder ?? 'Selecione uma opção...'}
                    className={styles.input}
                    value={input}
                    onChange={(e) => props.change(e.target.value)}
                    onClick={handleShowOptions}
                />

            </div>
            <ul className={styles.options}>
                {showOptions && props.contents?.map((content) => (<li key={content} onClick={() => setInputData(content)}>
                    <span>{content}</span>
                </li>))}
            </ul>
        </div>
    )
}

export default Dropdown