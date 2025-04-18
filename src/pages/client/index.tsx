import { useState, useEffect, FormEvent } from 'react';
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
import { custom_style } from '../../interfaces/custom_styles/genral'
import '../../App.css'
// Intefaces
import { IClientData } from '../../interfaces/iClient/IClinet';
import { deleteFunc } from '../../interfaces/IUtilis/IUtilitis';

// Components
import Input from '../../components/Input/Input'

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
    console.log(docId);

    setOnsave(true)
    if (docId === "") {
      await addDoc(collection(db, "client"), clientDoc)
        .then(() => {
          alert('Cadastrado com sucesso!');
          cleanUseState();
          setOnsave(false)
        })
        .catch(err => console.log('Não foi possível realizar esta operação: ' + err))
    } else {

      const odData = doc(db, "client", docId)
      await updateDoc(odData, { ...clientDoc })
      alert("Dados atualizado com sucesso!")

      navigate("/")
      cleanUseState();
    }

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

  const handleFilterByLattter = (letter: string) => {
    setFilter(letter)
  }

  const handleBtnActionsEdit = (id: string) => {

    const currRecord = table.filter(item => item.clientId === id)

    setDocId(id)

    handleCleanFields

    setName(currRecord[0].clientName.trim())
    setWsp(currRecord[0].clientWsp.trim())
    setResidence(currRecord[0].clientResidence.trim())
    setZipcode(currRecord[0].clentZipcode.trim())
    setStreet(currRecord[0].clientStreet.trim())
    setNeighborhood(currRecord[0].clientNeighborhood.trim())
    setCity(currRecord[0].clientCity.trim())
    setDocId(currRecord[0].clientId!)
  }

  const handleBtnActionsDelete = async (id: string) => {
    try {
      if (confirm('Esta ação não poderá ser desfeita. Continuar?')) {
        deleteFunc(db, 'client', id)
      }
    } catch (error) {
      console.error(error);

    }
  }

  const handleCleanFields = () => {
    setName('')
    setWsp('')
    setResidence('')
    setZipcode('')
    setStreet('')
    setNeighborhood('')
    setCity('')
    setDocId('')

  }
  // Use Effects
  useEffect(() => {
    const querySnapshot = getDocs(collection(db, 'client'))

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

    const filterTable = table.filter((el) => {
      const A = el.clientName.toLocaleLowerCase().trim()
      const B = filter.toLocaleLowerCase().trim()

      if (A.indexOf(B) !== -1) {
        return el
      }
    })

    setFiltered([])
    const unique = [...new Set(filterTable)]

    setFiltered(unique)
  }, [filter])

  return (
    <main className={styles.container}>
      <h1>Informções do Cliente</h1>
      <section>
        <form className={styles.form} onSubmit={handleClientDoc}>
          <fieldset className={styles.col_1}>
            <legend>Dados do cliente</legend>
            <div className={styles.test}>
              <Input
                type='text'
                label='Cliente'
                placeholder='Digite o nome do cliente...'
                value={name}
                style={custom_style}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Input
                type='tel'
                label='Whatsapp'
                placeholder='Whatsapp...'
                value={wsp}
                style={custom_style}
                onChange={(e) => setWsp(e.target.value)}
              />
            </div>
            <div>
              <Input
                type='text'
                label='Residência'
                placeholder='Residência: lote e quadra, apt, bloco...'
                value={residence}
                style={custom_style}
                onChange={(e) => setResidence(e.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className={styles.col_2}>
            <legend>Dados de endereço</legend>
            <div>
              <Input
                type='text'
                label='CEP'
                placeholder='Digite o CEP...'
                style={custom_style}
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
            <div>
              <Input
                type='text'
                label='Rua'
                placeholder='Digite a rua...'
                style={custom_style}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div>
              <Input
                type='text'
                label='Bairro'
                placeholder='Digite o  bairro...'
                value={neighborhood}
                style={custom_style}
                onChange={(e) => setNeighborhood(e.target.value)}
              />
            </div>
            <div>
              <Input
                type='text'
                label='Cidade'
                placeholder='Digite a cidade...'
                value={city}
                style={custom_style}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </fieldset>
          <div className={styles.btn_submit}>
            {
              !loading ? (<button type='submit'>
                {!loading ? "Confirmar" : "Salvando dados..."}
              </button>) : (
                (<div className="loader"></div>)
              )
            }
            <button type='button' onClick={handleCleanFields}>Limpar</button>
          </div>
          <div>

          </div>
        </form>
      </section>

      <section className={styles.table}>
        <div className={styles.filter}>
          <input
            type='text'
            placeholder='Pesquisar cliente...'
            value={filter}
            onChange={(e) => handleFilterByLattter(e.target.value)}
          />
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
        < ul className={styles.table_list}>
          {
            filterd.length === 0 ? table.map((doc, index) => (
              <li key={index}>
                <div>
                  <span>{doc.clientName}</span>
                  <span>{doc.clientWsp}</span>
                  <span>{doc.clientResidence}</span>
                  <span>{doc.clientStreet}</span>
                  <span>{doc.clientNeighborhood}</span>
                  <span>{doc.clientCity}</span>
                </div>
                <div className={styles.li_actions}>
                  <button className={styles.edit} onClick={() => handleBtnActionsEdit(doc.clientId!)}>Editar</button>
                  <button className={styles.trash} onClick={() => handleBtnActionsDelete(doc.clientId!)}>Excluir</button>
                </div>
              </li>
            )) : filterd.map((doc, index) => (
              <li key={index}>
                <div>
                  <span>{doc.clientName}</span>
                  <span>{doc.clientWsp}</span>
                  <span>{doc.clientResidence}</span>
                  <span>{doc.clientStreet}</span>
                  <span>{doc.clientNeighborhood}</span>
                  <span>{doc.clientCity}</span>
                </div>
                <div className={styles.li_actions}>
                  <button className={styles.edit} onClick={() => handleBtnActionsEdit(doc.clientId!)}>Editar</button>
                  <button className={styles.trash} onClick={() => handleBtnActionsDelete(doc.clientId!)}>Excluir</button>
                </div>
              </li>
            ))
          }
        </ul>
      </section>
    </main>
  )
}

export default Client

