import { ChangeEvent, useState } from 'react'
import styles from './Dropdown.module.css'

import { FaX } from 'react-icons/fa6'
// import { ContextOnLoading } from '../../contexts/ContextLoading'

import { Dopdown } from './dropdownSetting'

const Dropdown = (props: Dopdown) => {

    const [input, setInput] = useState('');
    const [showOptions, setShowOptions] = useState(false)

    // Handles Functions
    const handleShowOptions = () => {
        !showOptions ? setShowOptions(true) : setShowOptions(false)
    }

    const setInputData = (str: string) => {


        setInput(str)
    }

    const handleChange = (e: ChangeEvent) => {

        const target = e.target as HTMLInputElement
        // const { name, value } = target

        console.log(target);

        // setFormValue({ ...formValue, [name]: value })
    }

    const handleClean = () => {
        setInput('')
    }

    return (
        <div className={styles.dropdown}>

            <label className={styles.dropdown_input}>
                {props.label}
                <div className={styles.dropdown_input_container}>
                    <input
                        {...props}
                        value={input === '' ? props.input : input}
                        className={styles.input}
                        onChange={handleChange}
                        onClick={handleShowOptions}
                    />
                    <button type='button' onClick={handleClean} className={styles.clean}>
                        <FaX />
                    </button>
                </div>
            </label>

            <ul className={styles.options} style={props.owner_styles}>
                {showOptions && props.contents?.map((content) => (<li key={content} onClick={() => setInputData(content)}>
                    <span>{content}</span>
                </li>))}
            </ul>
        </div>
    )
}

export default Dropdown