import styles from './Client.module.css'

import Input from '../../components/Input/Input'

const customStyle = {
  style1: {
    flex: 1,
  }
}

const Client = () => {
  return (
    <>
      <h1>Informções do Cliente</h1>
      <form className={styles.form}>
        <fieldset>
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
        <fieldset>
          <legend>Dados de endereço</legend>
          <Input
            type='text'
            placeholder='Digite o CEP...'
          />
          <Input
            type='text'
            placeholder='Digite a rua...'
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