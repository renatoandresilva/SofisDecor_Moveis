import { useState } from "react"
import { IButton } from "../../interfaces/IElements/IElements"

import '../../App.css'

const Button = (props: IButton) => {

    const [isLoading, setIsLoading] = useState(false)

    const obj = { ...props }

    if (!!obj.onClick) {

        obj.onClick = () => {
            setIsLoading(true)
            props.onClick
        }
    }

    return (
        <div>
            {
                !isLoading ? (<button
                    {...obj}
                >
                    {props.title}
                </button>) :
                    (<div className="loading"></div>)
            }
        </div>
    )
}

export default Button