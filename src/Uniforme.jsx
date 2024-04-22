import { useState } from "react";
import Chart from "chart.js/auto";
import NumberList from "./NumberList";
import jStat from "jstat";
import Tabla from "./Tabla";

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


  // MANEJAR TAMAÑO DE MUESTRA
  const [sampleSize, setSampleSize] = useState(30);

  const handleSampleSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 1000000) {
      setSampleSize(value);
    }
  };


  // GENERAR NUM RANDOM 0-1 Y PASARLOS A UNIFORME
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [numerosGenerados, setNumerosGenerados] = useState(false)
  const generateRandomNumbers = () => {
    const randomArray = [];
    const numeroA = parseInt(a);
    const numeroB = parseInt(b);
    for (let i = 0; i < sampleSize; i++) {
        if(Math.random() == 1){
            console.log('true')
        }
      randomArray.push(
        parseFloat(numeroA + Math.random() * (numeroB - numeroA - 0.0001)).toFixed(4)
      );
    }
    setRandomNumbers(randomArray);
    setNumerosGenerados(true);
  };


  // PEDIR INTERVALOS
  const [interval, setInterval] = useState("10");

  const handleIntervalChange = (e) => {
    const value = e.target.value;
    setInterval(value);
  };


  // FUNCION CALCULAR CHI CUADRADO
  const calcularChiCuadrado = (observadas, esperadas) => {
    let chiCuadrado = 0;
    for (let i = 0; i < observadas.length; i++) {
      chiCuadrado += Math.pow(observadas[i] - esperadas[i], 2) / esperadas[i];
    }
    return chiCuadrado;
  };

//   FUNCION CALCULAR KS
  const calcularKS = (observadas, esperadas, cantidadDatos) => {
    const diferenciasPoPeAc = [];
    let probObservadaAcumulada = 0;
    let probEsperadaAcumulada = 0;
    for (let i = 0; i < observadas.length; i++) {
        probObservadaAcumulada += observadas[i]/cantidadDatos;
        probEsperadaAcumulada += esperadas[i]/cantidadDatos;
        diferenciasPoPeAc.push(Math.abs(probObservadaAcumulada-probEsperadaAcumulada));
      }
      return Math.max(...diferenciasPoPeAc);
  }


  //  CALCULAR DATOS, INTERVALOS, GRAFICO, CHI
  const [dataStats, setDataStats] = useState(null);
  const [intervals, setIntervals] = useState([]);
  const [myChart, setMyChart] = useState();
  const [chiCalculado, setChiCalculado] = useState();
  const [ksCalcualdo, setKsCalculado] = useState();

  const calculateStats = () => {
    // CALCULAR DATOS
    const count = randomNumbers.length;
    const max = randomNumbers.reduce(
      (max, current) => Math.max(max, current),
      -Infinity
    );
    const min = randomNumbers.reduce(
      (min, current) => Math.min(min, current),
      Infinity
    );
    const range = max - min;
    const amplitude = range / parseInt(interval);
    const stats = {
      count: count,
      max: max,
      min: min,
      range: range,
      amplitude: amplitude,
    };

    setDataStats(stats);

    // CALCULAR INTERVALOS Y FRECUENCIAS OBSERVADAS
    const intervalSize = amplitude;
    const intervalArray = [];
    for (let i = 0; i < parseInt(interval); i++) {
      const intervalStart = min + i * intervalSize;
      const intervalEnd = intervalStart + intervalSize;
      intervalArray.push({
        intervalStart: parseFloat(intervalStart).toFixed(4),
        intervalEnd: parseFloat(intervalEnd).toFixed(4),
        count: 0,
      });
    }
    randomNumbers.forEach((number) => {
      for (let i = 0; i < intervalArray.length; i++) {
        if (i != intervalArray.length - 1) {
          if (
            number >= parseFloat(intervalArray[i].intervalStart) &&
            number < parseFloat(intervalArray[i].intervalEnd)
          ) {
            intervalArray[i].count++;
            break;
          }
        } else {
          if (
            number >= parseFloat(intervalArray[i].intervalStart) &&
            number <= parseFloat(intervalArray[i].intervalEnd)
          ) {
            intervalArray[i].count++;
            break;
          }
        }
      }
    });

    //   AGRUPAR INTERVALOS CON Fo < 5
    // for (let i = 0; i < intervalArray.length; i++) {
    //   if (intervalArray[i].count < 5 && i !== intervalArray.length - 1) {
    //     intervalArray[i].count += intervalArray[i + 1].count;
    //     intervalArray.splice(i + 1, 1);
    //     i--;
    //   }
    // }

    setIntervals(intervalArray);
    drawChart(intervalArray);

    // CALCULAR Fo, Fe y Chi
    const frecuenciasObservadas = intervalArray.map(
      (interval) => interval.count
    );
    const frecuenciasEsperadas = Array.from(
      { length: intervalArray.length },
      () => randomNumbers.length / intervalArray.length
    );
    setChiCalculado(
      calcularChiCuadrado(frecuenciasObservadas, frecuenciasEsperadas)
    );
    setKsCalculado(
        // calcularKS(frecuenciasObservadas, frecuenciasEsperadas)
        calcularKS(frecuenciasObservadas, frecuenciasEsperadas, randomNumbers.length)
    )
  };


  //   DIBUJAR HISTOGRAMA
  const drawChart = (intervals) => {
    const labels = intervals.map(
      (interval) => `[${interval.intervalStart} - ${interval.intervalEnd}]`
    );
    const counts = intervals.map((interval) => interval.count);

    const canvas = document.getElementById("myChart");
    const ctx = canvas.getContext("2d");

    if (myChart) {
      myChart.destroy();
      setMyChart();
    }

    setMyChart(
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "# de Números",
              data: counts,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    );
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

      {numerosGenerados && (
        <>
        <div>
          <NumberList randomNumbers={randomNumbers} />
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
        
        </>
      )}

      {numerosGenerados && dataStats && (
        <>
            <div>
            <h2>Estadísticas:</h2>
            <p>Cantidad de datos: {dataStats.count}</p>
            <p>Máximo: {dataStats.max}</p>
            <p>Mínimo: {dataStats.min}</p>
            <p>Rango: {dataStats.range}</p>
            <p>Amplitud: {dataStats.amplitude}</p>
            </div>
            {/* <Tabla frecuencias={intervals}/> */}
        </>
      )}

      <div>
        <canvas id="myChart"></canvas>
      </div>

      {numerosGenerados && dataStats && (
      <div>
        Chi calculado: {parseFloat(chiCalculado).toFixed(4)}
        <br />
        Chi tabulado: {parseFloat(jStat.chisquare.inv(0.95, 9)).toFixed(4)}
        <br />
        KS calculado: {parseFloat(ksCalcualdo).toFixed(4)}
        <br />
        KS tabulado: {parseFloat(1.36/Math.sqrt(randomNumbers.length)).toFixed(4)}
      </div>
      )}
    </div>
  );
}

export default Uniforme;
