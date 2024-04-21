import { useState } from "react";

function Uniforme() {
    // ELEGIR LOS A Y B
    const [a, setA] = useState();
    const [b, setB] = useState();

    const handleAChange = (event) => {
      setA(event.target.value);
    };
  
    const handleBChange = (event) => {
      setB(event.target.value);
    };

    // GENERAR NUMEROS RANDOM 0-1
    const [sampleSize, setSampleSize] = useState(10);
    const [randomNumbers, setRandomNumbers] = useState([]);

    const handleSampleSizeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0 && value <= 1000000) {
        setSampleSize(value);
        }
    };

    // GENERAR NUM RANDOM Y PASARLOS A UNIFORME
    const generateRandomNumbers = () => {
        const randomArray = Array.from({ length: sampleSize }, () => parseFloat(parseInt(a) + Math.random()*(parseInt(b)-parseInt(a))).toFixed(4));
        setRandomNumbers(randomArray);
    };

    // PEDIR INTERVALOS
    const [interval, setInterval] = useState("10");

    const handleIntervalChange = (e) => {
        const value = e.target.value;
        setInterval(value);
      };

    //  CALCULAR DATOS
    const [dataStats, setDataStats] = useState(null);
    const calculateStats = () => {
        const count = randomNumbers.length;
        const max = Math.max(...randomNumbers);
        const min = Math.min(...randomNumbers);
        const range = max - min;
        const amplitude = range / parseInt(interval);
    
        const stats = {
          count: count,
          max: max,
          min: min,
          range: range,
          amplitude: amplitude
        };
        
    
        setDataStats(stats);
      };
  
    return (
      <div>
        <h2>Uniforme</h2>
        <label htmlFor="a">Ingrese el valor de A:</label>
        <input
          type="number"
          id="a"
          value={a}
          onChange={handleAChange}
          placeholder="A"
        />
        <br />
        <label htmlFor="b">Ingrese el valor de B:</label>
        <input
          type="number"
          id="b"
          value={b}
          onChange={handleBChange}
          placeholder="B"
        />
        {a && b && (
          <p>
            A ingresado: {a}, B ingresado: {b}
          </p>
        )}
        <br />
        <label>
            Tamaño de la muestra (hasta 1,000,000):
            <input
            type="number"
            value={sampleSize}
            onChange={handleSampleSizeChange}
            />
        </label>
        <button onClick={generateRandomNumbers}>Generar Muestra</button>

        <div>
            <h2>Muestra Aleatoria:</h2>
            <ul>
            {randomNumbers.map((number, index) => (
                <li key={index}>{number}</li>
            ))}
            </ul>
        </div>


        <label>
            Seleccionar intervalos:
            <select value={interval} onChange={handleIntervalChange}>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="16">16</option>
            <option value="23">23</option>
            </select>
        </label>

      </div>
    );
  }

export default Uniforme;