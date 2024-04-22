import { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import NumberList from "./NumberList";

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
    // const generateRandomNumbers = () => {
    //     const randomArray = Array.from({ length: sampleSize }, () => parseFloat(parseInt(a) + Math.random()*(parseInt(b)-parseInt(a))).toFixed(4));
    //     setRandomNumbers(randomArray);
    // };
    const generateRandomNumbers = () => {
        const randomArray = [];
        const numeroA = parseInt(a)
        const numeroB = parseInt(b)
        for (let i = 0; i < sampleSize; i++) {
          randomArray.push(parseFloat(numeroA + Math.random() * (numeroB - numeroA)).toFixed(4));
        }
        setRandomNumbers(randomArray);
        console.log(randomArray)
        // calculateStats(randomArray);
      };

    // PEDIR INTERVALOS
    const [interval, setInterval] = useState("10");

    const handleIntervalChange = (e) => {
        const value = e.target.value;
        setInterval(value);
      };

    //  CALCULAR DATOS
    const [dataStats, setDataStats] = useState(null);
    const [intervals, setIntervals] = useState([]);
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
        

        const intervalSize = amplitude;
        const intervalArray = [];
        for (let i = 0; i < parseInt(interval); i++) {
        const intervalStart = min + i * intervalSize;
        const intervalEnd = intervalStart + intervalSize;
        intervalArray.push({
            intervalStart: intervalStart.toFixed(4),
            intervalEnd: intervalEnd.toFixed(4),
            count: 0
        });
        }

        randomNumbers.forEach(number => {
            for (let i = 0; i < intervalArray.length; i++) {
                // console.log(i, intervalArray.length)
                if(i != intervalArray.length-1){
                    if (number >= parseFloat(intervalArray[i].intervalStart) && number < parseFloat(intervalArray[i].intervalEnd)) {
                      intervalArray[i].count++;
                      break;
                    }
                } else{
                    if (number >= parseFloat(intervalArray[i].intervalStart) && number <= parseFloat(intervalArray[i].intervalEnd)) {
                        intervalArray[i].count++;
                        break;
                      }
                }
            }
          });

        setIntervals(intervalArray);
        drawChart(intervalArray);
        console.log(dataStats)
        console.log(intervalArray)
      };

      const drawChart = (intervals) => {
        const labels = intervals.map(interval => `[${interval.intervalStart} - ${interval.intervalEnd}]`);
        const counts = intervals.map(interval => interval.count);
    
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: '# de Números',
              data: counts,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      };

      const [startIndex, setStartIndex] = useState(0);
        const [visibleNumbers, setVisibleNumbers] = useState([]);

        useEffect(() => {
            const batchSize = 1000; // Ajusta este valor según tus necesidades
            const endIndex = startIndex + batchSize;
            setVisibleNumbers(randomNumbers.slice(startIndex, endIndex));
        }, [startIndex, randomNumbers]);

        const handleScroll = (event) => {
            const scrollHeight = event.target.scrollHeight;
            const scrollTop = event.target.scrollTop;
            const clientHeight = event.target.clientHeight;

            if (scrollHeight - scrollTop === clientHeight) {
            setStartIndex((prevIndex) => prevIndex + 1000);
            }
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
        <div>
            <NumberList randomNumbers={randomNumbers}/>
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
        
        <br />
        <button onClick={calculateStats}>Crear histograma</button>

        {dataStats && (
        <div>
          <h2>Estadísticas:</h2>
          <p>Cantidad de datos: {dataStats.count}</p>
          <p>Máximo: {dataStats.max}</p>
          <p>Mínimo: {dataStats.min}</p>
          <p>Rango: {dataStats.range}</p>
          <p>Amplitud: {dataStats.amplitude}</p>
        </div>
        )}

        <div>
        <canvas id="myChart"></canvas>
      </div>

      </div>

      
    );
  }

export default Uniforme;