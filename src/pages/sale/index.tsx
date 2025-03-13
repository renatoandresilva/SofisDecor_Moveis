import { FormEvent, useState, useEffect } from "react"
import { HiPencilSquare } from "react-icons/hi2"
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { useLocation, useNavigate } from "react-router-dom"

import { db } from "../../service/dataConnection"

import Input from "../../components/Input/Input"

import styles from "./Sale.module.css";
import '../../App.css'
// Interfaces and Types
import { ISale, PaymentInfo, CurrentProduct } from "../../interfaces/ISale/ISale";
import { IFirestore } from "../../interfaces/IUtilis/IUtilitis";
import Dropdown from "../../components/dropdown/Dropdown"

const Sale = () => {
  const [loading, setLoading] = useState(false)
  const [onSave, setOnsave] = useState(false)

  const [nameProduct, setNameProduct] = useState<string>('');
  const [priceProduct, setPriceProduct] = useState<number>(0);
  const [qtdInstallment, setQtyInstallment] = useState<number>(0);
  const [valueInstallment, setValueInstallment] = useState<number>(0);
  const [dueDate, setDueDate] = useState<number>(0);
  const [purchcaseDate, setPurchcaseDate] = useState<string>('');
  const [initVlue, setInitValue] = useState<number>(0);

  const [numberInstallmentPaid, setNumberInstallmentPaid] = useState<number>(0);
  const [valueInstallmentPaid, setValueInstallmentPaid] = useState<number>(0);
  const [nameClient, setNameClient] = useState<string>('');

  const [updateProductdByiIndex, setUpdateProductByiIndex] = useState<number>(-1);
  const [updatePaymentdByiIndex, setUpdatePaymentByiIndex] = useState<number>(-1);
  const [saleId, setSaleId] = useState<string>('');

  const [currentProducts, setCurrentProducts] = useState<CurrentProduct[]>([]);
  const [paymentList, setPaymentList] = useState<PaymentInfo[]>([]);
  const [clientList, setClientList] = useState<string[]>([]);

  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const [refreshPayments, setRefreshPayments] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  let index: number = 0;

  const saleData: ISale = {
    products: currentProducts,
    purchcaseDate: purchcaseDate,
    initVlue: initVlue,
    qtdInstallment: qtdInstallment,
    valueInstallment: valueInstallment,
    dueDate: dueDate,
    paymentInfo: paymentList,
    docClientId: '',
    clientName: `${nameClient}`.trim()
  }

  // handles functions 
  const handleSale = async (e: FormEvent) => {
    e.preventDefault();
    setOnsave(true);

    if (location.state === null) {

      setLoading(true);
      try {

        const data = collection(db, "client")
        const queryRef = query(data, where("clientName", "==", saleData.clientName))

        const querySnapshot = await getDocs(queryRef)
        querySnapshot.forEach(doc => {
          saleData.docClientId = doc.id
          setNameClient(doc.data().clientName)
        })

        const newDoc = collection(db, "sale")
        await addDoc(newDoc, saleData)
          .then(res => {

            if (res.id !== "") {
              alert("Ação executada com sucesso!")

              setOnsave(false)
              navigate('/')
              return
            }

            alert("Ação executada com sucesso!.")
          })
      } catch (error) {
        alert("Falha ao executar essa ação: " + error)
      }
    } else {
      const currDoc = doc(db, `${location.state.collectionName}`, saleId);

      const data = collection(db, "client")
      const queryRef = query(data, where("clientName", "==", saleData.clientName))

      const querySnapshot = await getDocs(queryRef)
      querySnapshot.forEach(doc => {
        saleData.docClientId = doc.id
      })

      await updateDoc(currDoc, { ...saleData })
      alert("Dados atualizado com sucesso!")
      setLoading(false);
      navigate('/')
    }
  }

  const handleAddProduct = () => {

    if (nameProduct === "" || priceProduct === 0) return alert('Preencha os campos obrigatórios')

    const currentProduct: CurrentProduct = {
      prod: nameProduct,
      price: priceProduct
    }

    if (updateProductdByiIndex === -1 && updatePaymentdByiIndex) {
      setCurrentProducts(current => [...current, currentProduct])
      setNameProduct('')
      setPriceProduct(0)
      return
    }

    if (updateProductdByiIndex !== -1) {

      currentProducts[updateProductdByiIndex].prod = nameProduct
      currentProducts[updateProductdByiIndex].price = priceProduct

      setRefreshProducts(false)
    }
  }

  const handleSetPaymentList = () => {

    if (numberInstallmentPaid === 0 || valueInstallmentPaid === 0) return

    const newInfo: PaymentInfo = {
      paymentDate: getDate(),
      numberInstallment: numberInstallmentPaid,
      valuePaid: valueInstallmentPaid
    }

    if (updatePaymentdByiIndex === -1) {
      setPaymentList(item => [...item, newInfo])

      setNumberInstallmentPaid(0)
      setValueInstallmentPaid(0)
      return
    }

    if (updatePaymentdByiIndex !== -1) {
      paymentList[updatePaymentdByiIndex].numberInstallment = numberInstallmentPaid
      paymentList[updatePaymentdByiIndex].valuePaid = valueInstallmentPaid

      setRefreshPayments(false)
    }
  }

  const handleSetProductField = (ind: number) => {
    index = ind
    setRefreshProducts(true)
  }

  const handleSetPaymentField = (ind: number) => {

    index = ind
    setRefreshPayments(true)
  }

  const handlDelete = async () => {

    console.log('estou no delete');


    const confirmAction = confirm('Está ação não poderá  ser desfeita. Tem certeza disso?')

    if (confirmAction) {

      const saletRefDoc = doc(db, `${location.state.collectionName}`, saleId)

      await deleteDoc(saletRefDoc)

      navigate('/')
    }

    return
  }

  const handleAddSelectClient = (client: string) => {
    console.log(client);

    setNameClient(client)
  }
  // Functions
  function getDate(): string {

    const date = new Date()

    const currDay = date.getDate()
    const currMonth = date.getMonth() + 1
    const currYear = date.getFullYear()

    return `${currDay < 10 ? "0" + currDay : currDay}/${currMonth < 10 ? "0" + currMonth : currMonth}/${currYear}`
  }

  async function getDatefromDatabse(databse: IFirestore, collectionName: string, attr: string): Promise<string[]> {
    console.log('estou na função')
    let list: string[] = []

    console.log(collection(databse, collectionName));


    const dataQuery = query(collection(databse, collectionName), where(attr.trim(), "!=", ""))
    const dataSnap = await getDocs(dataQuery)

    dataSnap.forEach(snap => {

      list.push(snap.data().clientName);
    });

    return list
  }

  // UseEffects
  useEffect(() => {
    const getList = getDatefromDatabse(db, "client", "clientName")

    getList.then(resp => {
      setClientList(resp)
    })

    if (location.state !== null) {

      const saleRef = collection(db, `${location.state.collectionName}`)
      const q = query(saleRef, where("clientName", "==", `${location.state.search}`))

      getDocs(q)
        .then(Response => {
          Response.docs.forEach(doc => {
            setSaleId(doc.id)
            setCurrentProducts(doc.data().products)
            setPurchcaseDate(doc.data().purchcaseDate)
            setInitValue(doc.data().initVlue)
            setQtyInstallment(doc.data().qtdInstallment)
            setValueInstallment(doc.data().valueInstallment)
            setDueDate(doc.data().dueDate)
            setPaymentList(doc.data().paymentInfo)
            setNameClient(doc.data().clientName)
          });
        })
    }

  }, [])

  useEffect(() => {

    if (refreshProducts) {
      const fild = currentProducts[index]

      setNameProduct(fild.prod)
      setPriceProduct(fild.price)
      setUpdateProductByiIndex(index)
    }

  }, [refreshProducts])

  useEffect(() => {
    if (refreshPayments) {
      const fild = paymentList[index]

      setNumberInstallmentPaid(fild.numberInstallment)
      setValueInstallmentPaid(fild.valuePaid)
      setUpdatePaymentByiIndex(index)
    }
  }, [refreshPayments])

  useEffect(() => {
    onSave ? setLoading(true) : setLoading(false)
  }, [onSave])

  return (
    <div>
      <h1>Informações de Vendas</h1>
      <div className={styles.actions}>
        <button onClick={handlDelete}>Deletar</button>
      </div>
      <form className={styles.form} onSubmit={handleSale}>
        <fieldset className={styles.fild_1}>
          <legend>Dados da venda:</legend>
          <div>
            <Input
              type='text'
              placeholder='Nome do produto...'
              value={nameProduct}
              onChange={(e) => setNameProduct(e.target.value)}
              label="Produto:"
            />
          </div>
          <div>
            <Input
              type='number'
              label="Preço:"
              placeholder='Valor do produto...'
              value={priceProduct}
              onChange={(e) => setPriceProduct(Number(e.target.value))}
            />
          </div>
          <div>
            <button type="button" className={styles.button} onClick={handleAddProduct}>
              adicionar
            </button>
          </div>
        </fieldset>
        <hr></hr>
        <fieldset className={styles.fild_2}>
          <legend>Dados de parcelamento:</legend>
          <div>
            <Input
              type='number'
              label='Entrada'
              value={initVlue}
              onChange={(e) => setInitValue(Number(e.target.value))}
            />
          </div>
          <div>
            <Input
              type='number'
              label='Vencimento'
              value={dueDate}
              onChange={(e) => setDueDate(Number(e.target.value))}
            />
          </div>
          <div>
            <Input
              type='number'
              label="Valor da parcela:"
              value={valueInstallment}
              onChange={(e) => setValueInstallment(Number(e.target.value))}
            />
          </div>
          <div>
            <Input
              type='number'
              label="Parcelado em:"
              value={qtdInstallment}
              onChange={(e) => setQtyInstallment(Number(e.target.value))}
            />
          </div>
          <div>
            <Input
              type='date'
              label='Data da Compra'
              value={purchcaseDate}
              onChange={(e) => setPurchcaseDate(e.target.value)}
            />
          </div>
          <div>
            <Dropdown contents={clientList} label="Cliente" change={handleAddSelectClient} update={nameClient} />
          </div>
        </fieldset>
        <hr></hr>
        {location.state !== null ? (
          <fieldset>
            <legend>Dados do pagamento:</legend>
            <div>
              <Input
                type='number'
                label='Parcela de número:'
                value={numberInstallmentPaid}
                onChange={(e) => setNumberInstallmentPaid(Number(e.target.value))}
              />
            </div>
            <div>
              <Input
                type='number'
                label='Valor Pago:'
                value={valueInstallmentPaid}
                onChange={(e) => setValueInstallmentPaid(Number(e.target.value))}
              />
            </div>
            <button type="button" id="button" className={styles.button} onClick={handleSetPaymentList}>
              Inserir pagamento
            </button>

          </fieldset>
        ) : ("")
        }
        {
          !loading ? (<button type='submit' className={!loading ? styles.active_btn : styles.cancel_btn}>
            {!loading ? "Confirmar" : "Salvando dados..."}
          </button>) : (
            (<div className="loader"></div>)
          )
        }
      </form>
      <section className={styles.list}>
        <h4>Produtos</h4>
        <ul className={styles.list_container1}>
          {
            (currentProducts.length > 0) && (currentProducts.map((item, i) => (
              <li key={i}>
                <span>{item.prod}.............{item.price}</span>
                <button className={styles.setItem_btn} onClick={() => handleSetProductField(i)}><HiPencilSquare color="blue" size="30px" /></button>
              </li>
            )))
          }
        </ul>
        <h4>Lista de Parcelas Pagas</h4>
        <ul className={styles.list_container1}>
          {
            (paymentList.length > 0) && (paymentList.map((item, i) => (
              <li key={i}>
                <span>{item.numberInstallment}.............{item.valuePaid}</span>
                <button className={styles.setItem_btn} onClick={() => handleSetPaymentField(i)}><HiPencilSquare color="blue" size="30px" /></button>
              </li>
            )))
          }
        </ul>
      </section>
    </div>
  )
}

export default Sale 