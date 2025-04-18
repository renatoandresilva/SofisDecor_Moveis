import { NavLink } from "react-router-dom";
import { FaHouseChimneyWindow } from 'react-icons/fa6'
import { getAuth } from "firebase/auth";
import Logo from "../logo/Logo";

// Styles
import styles from './Header.module.css';
import { useEffect, useState } from "react";
type userPermissionId = {
  id_1: string,
  id_2: string,
}
const userPermission: userPermissionId = {
  id_1: 'JBuYKcsXmehNLuopr4Ghmc1WoNA3',
  id_2: 'hVTsjGExMtZmF3ngo9njuCWa45u2'
}

const Header = () => {

  const [permited, setPermited] = useState('')
  const [isPermited, setIsPermited] = useState(false)

  const auth = getAuth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setPermited(user.uid)
    } else {
      // Nenhum usuário logado
      console.log("Nenhum usuário logado.");
    }
  });

  useEffect(() => {
    if (permited === userPermission.id_1 || permited === userPermission.id_2) {
      setIsPermited(true)
    }
  }, [permited])

  return (
    <header className={styles.container}>
      <nav className={styles.centralizer}>
        <Logo />
        <div className={styles.links}>
          <div>
            <NavLink to='/'><FaHouseChimneyWindow fontSize={18} /></NavLink>
          </div>
          <div className={!isPermited ? styles.displaynone : ''}>
            <NavLink to='/client' className={!isPermited ? styles.displaynone : ''} > Clintes</NavLink>
          </div>
          <div className={!isPermited ? styles.displaynone : ''}>
            <NavLink to='/sale'> Vendas</NavLink>
          </div>
          <div className={!isPermited ? styles.displaynone : ''}>
            <NavLink to='/cost'>Custos</NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header