import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './SaleDateil.module.css'

import { custom_style } from "../../interfaces/custom_styles/genral"
import { SaleStruc } from '../sale/saleSettings'
import { listStruc } from './detailSettings'

import { db } from '../../service/dataConnection'
import { collection, getDocs } from 'firebase/firestore'
import Input from '../../components/Input/Input'

const SaleList = () => {

    const [data, setData] = useState<listStruc[]>([])
    const [dataFiltered, setDataFiltered] = useState<listStruc[]>([])
    const [filter, setFilter] = useState('')

    // Functions
    async function getSaleList() {

        try {
            const docListRef = await getDocs(collection(db, 'sale'))

            docListRef.docs.forEach(item => {

                const strucStruct: SaleStruc = {
                    products: item.data().products,
                    initValue: item.data().initValue,
                    purchcaseDate: item.data().purchcaseDate,
                    qtdInstallment: item.data().qtdInstallment,
                    valueInstallment: item.data().valueInstallment,
                    dueDate: item.data().dueDate,
                    paymentInfoList: item.data().paymentInfo,
                    clientName: item.data().clientName,
                    paymentAccount: item.data().paymentAccount
                }

                const sales: listStruc = {
                    id: item.id,
                    sales: strucStruct
                }

                setData(item => [...item, sales])
            })

        } catch (error) {
            console.log(error)
        }
    }

    // Use Effect
    useEffect(() => {
        getSaleList()
    }, [])

    useEffect(() => {

        const filtered = data.filter(el => {
            const a = el.sales.clientName.toLocaleLowerCase().trim()
            const b = filter.toLocaleLowerCase().trim()

            if (a.indexOf(b) !== -1) {
                return el
            }
        })

        setDataFiltered([])
        const unique = [...new Set(filtered)]

        setDataFiltered(unique)

    }, [filter])

    return (
        <div className={styles.container}>
            <h1>Lista de Clientes</h1>
            <div className={styles.action_link}>
                <Link to='/sale/0' className={styles._link}>Cadastrar</Link>
            </div>
            <div className={styles.filter}>
                <div>
                    <Input
                        type='text'
                        placeholder='Buscar por...'
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={custom_style}
                        className={styles.new_style}
                    />
                </div>
            </div>
            <div className={styles.table_container}>
                <table className={styles.table}>
                    <thead className={styles.header}>
                        <tr>
                            <th>Cliente</th>
                            <th>Entrada</th>
                            <th>Valor Parcela</th>
                            <th>Qtd Parcela</th>
                            <th>Vencimento</th>
                            <th>Data</th>
                            <th>Pix</th>
                        </tr>
                    </thead>
                    <tbody className={styles.body}>
                        {
                            dataFiltered.length > 0 ? dataFiltered.map((item) => (<tr key={item.id}>
                                <td><Link to={`/sale/${item.id}`}> {item.sales.clientName}</Link></td>
                                <td>{`R$${item.sales.initValue},00`}</td>
                                <td>{item.sales.valueInstallment}</td>
                                <td>{item.sales.qtdInstallment}</td>
                                <td>{item.sales.dueDate}</td>
                                <td>{item.sales.purchcaseDate}</td>
                                <td>{item.sales.paymentAccount}</td>
                            </tr>)) : data.length > 0 && data.map((item, index) => (<tr key={index}>
                                <td><Link to={`/sale/${item.id}`}> {item.sales.clientName}</Link></td>
                                <td>{`R$${item.sales.initValue},00`}</td>
                                <td>{item.sales.valueInstallment}</td>
                                <td>{item.sales.qtdInstallment}</td>
                                <td>{item.sales.dueDate}</td>
                                <td>{item.sales.purchcaseDate}</td>
                                <td>{item.sales.paymentAccount}</td>
                            </tr>))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SaleList