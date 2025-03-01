import { NavLink } from "react-router-dom";
import { FaHouseChimneyWindow } from 'react-icons/fa6'

import Logo from "../logo/Logo";

// Styles
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.container}>
      <nav className={styles.centralizer}>
        <Logo />
        <div className={styles.links}>
          <NavLink to='/'><FaHouseChimneyWindow fontSize={18} /></NavLink>
          <NavLink to='/client'> Clintes</NavLink>
          <NavLink to='/sale'> Vendas</NavLink>
          <NavLink to='/cost'>Custos</NavLink>
          <NavLink to='/controller'>Resumo</NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Header