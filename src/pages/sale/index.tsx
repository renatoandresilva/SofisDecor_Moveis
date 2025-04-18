import { FormEvent, useState, useEffect, ChangeEvent } from "react"
import { FaCheck } from "react-icons/fa6"

import { FaX } from 'react-icons/fa6'
import { collection, getDocs } from "firebase/firestore"
import { useLocation, useNavigate } from "react-router-dom"

import { db } from "../../service/dataConnection"
import {
  addDocFnc,
  updateDocFunc,
  deleteFunc,
  getDocFnc,
  uniqueItemList
} from "../../interfaces/IUtilis/IUtilitis"

import Input from "../../components/Input/Input"

import styles from "./Sale.module.css";
import { custom_style } from "../../interfaces/custom_styles/genral"
import '../../App.css'
// Interfaces and Types
import { PaymentInfo, Product, SaleStruc } from './saleSettings'

const saleForm: SaleStruc = {
  products: [],
  initValue: 0,
  purchcaseDate: "",
  qtdInstallment: 0,
  valueInstallment: 0,
  paymentAccount: '',
  dueDate: '',
  paymentInfoList: [],
  clientName: '',
}

const Sale = () => {

  const [loading, setLoading] = useState(false)
  const [onSave, setOnsave] = useState(false)
  const [dropdownShowOptions, setDropdownShowOptions] = useState(false)
  const [dropdownBalanceOptions, setDropdownBalanceOptions] = useState(false)
  const [product, setProduct] = useState('')
  const [price, setPrice] = useState(0)
  const [checkbox, setCheckbox] = useState(false)
  const [valuePaid, setValuePaid] = useState(0)
  const [isPaid, setIsPaid] = useState(false)
  const [calcCurrProduct, setCalcCurrProduct] = useState(0)
  const [isUpadate, setIsUpdate] = useState(false)
  const [id, setId] = useState('')

  const [formInput, setFormInput] = useState<SaleStruc>(saleForm)

  const [currentProducts, setCurrentProducts] = useState<Product[]>([])
  const [paymentList, setPaymentList] = useState<PaymentInfo[]>([])
  const [paymentIndex, setPaymentIndex] = useState("")
  const [clientList, setClientList] = useState<string[]>([])
  const [balance, setBalance] = useState<string[]>([])

  const location = useLocation()
  const navigate = useNavigate()

  if (clientList.length === 0) {

    getClients()
    getBalance()
  }

  if (id !== '' && isUpadate) {

    if (id !== '0') {

      getSaleById()
      setIsUpdate(false)
    }

  }

  // handles functions 
  const handleSale = async (e: FormEvent) => {
    e.preventDefault();
    setOnsave(true);

    try {

      if (id === '0') {

        const paymentInfoList = createInstalments(formInput.qtdInstallment, formInput.purchcaseDate)

        formInput.products = currentProducts

        paymentInfoList.forEach((date, index) => {

          const data: PaymentInfo = {
            numberInstallment: index + 1,
            paymentDate: date,
            valuePaid: 0,
            client: formInput.clientName,
            installment: formInput.valueInstallment,
            isPaid: false,
            rest: 0,
          }

          formInput.paymentInfoList.push(data)
        })

        await addDocFnc(db, 'sale', formInput)

        handleClean()
        setOnsave(false);
        navigate("/sale", { state: true })
        return
      }

      await updateDocFunc(db, 'sale', id, formInput)

      handleClean()
      setOnsave(false);
      navigate("/sale", { state: true })
    } catch (error) {
      console.log('Erro ao executar essa operação: ' + error);
    }
  }

  const handleFormChange = (e: FormEvent) => {

    const target = e.target as HTMLInputElement

    setFormInput({ ...formInput, [target.name]: target.value })
  }

  const handleAddProduct = () => {

    if (product === '' || price === 0) {
      return alert('Produto e Preço devem ser informados.')
    }

    const struct: Product = {
      product: '',
      price: 0
    }

    struct.product = product
    struct.price = price

    setCurrentProducts(item => [...item, struct])
    setCalcCurrProduct(item => item + struct.price)

    setProduct('')
    setPrice(0)
  }

  const handleShowOptions = () => {
    !dropdownShowOptions ? setDropdownShowOptions(true) : setDropdownShowOptions(false)
  }

  const handleBalanceOptions = () => {
    !dropdownBalanceOptions ? setDropdownBalanceOptions(true) : setDropdownBalanceOptions(false)
  }

  const handlDelete = async () => {

    if (confirm('Esta ação não poderá ser defeita. Tem certeza?')) {

      await deleteFunc(db, 'sale', id)
      handleClean()
      navigate("/")
    }

  }

  const handleClean = () => {

    const formCLeared: SaleStruc = {
      clientName: '',
      dueDate: '',
      initValue: 0,
      paymentAccount: '',
      products: [],
      valueInstallment: 0,
      paymentInfoList: [],
      purchcaseDate: '',
      qtdInstallment: 0,
    }

    setFormInput(formCLeared)
  }

  const getSaleList = () => {
    navigate('/sale')
  }

  const handleSetProductField = (index: number) => {
    const currProduct = currentProducts[index];

    setProduct(currProduct.product)
    setPrice(currProduct.price)
  }

  const handleSetPaymentField = (index: number) => {
    const currPayment = paymentList[index]

    setValuePaid(currPayment.valuePaid)
    setIsPaid(currPayment.isPaid!)

    setCheckbox(false)
    setPaymentIndex('')
    setPaymentIndex(index.toString())

  }

  const checkboxChange = (change: ChangeEvent) => {

    const target = change.target as HTMLInputElement
    setCheckbox(target.checked);
    target.name

    const data = formInput.paymentInfoList[Number(paymentIndex)]

    data.valuePaid = valuePaid
    data.isPaid = !checkbox ? true : false
  }

  // Functions
  function createInstalments(qtd: number, purchcaseDate: string) {

    const list = []

    // hendle purchcaseDate
    let date_stamp = purchcaseDate.split('-')

    const [year, month, date] = date_stamp

    let dateRef = new Date(Number(year), Number(month), Number(date))
    let counter = 0
    let counter1 = 0

    let updateYear = 0
    let index = 1

    while (index <= qtd) {
      index++

      if (dateRef.getMonth() + index <= 21) {

        counter = dateRef.getMonth() + index
        updateYear = dateRef.getFullYear()

      } else if (counter1 < 13) {

        counter1 = counter1 + 1
        counter = counter1
        updateYear = dateRef.getFullYear() + 1
      } else {

        throw new Error("Quantidade de parcelas não suportada");
      }

      const date = `${updateYear}-${counter}-${dateRef.getDate()}`

      date_stamp = date.split('-')
      list.push(date);
    }

    return list
  }

  async function getClients() {

    const clientRef = await getDocs(collection(db, 'client'))

    clientRef.docs.forEach(doc => {

      setClientList(item => [...item, doc.data().clientName])
    })
  }

  function setInputData(content: string) {

    setFormInput({ ...formInput, ['clientName']: content })
  }

  function setInputContent(content: string) {

    setFormInput({ ...formInput, ['paymentAccount']: content })
  }

  async function getBalance() {

    const balancetRef = await getDocs(collection(db, 'balance'))

    const list: string[] = []


    balancetRef.docs.forEach(doc => {
      list.push(doc.data().Owner)
    })

    const uniqueList = uniqueItemList(list) as string[]

    setBalance(uniqueList)
  }

  async function getSaleById() {

    try {
      const saleData = await getDocFnc(db, 'sale', id)

      const data = saleData as SaleStruc

      setFormInput(data)

    } catch (error) {
      console.error(error);
    }
  }

  // Use Effect
  useEffect(() => {

    const elementId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

    if (elementId) {
      setId(elementId)
      setIsUpdate(true)
    }
  }, [])

  useEffect(() => {

    if (formInput.products.length > 0) {

      setCurrentProducts(formInput.products)
      formInput.products.forEach(item => {
        setCalcCurrProduct(0)
        setCalcCurrProduct(num => num + item.price)
      })
    }

    if (formInput.paymentInfoList.length > 0) {

      setPaymentList(formInput.paymentInfoList)
    }

  }, [formInput])

  useEffect(() => {
    onSave ? setLoading(true) : setLoading(false)
  }, [onSave])

  return (
    <main className={styles.container}>
      <section className={styles.main_col_1}>
        <h1>Informações de Vendas</h1>
        <div className={styles.actions}>
          <button onClick={handlDelete}>Excluir</button>
          <button onClick={getSaleList}>Ver Lista</button>
        </div>
      </section>
      <section className={styles.main_col_2}>
        <form className={styles.form} onSubmit={handleSale}>
          <fieldset className={styles.fild_1}>
            <div>
              <Input
                type='text'
                placeholder='Nome do produto...'
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                label="Produto:"
                style={custom_style}
              />
            </div>
            <div>
              <Input
                type='number'
                label="Preço:"
                min={0}
                placeholder='Valor do produto...'
                value={price!}
                style={custom_style}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <button type="button" className={styles.button} onClick={handleAddProduct}>
                Inserir
              </button>
            </div>
          </fieldset>
          <fieldset className={styles.fild_2}>
            <div>
              <Input
                type='number'
                label='Entrada'
                name='initValue'
                min={0}
                value={formInput.initValue}
                style={custom_style}
                data-entry='initValue'
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Input
                type='number'
                label='Vencimento'
                name="dueDate"
                min={0}
                max={31}
                style={custom_style}
                value={formInput.dueDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Input
                type='number'
                label="Valor da parcela:"
                name="valueInstallment"
                min={0}
                value={formInput.valueInstallment}
                style={custom_style}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Input
                type='number'
                name='qtdInstallment'
                label="Qtd"
                min={0}
                max={30}
                value={formInput.qtdInstallment}
                style={custom_style}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Input
                type='date'
                name='purchcaseDate'
                label='Data da Compra'
                value={formInput.purchcaseDate}
                style={custom_style}
                onChange={handleFormChange}
              />
            </div>
            <div>

              <div className={styles.dropdown}>

                <label className={styles.dropdown_input}>
                  <span>cliente</span>
                  <div className={styles.dropdown_input_container} >
                    <input
                      type='text'
                      name='clientName'
                      placeholder={'Selecione uma opção...'}
                      value={formInput.clientName}
                      className={styles.input_dropdown}
                      onChange={handleFormChange}
                      onClick={handleShowOptions}
                    />
                    <button type='button' onClick={handleClean} className={styles.dropdown_clean}>
                      <FaX />
                    </button>
                  </div>
                </label>

                <ul className={styles.options}>
                  {dropdownShowOptions && clientList?.map((content, index) => (<li key={index} onClick={() => setInputData(content)}>
                    <span>{content}</span>
                  </li>))}
                </ul>
              </div>

            </div>
            <div>
              {/* Conta*/}
              <div className={styles.dropdown}>

                <label className={styles.dropdown_input}>
                  <span>Conta de Pagamento</span>
                  <div className={styles.dropdown_input_container} >
                    <input
                      type='text'
                      name='clientName'
                      placeholder={'Selecione uma opção...'}
                      value={formInput.paymentAccount}
                      className={styles.input_balance}
                      onChange={handleFormChange}
                      onClick={handleBalanceOptions}
                    />
                    <button type='button' onClick={handleClean} className={styles.dropdown_clean}>
                      <FaX />
                    </button>
                  </div>
                </label>

                <ul className={styles.options_balance}>
                  {dropdownBalanceOptions && balance?.map((content, index) => (<li key={index} onClick={() => setInputContent(content)}>
                    <span>{content}</span>
                  </li>))}
                </ul>
              </div>
            </div>

          </fieldset>
          {
            Number(id) !== 0 && (<fieldset className={styles.fild_3}>
              <legend>Dados de pagamento</legend>
              <div>
                <Input
                  type='number'
                  label='Valor Pago:'
                  style={custom_style}
                  value={valuePaid}
                  onChange={(e) => setValuePaid(Number(e.target.value))}
                />
              </div>
              <div>
                <label className={styles.checkbox}>
                  <span className={styles.check_title}>Ativo</span>
                  <div className={styles.check_input}>
                    <input
                      type='checkbox'
                      name='isPaid'
                      checked={isPaid}
                      value={`${checkbox}`}
                      onChange={checkboxChange}
                    />
                    <span>{checkbox ? <FaCheck size={20} /> : ''}</span>
                  </div>
                </label>
              </div>
            </fieldset>)
          }
          <div className={styles.submit}>
            {
              !loading ? (<button type='submit' className={!loading ? styles.active_btn : styles.cancel_btn}>
                {!loading ? "Confirmar" : "Salvando dados..."}
              </button>) : (
                (<div className="loader"></div>)
              )
            }
          </div>
        </form>
        <div className={(currentProducts.length > 0 || paymentList.length > 0) ? styles.list : styles.dispay_none}>
          <div className={styles.list_col1}>
            <h4>Lista de Produtos</h4>
            <ul className={styles.list_container1}>
              {
                (currentProducts.length > 0) && (currentProducts.map((item, i) => (
                  <li key={i} className={styles.product}>
                    <span>{item.product.padEnd(40, '.')} {`R$${item.price},00`}</span>
                    <div className={styles.actions_li}>
                      <span onClick={() => handleSetProductField(i)}>
                        {
                          id === '' ? 'Corrigir' : "Atualizar"
                        }
                      </span>
                    </div>
                  </li>
                )))
              }
            </ul>
            <div className={styles.calcCurrProduct}>
              <span>Total</span>
              <span>{`R$${calcCurrProduct},00`}</span>
            </div>
          </div>
          {
            (<div className={styles.list_col2}>
              <h4>Lista de Parcelas Pagas</h4>
              <div className={styles.payment_header}>
                <span>Vencimento</span>
                <span>Parcela</span>
                <span>Valor Pago</span>
                <span>Pago</span>
                <span></span>
              </div>
              <ul className={styles.list_container1}>
                {
                  paymentList.length > 0 && paymentList.map((item, index) => (
                    <li
                      key={index}
                      className={(item.isPaid) ? styles.mark_paid : ''}
                    >
                      <span>{item.paymentDate}</span>
                      <span>{item.numberInstallment}</span>
                      <span>{item.valuePaid}</span>
                      <span>{item.isPaid ? 'Sim' : 'Não'}</span>
                      <div>
                        <button className={styles.setItem_btn} onClick={() => handleSetPaymentField(index)}>Atualizar</button>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>)
          }
        </div>
      </section>
    </main>
  )
}

export default Sale 