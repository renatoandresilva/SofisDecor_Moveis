import { SelectProps } from '../../interfaces/IElements/IElements';
import '../../App.css'

const Select = (props: SelectProps) => {

    return (
        <>
            <label>{props.label}</label>
            <select
                {...props}
            >
                <option value="" >{props.placeholder}</option>
                {
                    props.values.map((value, index) => (
                        value === props.str ? (<option key={index} value={value} {...props.option} selected>{value}</option>) : (<option key={index} value={value} {...props.option}>{value}</option>)
                    ))
                }
            </select>
        </>
    )
}

export default Select;
