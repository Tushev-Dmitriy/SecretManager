import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import RequestsPage from "./pages/RequestsPage";
import SecretsPage from "./pages/SecretsPage";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className={styles.nav}>
      <Link 
        to="/" 
        className={`${styles.navLink} ${location.pathname === "/" ? styles.navLinkActive : ""}`}
      >
        Заявки
      </Link>
      <Link 
        to="/secrets" 
        className={`${styles.navLink} ${location.pathname === "/secrets" ? styles.navLinkActive : ""}`}
      >
        Все секреты
      </Link>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/secretLogo.png" alt="secretLogo" width={300}/>
        </div>
        <Navigation />
      </header>

      <Routes>
        <Route path="/" element={<RequestsPage />} />
        <Route path="/secrets" element={<SecretsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
