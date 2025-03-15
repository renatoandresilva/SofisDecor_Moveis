import { CSSProperties, useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { db } from "../../service/dataConnection";
import {
  addDoc,
  collection, //cria uma coleção
  query,
  doc,
  deleteDoc,
  where,
  getDocs,
  updateDoc
} from 'firebase/firestore'

import styles from './Client.module.css'
import '../../App.css'
// Intefaces
import { IClientData } from '../../interfaces/iClient/IClinet';

// Components
import Input from '../../components/Input/Input'

const inputStyle_1: CSSProperties = {
  flex: "1 0 60%",
  height: "40px",
  padding: "0 10px",
  border: ".8px solid #ccc",
  borderRadius: "6px",
}

const inputStyle_2: CSSProperties = {
  flex: "1 0 30%",
  height: "40px",
  padding: "0 10px",
  border: ".8px solid #ccc",
  borderRadius: "6px",
}

const Client = () => {
  const [loading, setLoading] = useState(false)
  const [onSave, setOnsave] = useState(false)

  const [name, setName] = useState<string>('');
  const [wsp, setWsp] = useState<string>('');
  const [residence, setResidence] = useState('');
  const [zipcode, setZipcode] = useState<string>('')
  const [street, setStreet] = useState<string>('')
  const [neighborhood, setNeighborhood] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [docId, setDocId] = useState('')
  const [filter, setFilter] = useState('')

  const [filterd, setFiltered] = useState<IClientData[]>([])
  const [table, setTable] = useState<IClientData[]>([])

  const navigate = useNavigate()
  const location = useLocation()

  const clientDoc: IClientData = {
    clientName: name.trim(),
    clientWsp: wsp.trim(),
    clientResidence: residence.trim(),
    clentZipcode: zipcode.trim(),
    clientStreet: street.trim(),
    clientNeighborhood: neighborhood.trim(),
    clientCity: city.trim(),
  };

  // Handle Functions
  const handleClientDoc = async (e: FormEvent) => {
    e.preventDefault();
    setOnsave(true)
    if (location.state === null) {
      await addDoc(collection(db, "client"), clientDoc)
        .then(() => {
          alert('Cadastrado com sucesso!');
          cleanUseState();
          setOnsave(false)
        })
        .catch(err => console.log('Não foi possível realizar esta operação: ' + err))
    } else {

      const odData = doc(db, `${location.state.collectionName}`, docId)
      await updateDoc(odData, { ...clientDoc })
      alert("Dados atualizado com sucesso!")

      navigate("/")
      cleanUseState();
    }

  }

  const handleDeleteClientDoc = async () => {

    const confirmAction = confirm('Está ação não poderá  ser desfeita. Tem certeza disso?')

    if (confirmAction) {

      const clientRefDoc = doc(db, `${location.state.collectionName}`, docId)

      await deleteDoc(clientRefDoc)

      navigate('/')
    }

    return
  }

  // Functions
  const cleanUseState = (): void => {
    setName('');
    setWsp('')
    setResidence('')
    setZipcode('')
    setStreet('')
    setNeighborhood('')
    setCity('')
  }

  const handleFilter = () => {

    const filtered = table.filter(el => el.clientName === filter)
    setFiltered(filtered)

  }

  // Use Effects
  useEffect(() => {
    const querySnapshot = getDocs(collection(db, 'client'))

    let list: IClientData[] = []

    querySnapshot.then(snapshot => {
      snapshot.forEach(doc => {
        const item: IClientData = {
          clientId: doc.id,
          clientName: doc.data().clientName,
          clientWsp: doc.data().clientWsp,
          clientResidence: doc.data().clientResidence,
          clentZipcode: doc.data().clentZipcode,
          clientStreet: doc.data().clientStreet,
          clientNeighborhood: doc.data().clientNeighborhood,
          clientCity: doc.data().clientCity,
        }

        setTable(el => [...el, item])

      })
    })
    console.log(list.length);

  }, [])

  useEffect(() => {
    if (location.state !== null) {

      const clientRef = collection(db, `${location.state.collectionName}`)
      const q = query(clientRef, where("clientName", "==", `${location.state.search}`))

      getDocs(q)
        .then(Response => {
          Response.docs.forEach(doc => {

            setName(doc.data().clientName)
            setWsp(doc.data().clientWsp)
            setResidence(doc.data().clientResidence)
            setZipcode(doc.data().clentZipcode)
            setStreet(doc.data().clientStreet)
            setNeighborhood(doc.data().clientNeighborhood)
            setCity(doc.data().clientCity)
            setDocId(doc.id)
          });
        })

    }

  }, []);

  useEffect(() => {
    onSave ? setLoading(true) : setLoading(false)
  }, [onSave])

  useEffect(() => {
    if (filter === "") {
      setFiltered([])
    }
  }, [filter])

  return (
    <main className={styles.container}>
      <section>
        <h1>Informções do Cliente</h1>
        <div className={styles.actions}>
          <button onClick={handleDeleteClientDoc}>Deletar</button>
        </div>
        <form className={styles.form} onSubmit={handleClientDoc}>
          <fieldset className={styles.col_1}>
            <legend>Dados do cliente</legend>
            <Input
              type='text'
              placeholder='Digite o nome do cliente...'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type='tel'
              placeholder='Whatsapp...'
              value={wsp}
              onChange={(e) => setWsp(e.target.value)}
            />

            <Input
              type='text'
              placeholder='Residência: lote e quadra, apt, bloco...'
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
            />
          </fieldset>
          <fieldset className={styles.col_2}>
            <legend>Dados de endereço</legend>
            <Input
              type='text'
              placeholder='Digite o CEP...'
              style={inputStyle_2}
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
            <Input
              type='text'
              placeholder='Digite a rua...'
              style={inputStyle_1}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <Input
              type='text'
              placeholder='Digite o  bairro...'
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
            <Input
              type='text'
              placeholder='Digite a cidade...'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </fieldset>
          {
            !loading ? (<button type='submit' className={!loading ? styles.active_btn : styles.cancel_btn}>
              {!loading ? "Confirmar" : "Salvando dados..."}
            </button>) : (
              (<div className="loader"></div>)
            )
          }
        </form>
      </section>

      <section className={styles.table}>
        <div className={styles.filter}>
          <input
            type='text'
            placeholder='Pesquisar cliente...'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {
            filterd.length === 0 ? <button type='button' onClick={handleFilter}>Buscar</button> : ""
          }
        </div>
        <div className={styles.head}>
          <div>
            <span>Nome</span>
          </div>
          <div>
            <span>Whatsapp</span>
          </div>
          <div>
            <span>Residência</span>
          </div>
          <div>
            <span>Rua</span>
          </div>
          <div>
            <span>Bairro</span>
          </div>
          <div>
            <span>Cidade</span>
          </div>
        </div>
        <ul className={styles.table_list}>
          {
            filterd.length === 0 ? table.map((doc, index) => (
              <li key={index}>
                <span>{doc.clientName}</span>
                <span>{doc.clientWsp}</span>
                <span>{doc.clientResidence}</span>
                <span>{doc.clientStreet}</span>
                <span>{doc.clientNeighborhood}</span>
                <span>{doc.clientCity}</span>
              </li>
            )) : filterd.map((doc, index) => (
              <li key={index}>
                <span>{doc.clientName}</span>
                <span>{doc.clientWsp}</span>
                <span>{doc.clientResidence}</span>
                <span>{doc.clientStreet}</span>
                <span>{doc.clientNeighborhood}</span>
                <span>{doc.clientCity}</span>
              </li>
            ))
          }
        </ul>
      </section>
    </main>
  )
}

export default Client

