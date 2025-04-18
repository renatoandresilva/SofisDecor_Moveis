import { useState } from "react"
import { IButton } from "./submitSetting"

import styles from "./BtnSubmit.module.css"

const BtnSubmit = (props: IButton) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleIsloading = () => {

        if (!isLoading) {
            setIsLoading(true)
        }
    }

    return (
        <div className={styles.container}>
            <button
                onClick={handleIsloading}
                className={isLoading ? 'loader' : styles.button}
            >
                {!isLoading ? props.title : ''}
            </button>
        </div>
    )
}

export default BtnSubmit