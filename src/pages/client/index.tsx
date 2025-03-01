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
// Intefaces
import { IClientData } from '../../interfaces/iClient/IClinet';

// Components
import Input from '../../components/Input/Input'
import firebase from 'firebase/compat/app';


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

  const [name, setName] = useState<string>('');
  const [document, setDocument] = useState<string>('');
  const [wsp, setWsp] = useState<string>('');
  const [call, setCall] = useState<string>('');
  const [residence, setResidence] = useState('');
  const [zipcode, setZipcode] = useState<string>('')
  const [street, setStreet] = useState<string>('')
  const [neighborhood, setNeighborhood] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [docId, setDocId] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  const clientDoc: IClientData = {
    clientName: name.trim(),
    clientDoc: document.trim(),
    clientWsp: wsp.trim(),
    clientFone: call.trim(),
    clientResidence: residence.trim(),
    clentZipcode: zipcode.trim(),
    clientStreet: street.trim(),
    clientNeighborhood: neighborhood.trim(),
    clientCity: city.trim()
  };

  useEffect(() => {
    if (location.state !== null) {

      const clientRef = collection(db, `${location.state.collectionName}`)
      const q = query(clientRef, where("clientName", "==", `${location.state.search}`))

      getDocs(q)
        .then(Response => {
          Response.docs.forEach(doc => {

            setName(doc.data().clientName)
            setDocument(doc.data().clientDoc)
            setWsp(doc.data().clientWsp)
            setCall(doc.data().clientFone)
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

  const handleClientDoc = async (e: FormEvent) => {
    e.preventDefault();

    if (location.state === null) {
      await addDoc(collection(db, "client"), clientDoc)
        .then(() => {
          alert('Cadastrado com sucesso!');
          cleanUseState();
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

  const handleDeleteClientDoc = async (id: string) => {
    console.log(id);

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
    setDocument('')
    setWsp('')
    setCall('')
    setResidence('')
    setZipcode('')
    setStreet('')
    setNeighborhood('')
    setCity('')
  }

  return (
    <>
      <h1>Informções do Cliente</h1>
      <div className={styles.actions}>
        <button onClick={() => { handleDeleteClientDoc(location.state.id) }}>Deletar</button>
      </div>
      <div className={styles.container}>
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
              type='text'
              placeholder='Digite CPF ou CNPJ...'
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />

            <Input
              type='tel'
              placeholder='Whatsapp...'
              value={wsp}
              onChange={(e) => setWsp(e.target.value)}
            />
            <Input
              type='tel'
              placeholder='ligação...'
              value={call}
              onChange={(e) => setCall(e.target.value)}
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
          <button type="submit">{location.state === null ? "Cadastar" : "Atualizar"}</button>
        </form>
      </div>
    </>
  )
}

export default Client 