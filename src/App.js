import styles from  "./App.module.css";
import Header from "./components/Header";
import Filter from "./components/Filter";

const App = () => {
  return (
      <div className={styles.App}>
        <Header />
        <Filter />
      </div>
  );
};

export default App;
