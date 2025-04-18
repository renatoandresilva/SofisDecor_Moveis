import { FormEvent, useEffect, useState } from "react"

import { collection, getDocs, query, where, } from "firebase/firestore";
import { db } from "../../service/dataConnection";
import { addDocFnc, updateDocFunc, uniqueItemList, getCurrentMonthAndYear } from "../../interfaces/IUtilis/IUtilitis";

import { EssentiolStruc, entriesStruc, Debtors, mainView, Cost_MainStruc, Balance, ListCost, ShowCostResult } from './homeSettings'
import { PaymentInfo } from "../sale/saleSettings";

// Components
import Input from "../../components/Input/Input";
// Styles
import styles from './Home.module.css'
import { custom_style } from '../../interfaces/custom_styles/genral'

const Home = () => {

  const [showResult, setShowResult] = useState<mainView>({})
  const [isReload, setIsReload] = useState(false)
  const [length, setLength] = useState(0)
  const [costTotal, setCostTotal] = useState<Cost_MainStruc>()
  const [debtors, setDebtors] = useState<Debtors>()
  const [bank, setBank] = useState('')
  const [value, setValue] = useState(0)
  const [owner, setOwner] = useState('')
  const [showFormBalance, setShowFormBalance] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [id, setId] = useState('')
  const [listBalance, setListBalance] = useState<Balance[]>([])
  const [listInstallmentsMonth, setListInstallmentsMonth] = useState<PaymentInfo[]>([])
  const [mainDataView, setMainDataView] = useState<mainView>({})
  const [mainDataViewFiltered, setMainDataViewFiltered] = useState<EssentiolStruc[]>([])
  const [costData, setCostData] = useState<Cost_MainStruc>()
  const [saleData, setSaleData] = useState<entriesStruc>()
  const [calcEntries, setCalcEntries] = useState(0)
  const [calcInstallments, setCalcInstallments] = useState(0)
  const [costResult, setCostResult] = useState<ShowCostResult>()



  useEffect(() => {

    sale()
    cost()
    getBalanceData()
  }, [])

  useEffect(() => {
    setMainDataView({ entries: saleData, costs: costData })
  }, [costData, saleData])

  useEffect(() => {

    setSaleResult()

  }, [mainDataView])

  useEffect(() => {
    calc()
    getDebtors()
  }, [listInstallmentsMonth, mainDataViewFiltered])
  // Functions
  const sale = async () => {

    try {

      const saleRef = collection(db, 'sale')
      const querySnap = await getDocs(saleRef)

      const dataRef: entriesStruc = {
        id: saleRef.id,
        length: querySnap.size,
        mainData: []
      }

      querySnap.docs.forEach(item => {

        const currObj: EssentiolStruc = {
          clientName: item.data().clientName,
          initValue: item.data().initValue,
          installmentList: item.data().paymentInfoList,
          purchcaseDate: item.data().purchcaseDate
        }

        dataRef.mainData.push(currObj)
      })

      setSaleData(dataRef)

    } catch (error) {
      console.error('Houve um  no carreganento dos dados. Erro: ' + error);

    }
  }

  const cost = async () => {
    try {

      const strucCost: Cost_MainStruc = {
        monthlyCost: 0,
        totalCost: 0,
        costs_fix: [],
        costs_variable: [],
      }

      const saleRef = collection(db, 'cost')
      const costRef = query(saleRef, where('cost_active', '==', true))
      const querySnapshot = await getDocs(costRef);

      querySnapshot.forEach((doc) => {

        strucCost.totalCost! += Number(doc.data().cost_value)

        if (getCurrentMonthAndYear(doc.data().cost_month).result) {
          strucCost.monthlyCost! += Number(doc.data().cost_value)

          if (doc.data().cost_categoy === 'Fixo Indeterminado' || doc.data().cost_categoy === 'Fixo Detrminado') {

            const obj: ListCost = {

              destination: doc.data().cost_with,
              value: doc.data().cost_value,
              date: doc.data().cost_month,
              active: doc.data().cost_active
            }

            strucCost.costs_fix.push(obj)
          } else {

            const obj: ListCost = {

              destination: doc.data().cost_with,
              value: doc.data().cost_value,
              date: doc.data().cost_month,
              active: doc.data().cost_active
            }
            strucCost.costs_variable.push(obj)
          }
        }

      });

      setCostData(strucCost)
    } catch (error) {
      console.log('Não foi possível  carregar os dados: ' + console.error());
    }
  }

  const handleSetBalance = async (num: number) => {
    try {

      setBank('')
      setValue(0)
      setOwner('')
      setId('')

      const obj = listBalance[num - 1]

      setBank(obj.bank)
      setValue(obj.value)
      setOwner(obj.owner)
      setId(num.toString())
      setIsUpdate(true)
    } catch (error) {
      console.log(error);

    }
  }

  const handleSubmitBalance = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const balanceObjs: Balance = {
        bank: bank,
        value: value,
        owner: owner
      }

      if (!isUpdate) {
        addDocFnc(db, 'balance', balanceObjs)
        setShowFormBalance(false)
        return
      }
      updateDocFunc(db, 'balance', id, balanceObjs)
      setBank('')
      setValue(0)
      setOwner('')
      setId('')
      setIsUpdate(false)
    } catch (error) {
      console.log(error);
    }
  }

  const openFormBalance = () => {
    setBank('')
    setValue(0)
    setOwner('')
    const open = showFormBalance ? false : true

    setShowFormBalance(open)
  }

  // Functions
  async function getBalanceData() {
    const docsRef = getDocs(collection(db, 'balance'))

    docsRef.then(item => {
      item.docs.forEach(el => {
        const obj: Balance = {
          bank: el.data().bank,
          value: el.data().value,
          owner: el.data().Owner,
          id: el.data().id,
        }

        setListBalance(item => [...item, obj])
      })
    })

    setListBalance([])

    const unique = [...new Set(listBalance)]

    setListBalance(unique)
  }
  async function setSaleResult() {
    try {

      const mainDataViewFiltered: EssentiolStruc[] = []
      // Select entreies of current month
      mainDataView.entries?.mainData.forEach(element => {
        if (getCurrentMonthAndYear(element.purchcaseDate).result) {
          mainDataViewFiltered.push(element)
        }

      });
      const uniqueMainDataViewFiltered = uniqueItemList(mainDataViewFiltered) as EssentiolStruc[]
      setMainDataViewFiltered(uniqueMainDataViewFiltered);

      // Select installments ofthe  current month
      const installmentList: PaymentInfo[] = []
      mainDataView.entries?.mainData.forEach(item => {
        item.installmentList.forEach(el => {
          if (getCurrentMonthAndYear(el.paymentDate).result) {
            installmentList.push(el)
          }
        })
      })
      const uniqueInstallmentListItem = uniqueItemList(installmentList) as PaymentInfo[]
      setListInstallmentsMonth(uniqueInstallmentListItem)

      // Cost
      const listcost: ShowCostResult = {
        totalFix: 0,
        totalVariable: 0,
        monthlyCost: 0,
        totalCost: 0,
      }

      mainDataView.costs?.costs_fix.forEach(item => {
        if (item.active) {

          listcost.totalFix += Number(item.value)
        }
      })

      mainDataView.costs?.costs_variable.forEach(item => {
        if (item.active) {

          listcost.totalVariable += Number(item.value)
        }
      })

      listcost.totalCost = mainDataView.costs?.totalCost!
      listcost.monthlyCost = mainDataView.costs?.monthlyCost!

      setCostResult(listcost)

    } catch (e) {
      console.error(`Data not fetch yet: ${e}`)
    }
  }

  function calc() {

    listInstallmentsMonth.forEach(element => {
      setCalcInstallments(item => Number(item) + Number(element.installment!))
    });

    mainDataViewFiltered.forEach(element => {
      setCalcEntries(item => Number(item) + Number(element.initValue!))
    });

  }

  async function getDebtors() {

    try {

      const debts: Debtors = {
        debtorsList: [],
        debtsValue: 0,
      }

      mainDataView.entries?.mainData.forEach(item => {

        item.installmentList.forEach(el => {

          const arrDate = el.paymentDate.split('-')
          const [year, month,] = arrDate

          if ((Number(month) && Number(year) <= (getCurrentMonthAndYear(el.paymentDate).year && getCurrentMonthAndYear(el.paymentDate).month))) {

            debts.debtorsList.push(el)
            debts.debtsValue += Number(el.installment!)
          }
        })
      })

      setDebtors(debts)

    } catch (error) {
      console.error('Loading Data...');
    }

  }

  return (
    <main className={styles.container}>
      <h1>Balanço das Atividades</h1>
      <section className={styles.balance}>
        <h3 className={styles.balance_title}>Saldo em Caixa</h3>
        <div>
          <h4>
            <span>Banco</span>
            <span>Responsável</span>
            <span onClick={() => openFormBalance()} className={styles.set_balance}>Saldo</span>
          </h4>
          <ul>
            {
              listBalance.length > 0 && listBalance.map((item, index) => (<li key={index} >
                <span>{item.bank}</span>
                <span>{item.owner}</span>
                <span onClick={() => handleSetBalance(Number(item.id))} className={styles.set_balance}>{`R$${item.value},00`}</span>
              </li>
              ))
            }
          </ul>
        </div>
        {
          showFormBalance && (<form className={styles.form_balance} onSubmit={handleSubmitBalance}>
            <div>
              <Input
                type="text"
                label="Banco"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                style={custom_style}
              />
            </div>
            <div>
              <Input
                type="number"
                label="Valor"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                style={custom_style}
              />
            </div>
            <div>
              <Input
                type="text"
                label="Responsável"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                style={custom_style}
              />
            </div>
            <div>
              <button>Confirmar</button>
            </div>
          </form>)
        }
      </section>
      <section className={styles.main}>
        <div className={styles.list1_wrapper}>
          <h3>Atividades de Entrada e Saída</h3>
          <ul className={styles.list1}>
            <li>
              <span>Total de vendas</span>
              <span>{mainDataView.entries?.length}</span>
            </li>
            <li>
              <span>Entradas Recebidas /mês</span>
              <span>R${calcEntries},00</span>
            </li>
            <li>
              <span>Parcelas a Receber /mês</span>
              <span>R${calcInstallments},00</span>
            </li>
            <li>
              <span>Total de Gastos</span>
              <span>R${costResult?.totalCost},00</span>
            </li>
            <li>
              <span>Gastos Mensal</span>
              <span>R${costResult?.monthlyCost},00</span>
            </li>
            <li>
              <span>Gastos Fixos</span>
              <span>R${costResult?.totalFix},00</span>
            </li>
            <li>
              <span>Gastos Variados</span>
              <span>R${costResult?.totalVariable},00</span>
            </li>
            <li>
              <span>Clientes em atraso</span>
              <span>R${debtors?.debtsValue},00</span>
            </li>
          </ul>
        </div>
        <div className={styles.list2}>
          <div>
            <h3>Clientes em Atraso</h3>
            <div className={styles.header}>
              <span>Cliente</span>
              <span>Parcela(s)</span>
              <span>Valor</span>
            </div>
          </div>
          <ul className={styles.debtors}>
            {
              debtors && debtors!.debtorsList.map((item, index) => (
                <li key={index}>
                  <span>{item.client}</span>
                  <span>{item.numberInstallment}</span>
                  <span>R${item.valuePaid},00</span>
                </li>
              ))
            }
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Home

