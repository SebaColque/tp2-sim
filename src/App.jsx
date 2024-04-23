import { useEffect, useState } from 'react'
import './App.css'
import Uniforme from './Uniforme';
import Exponencial from './Exponencial';



function App() {

    const [distribucion, setDistribucion] = useState('');
  
    const handleChange = (event) => {
      setDistribucion(event.target.value);
    };

    useEffect(() => {



    }, [distribucion])


  return (
    <>

      <div>
        <h2>Selecciona una distribución:</h2>
        <select value={distribucion} onChange={handleChange}>
          <option value="">Selecciona una opción</option>
          <option value="uniforme">Uniforme</option>
          <option value="exponencial">Exponencial</option>
          <option value="normal">Normal</option>
        </select>

        {distribucion === "uniforme" && <Uniforme/>}
        {distribucion === "exponencial" && <Exponencial/>}
      </div>

      {/* {distribucion == "exponencial" && Uniforme}
      {distribucion == "normal" && Uniforme} */}


      {/* <div>

        <h1>Distribución a utilizar</h1>
        <button onClick={() => setDistUniforme(true)}>
          Uniforme
        </button>
        <button onClick={() => setDistExponencial(true)}>
          Exponencial
        </button>
        <button onClick={() => setDistNormal(true)}>
          Normal
        </button> */}

        

      {/* </div> */}
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}
export default App;
