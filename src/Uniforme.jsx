import { useState } from "react";

function Uniforme() {
    const [a, setA] = useState('');
    const [b, setB] = useState('');

    const [sampleSize, setSampleSize] = useState(10);
    const [randomNumbers, setRandomNumbers] = useState([]);

    const handleSampleSizeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0 && value <= 1000000) {
        setSampleSize(value);
        }
    };

  const generateRandomNumbers = () => {
    const randomArray = Array.from({ length: sampleSize }, () => parseFloat(Math.random().toFixed(4)));
    setRandomNumbers(randomArray);
  };
  
    const handleAChange = (event) => {
      setA(event.target.value);
    };
  
    const handleBChange = (event) => {
      setB(event.target.value);
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

        {/* <div>
            <h2>Muestra Aleatoria:</h2>
            <ul>
            {randomNumbers.map((number, index) => (
                <li key={index}>{number}</li>
            ))}
            </ul>
        </div> */}

      </div>
    );
  }

export default Uniforme;