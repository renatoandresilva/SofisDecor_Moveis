import { NavLink } from "react-router-dom";
import { FaHouseChimneyWindow } from 'react-icons/fa6'

// Styles
import styles from './Header.module.css';
import logo from "../../assets/logo-img.png";

const Header = () => {
  return (
    <header className={styles.container}>
      <nav className={styles.centralizer}>
        <div className={styles.log_container}>
          <NavLink to='/'>
            <img src={logo} alt="Imegem do logo" className={styles.img_logo} />
            <span>Sofis<span className={styles.hightlight}>Decor</span> Móveis</span>
          </NavLink>
        </div>
        <div className={styles.links}>
          <NavLink to='/'><FaHouseChimneyWindow fontSize={18} /></NavLink>
          <NavLink to='/client'> Clentes</NavLink>
          <NavLink to='/sale'> Vendas</NavLink>
          <NavLink to='/cost'>Custos</NavLink>
          <NavLink to='/controller'>Resumo</NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Header