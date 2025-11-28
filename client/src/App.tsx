import { Sidebar } from "./features/drafts/components/Sidebar/Sidebar";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <Sidebar />
    </div>
  );
}

export default App;
