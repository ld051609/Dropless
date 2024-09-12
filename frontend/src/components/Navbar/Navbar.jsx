import React from 'react';
import styles from './Navbar.module.css';
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <img src="/avatar.png" alt="Logo" className={styles.logo} />
        <a href="/dashboard" className={styles.navbarItem}>Dashboard</a>
        <a href="/form" className={styles.navbarItem}>Form</a>
      </div>
    </nav>
  );
};

export default Navbar;
