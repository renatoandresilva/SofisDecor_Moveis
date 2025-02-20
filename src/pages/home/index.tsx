import styles from './Home.module.css';
import Input from '../../components/Input/Input';


const Home = () => {
  return (
    <main className={styles.container}>
      <h1>Buscar informação</h1>
      <form className={styles.form}>
        <Input placeholder='Busque por venda, clinte, produto, ....' />
      </form>
    </main>
  )
}

export default Home