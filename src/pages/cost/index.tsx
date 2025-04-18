import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'

// Databse
import { db } from "../../service/dataConnection"
import { addDocFnc, getDocsFunc, getDocFnc, updateDocFunc, deleteFunc } from "../../interfaces/IUtilis/IUtilitis"
import { FaX } from 'react-icons/fa6'

import styles from './Cost.module.css'
import '../../App.css'

// Settings and types
import { selectionList } from './costSettings'
import { custom_style } from '../../interfaces/custom_styles/genral'
import { Structure, Datatype } from './costSettings'

// Components
import Input from "../../components/Input/Input"

const fields: Datatype = {
    cost_with: '',
    cost_value: 0,
    cost_categoy: '',
    cost_active: false,
    cost_month: '',
    id: 0,
}

const Cost = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const [formValue, setFormValue] = useState(fields)
    const [filter, setFilter] = useState('')

    const [checkbox, setCheckbox] = useState(false)
    const [onSave, setOnSave] = useState(false)

    const [dropdown, setDropdown] = useState('');
    const [dropdownShowOptions, setDropdownShowOptions] = useState(false)

    const [filterd, setFiltered] = useState<Structure[]>([])
    const [table, setTable] = useState<Structure[]>([])

    const [id, setId] = useState('')

    const formSubmit = (event: FormEvent) => {
        event.preventDefault()
        setOnSave(true)

        if (formValue.cost_with === '') {

            setOnSave(false)
            return alert("Custo deve ser preenchido")
        }

        if (formValue.cost_value === 0) {

            setOnSave(false)
            return alert("Valor deve ser preenchido")
        }

        if (formValue.cost_categoy === '') {

            return alert("Categoria deve ser preenchido")
        }

        if (!formValue.cost_active) {

            return alert("Campo Ativo deve ser preenchido")
        }
        // set load spin

        if (id === '') {

            // set Date
            addDocFnc(db, 'cost', formValue)

            setOnSave(false)
            setFormValue(fields)
            setDropdown('')
            setCheckbox(false)
            return
        }

        updateDocFunc(db, 'cost', id, formValue)
        setOnSave(false)
        setFormValue(fields)
        setDropdown('')
        setCheckbox(false)
    }

    const handleChange = (e: ChangeEvent) => {

        const target = e.target as HTMLInputElement
        const { name, value } = target

        setFormValue({ ...formValue, [name]: value })
    }

    const checkboxChange = (change: ChangeEvent) => {

        const target = change.target as HTMLInputElement
        setCheckbox(target.checked);
        target.name

        setFormValue({ ...formValue, [target.name]: target.checked })
    }

    const handleFilter = (value: string) => {

        setFilter(value)
    }

    const handleBtnActionsEdit = (key: string) => {

        const id = key.slice(0, key.length - 1)

        const result = table.filter(item => item.docId === id)

        setCheckbox(Boolean(result[0].data.cost_active))
        setDropdown(result[0].data.cost_categoy);
        setFormValue(result[0].data)
        setId(id)
    }

    const handleBtnActionsDelete = (key: string) => {

        const id = key.slice(0, key.length - 1)

        if (confirm('Esta ação não poderá ser desfeita. continuar?')) {

            deleteFunc(db, 'cost', id)
        }
    }

    const handleShowOptions = () => {
        !dropdownShowOptions ? setDropdownShowOptions(true) : setDropdownShowOptions(false)
    }

    const setInputData = (str: string) => {
        const name = 'cost_categoy'
        setFormValue({ ...formValue, [name]: str })

        setDropdown(str);
        setDropdownShowOptions(false)
    }

    const handleClean = () => {
        setDropdown('')
    }

    // Use Effect
    useEffect(() => {

        if (id) {
            getDocFnc(db, 'cost', id).then(data => {

                fields.cost_with = data!.cost_with
                fields.cost_value = data!.cost_value
                fields.cost_categoy = data!.cost_categoy
                fields.cost_active = data!.cost_active
                fields.cost_month = data!.cost_month
                fields.id = data!.id
            })

            setFormValue(fields)
        }

        getDocsFunc(db, 'cost').then(data => {
            const tableRef: Structure[] = []

            data?.forEach(item => {
                const dataRef: Structure = {
                    data: {
                        cost_with: item.docData.cost_with,
                        cost_value: item.docData.cost_value,
                        cost_categoy: item.docData.cost_categoy,
                        cost_active: item.docData.cost_active,
                        cost_month: item.docData.cost_month,
                        id: item.docData.id,
                    },
                    docId: item.docId
                }
                tableRef.push(dataRef)
            })

            const unique = [...new Set(tableRef)]
            setTable(unique)
        })


    }, [])

    useEffect(() => {

        const newList = table.filter(item => {
            const name1 = item.data.cost_with.toLocaleLowerCase().trim()
            const name2 = filter.toLocaleLowerCase().trim()

            if (name1.indexOf(name2) !== -1) {
                return item
            }
        })

        setFiltered(newList)
    }, [filter])

    useEffect(() => {
        if (filter === "") {
            setFiltered([])
            setFormValue(fields)
            setCheckbox(false)
            setDropdown('')
        }
    }, [filter])

    useEffect(() => {
        setIsSubmit(onSave)

    }, [onSave])

    return (
        <main>
            <h1>Gerenciar Custo</h1>
            <div className={styles.content_container}>
                <form className={styles.container} onSubmit={formSubmit}>
                    <div>
                        <Input
                            type="text"
                            label="Custo com"
                            name='cost_with'
                            placeholder="EX: aluguel, luz, combustível..."
                            style={custom_style}
                            value={formValue.cost_with}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            label="Valor"
                            name='cost_value'
                            placeholder="R$ 00,00"
                            style={custom_style}
                            value={formValue.cost_value}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={styles.checkbox}>
                            <span className={styles.check_title}>Ativo</span>
                            <div className={styles.check_input}>
                                <input
                                    type='checkbox'
                                    name='cost_active'
                                    checked={checkbox}
                                    value={`${formValue.cost_active}`}
                                    onChange={checkboxChange}
                                />
                                <span>{checkbox ? <FaCheck size={20} /> : ''}</span>
                            </div>
                        </label>
                    </div>
                    <div>
                        <div className={styles.dropdown}>

                            <label className={styles.dropdown_input}>
                                <span>Categoria</span>
                                <div className={styles.dropdown_input_container} >
                                    <input
                                        type='text'
                                        name='cost_categoy'
                                        placeholder={'Selecione uma opção...'}
                                        value={dropdown}
                                        className={styles.input_dropdown}
                                        onChange={handleChange}
                                        onClick={handleShowOptions}
                                    />
                                    <button type='button' onClick={handleClean} className={styles.dropdown_clean}>
                                        <FaX />
                                    </button>
                                </div>
                            </label>

                            <ul className={styles.options}>
                                {dropdownShowOptions && selectionList?.map((content) => (<li key={content} onClick={() => setInputData(content)}>
                                    <span>{content}</span>
                                </li>))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <Input
                            type='date'
                            label='Data'
                            name='cost_month'
                            style={custom_style}
                            value={formValue.cost_month}
                            onChange={handleChange}
                        />
                    </div>

                    {
                        !isSubmit ? (<button type='submit' className={styles.confirm_btn}>{formValue.id ? 'Atualizar' : 'Confirmar'}</button>) : (<div className="loader"></div>)
                    }
                </form>
                <section className={styles.table_container}>

                    <div className={styles.table_filter}>
                        <input
                            type='text'
                            placeholder='Buscar por...'
                            value={filter.trim()}
                            onChange={(e) => handleFilter(e.target.value)}
                        />
                    </div>
                    <div className={styles.table_header}>
                        <div className={styles.header_content}>
                            <span>Custo com</span>
                            <span>Valor</span>
                            <span>Categoria</span>
                            <span>Data</span>
                            <span>Ativo</span>
                        </div>
                        <div className={styles.header_untitle}>
                            <span>---</span>
                            <span>---</span>
                        </div>
                    </div>
                    <ul className={styles.table}>
                        {
                            filterd.length === 0 ? table.map((doc) => (
                                <li key={doc.docId}>
                                    <div className={styles.li_content}>
                                        <span>{doc.data.cost_with}</span>
                                        <span>{doc.data.cost_value}</span>
                                        <span>{doc.data.cost_categoy}</span>
                                        <span>{doc.data.cost_month}</span>
                                        <span>{doc.data.cost_active ? 'Sim' : 'Não'}</span>
                                    </div>
                                    <div className={styles.li_actions}>
                                        <button className={styles.edit} onClick={() => handleBtnActionsEdit(doc.docId + 1)}>Editar</button>
                                        <button className={styles.trash} onClick={() => handleBtnActionsDelete(doc.docId + 2)}>Excluir</button>
                                    </div>
                                </li>
                            )) : filterd.map((doc) => (
                                <li key={doc.docId}>
                                    <div className={styles.li_content}>
                                        <span>{doc.data.cost_with}</span>
                                        <span>{doc.data.cost_value}</span>
                                        <span>{doc.data.cost_categoy}</span>
                                        <span>{doc.data.cost_month}</span>
                                        <span>{doc.data.cost_active ? 'Sim' : 'Não'}</span>
                                    </div>
                                    <div className={styles.li_actions}>
                                        <button className={styles.edit} onClick={() => handleBtnActionsEdit(doc.docId + 1)}>Editar</button>
                                        <button className={styles.trash} onClick={() => handleBtnActionsDelete(doc.docId + 2)}>Excluir</button>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </section>
            </div>
        </main>
    )
}

export default Cost




