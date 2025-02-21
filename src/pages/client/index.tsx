import styles from './Client.module.css'
import { CSSProperties } from 'react';

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
  return (
    <>
      <h1>Informções do Cliente</h1>
      <form className={styles.form}>
        <fieldset className={styles.col_1}>
          <legend>Dados do cliente</legend>
          <Input
            type='text'
            placeholder='Digite o nome do cliente...'
          />
          <Input
            type='text'
            placeholder='Digite CPF ou CNPJ...'
          />

          <Input
            type='tel'
            placeholder='Whatsapp...'
          />
          <Input
            type='tel'
            placeholder='ligação...'
          />

          <Input
            type='text'
            placeholder='Residência: lote e quadra, apt, bloco...'
          />
        </fieldset>
        <fieldset className={styles.col_2}>
          <legend>Dados de endereço</legend>
          <Input
            type='text'
            placeholder='Digite o CEP...'
            customCSS={inputStyle_2}
          />
          <Input
            type='text'
            placeholder='Digite a rua...'
            customCSS={inputStyle_1}
          />
          <Input
            type='text'
            placeholder='Digite o  bairro...'
          />
          <Input
            type='text'
            placeholder='Digite a cidade...'
          />
        </fieldset>

        <button type='submit'>Cadastar</button>
      </form>
    </>
  )
}

export default Client