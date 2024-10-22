import styles from './App.module.css'
import { Login } from './components/Login/Login'
import { Game } from './components/Game/Game'


function App() {
  return (
    <div className={styles.App}>
      <Game /> 
    </div>
  )
}

export default App
