import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, where, query, doc } from 'firebase/firestore';

import { db } from '../../service/dataConnection';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/select/Select';

// Styles
import styles from './Home.module.css'
import { CSSProperties } from 'react';

//Interface
import { IClientePprops } from '../../interfaces/iClient/IClinet';

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

  const [selected, setSelected] = useState('');
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<boolean>(false)

  const navigate = useNavigate();

  // Handles Functions
  const handleGetDate = async (e: FormEvent) => {
    e.preventDefault();

    if (selected === '' || input === '') return alert('Preencha todos os campos.');

    const props: IClientePprops = {
      isGetDoc: true,
      id: "",
      collectionName: getCollectionNameBySelectOption(selected, options, collectionName).toLowerCase(),
      search: input.trim()
    }

    try {
      const nameOfCollection = getCollectionNameBySelectOption(selected, options, collectionName)
      const collectionRef = collection(db, nameOfCollection)
      const queryRef = query(collectionRef, where("clientName", "==", input))
      const querySnapshot = await getDocs(queryRef)

      await querySnapshot.docs.forEach(doc => {
        props.id = doc.id
      })

      if (props.id !== '') {

        navigate(`/${props.collectionName}`, { state: props })
        return
      }

      setMsg(true)
    } catch (err) {

      console.log(err);
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
        <Select
          values={options}
          style={selectStyle}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Input
          placeholder='Busque por venda, clinte, produto, etc ....'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type='submit'>Buscar</button>
      </form>
      <section className={styles.msg}>
        {
          msg && (<p>Pesquisa não encontrada!</p>)
        }
      </section>
    </main>
  )
}

export default Home

