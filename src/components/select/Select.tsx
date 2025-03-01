import { SelectProps } from '../../interfaces/input/InputProps';

const Select = (props: SelectProps) => {

    return (
        <>
            <label>{props.label}</label>
            <select
                {...props}
            >
                <option value="" >Selecione a origem da busca... </option>
                {
                    props.values.map((value) => (
                        <option key={value} value={value} {...props.option}>{value}</option>
                    ))
                }
            </select>
        </>
    )
}

export default Select;
