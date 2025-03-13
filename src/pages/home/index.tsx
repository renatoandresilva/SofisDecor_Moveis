import { FormEvent, useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, where, query } from 'firebase/firestore'

import { db } from '../../service/dataConnection';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/select/Select';

// Styles
import styles from './Home.module.css'
import { CSSProperties } from 'react';

//Interface
import { IClientePprops } from '../../interfaces/iClient/IClinet';

type Objt = {
  name?: string,
  id?: string,
}

const selectStyle: CSSProperties = {
  flex: "1 0 60%",
  height: "40px",
  width: "100%",
  padding: ".7rem 2em",
  border: ".8px solid #ccc",
  borderRadius: "6px",
}

const options: string[] = [
  'Cliente',
  'Venda',
  'Custo'
]

const collectionName: string[] = [
  'client',
  'sale',
  'cost'
]



const Home = () => {

  const [selected, setSelected] = useState('')
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState<boolean>(false)
  const [isGetting, setIsGetting] = useState(false)

  const [filterList, SetFilterList] = useState<Objt[]>([])

  const navigate = useNavigate();

  const handleInput = (str: string) => {
    setInput(str)
  }

  useEffect(() => {

  }, [input])
  // Handles Functions
  const handleGetDate = async (e: FormEvent) => {
    e.preventDefault()

    if (selected === '' || input === '') return

    try {
      const nameOfCollection = getCollectionNameBySelectOption(selected, options, collectionName)
      const collectionRef = collection(db, nameOfCollection)
      const queryRef = query(collectionRef, where("clientName", "==", input))
      const querySnapshot = await getDocs(queryRef)

      await querySnapshot.docs.forEach(doc => {
        const name = doc.data().clientName
        const id = doc.id
        const clientInfo = {
          id: id,
          name: name,
        }
        SetFilterList(names => [...names, clientInfo])
      })

      setMsg(true)
      setIsGetting(true)
    } catch (err) {

      console.log(err);
    }

  }

  const handleData = (id: string) => {
    const props: IClientePprops = {
      isGetDoc: true,
      id: id,
      collectionName: getCollectionNameBySelectOption(selected, options, collectionName).toLowerCase(),
      search: input.trim()
    }

    if (props.id !== '') {

      navigate(`/${props.collectionName}`, { state: props })
      return
    }

  }


  // Functions
  function getCollectionNameBySelectOption(optionName: string, options: string[], collectionsName: string[]): string {

    return collectionsName[options.indexOf(optionName)]
  }

  return (
    <main className={styles.container}>
      <h1>Buscar informação</h1>
      < form className={styles.form} onSubmit={handleGetDate}>
        <div>
          <Select
            values={options}
            placeholder='Buscar por cliente, venda, custo, ...'
            style={selectStyle}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder='Busque por venda, clinte, produto, etc ....'
            value={input}
            onChange={(e) => handleInput(e.target.value)}
          />
          <button type='submit'>Buscar</button>
        </div>
      </form>
      <section className={styles.msg}>
        {
          !msg && isGetting ? (<p>Pesquisa não encontrada!</p>) : (<ul className={styles.filterList}>
            {
              filterList.map(item => (<li key={item.id}><span>{item.name}</span> <button onClick={() => handleData(item.id!)}><BiEdit color='white' size={18} /></button></li>))
            }
          </ul>)
        }
      </section>
    </main>
  )
}

export default Home

