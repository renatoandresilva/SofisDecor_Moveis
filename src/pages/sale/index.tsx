import Input from "../../components/Input/Input"
import styles from "./Sale.module.css";

const Sale = () => {
  return (
    <div>
      <h1>Informações de Vendas</h1>
      <form className={styles.form}>
        <fieldset className={styles.col_1}>
          <legend>Dados da venda</legend>
          <Input
            type='text'
            placeholder='Nome do produto...'
          />
          <Input
            type='number'
            placeholder='Valor do produto...'
          />
          <div className={styles.checkbox_container}>
            <Input
              type='checkbox'
              label="Parcelado?"
            />
          </div>
          <Input
            type='date'
            label='Vencimento'
          />
          <Input
            type='number'
            placeholder='Quanitidade de parcelas...'
          />
          <Input
            type='number'
            placeholder='Valor da parcela...'
          />
        </fieldset>
        <fieldset className={styles.col_2}>
          <legend>Dados do pagamento</legend>
          <Input
            type='date'
            placeholder='Date efetiva do pagamento...'
          />
          <Input
            type='number'
            placeholder='Número da parcela...'
          />
          <Input
            type='number'
            placeholder='Valor efetivo do pagamento da parcela...'
          />
        </fieldset>
        <button type='submit'>Cadastar</button>
      </form>
    </div>
  )
}

export default Sale