import { useState } from "react";
import Chart from "chart.js/auto";
import NumberList from "./components/NumberList";
import jStat from "jstat";
import "./Uniforme.css"
import Tabla from "./components/Tabla";
import TablaKS from "./components/TablaKS";

function Normal() {
    // ELEGIR MEDIA Y DESVIACIÓN
    const [media, setMedia] = useState();
    const [desviacion, setDesviacion] = useState();
  
    const handleAChange = (event) => {
      setMedia(event.target.value);
    };
  
    const handleBChange = (event) => {
      setDesviacion(event.target.value);
    };


  // MANEJAR TAMAÑO DE MUESTRA
  const [sampleSize, setSampleSize] = useState(30);

  const handleSampleSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 1000000) {
      setSampleSize(value);
    }
  };


   // GENERAR NUM RANDOM 0-1 Y PASARLOS A NORMAL
   const [randomNumbers, setRandomNumbers] = useState([]);
   const [numerosGenerados, setNumerosGenerados] = useState(false)
   const generateRandomNumbers = () => {
    const randomArray = [];
    const m = parseFloat(media);
    const d = parseFloat(desviacion);
    for (let i = 0; i < sampleSize; i += 2) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z1 = ((Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)) * d) + m;
        const z2 = ((Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2)) * d) + m;
        randomArray.push(parseFloat(z1).toFixed(4));
        randomArray.push(parseFloat(z2).toFixed(4));
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

  const [intervalArrayChi, setIntervalArrayChi] = useState();
  const [intervalArrayKS, setIntervalArrayKS] = useState();

  const [myChart, setMyChart] = useState();

  const [frecuenciaObservada, setFrecuenciaObservada] = useState();
  const [frecuenciaEsperada, setFrecuenciaEsperada] = useState();
  const [frecuenciaEsperadaKS, setFrecuenciaEsperadaKS] = useState();
  const [c, setC] = useState();
  const [cAc, setCAc] = useState();

  const [chiCalculado, setChiCalculado] = useState();
  const [chiCalculadoMenor, setChiCalculadoMenor] = useState(false)
  const [ksCalcualdo, setKsCalculado] = useState();
  const [ksCalculadoMenor, setKsCalculadoMenor] = useState(false)

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
    const intervalsArray = [];
    const intervalsArrayKS = [];
    for (let i = 0; i < parseInt(interval); i++) {
      const intervalStart = min + i * intervalSize;
      const intervalEnd = intervalStart + intervalSize;
      intervalsArray.push({
        intervalStart: parseFloat(intervalStart).toFixed(4),
        intervalEnd: parseFloat(intervalEnd).toFixed(4),
        count: 0,
      });
      intervalsArrayKS.push({
        intervalStart: parseFloat(intervalStart).toFixed(4),
        intervalEnd: parseFloat(intervalEnd).toFixed(4),
        count: 0,
      });
    }
    randomNumbers.forEach((number) => {
      for (let i = 0; i < intervalsArray.length; i++) {
        if (i != intervalsArray.length - 1) {
          if (
            number >= parseFloat(intervalsArray[i].intervalStart) &&
            number < parseFloat(intervalsArray[i].intervalEnd)
          ) {
            intervalsArray[i].count++;
            intervalsArrayKS[i].count++;
            break;
          }
        } else {
          if (
            number >= parseFloat(intervalsArray[i].intervalStart) &&
            number <= parseFloat(intervalsArray[i].intervalEnd)
          ) {
            intervalsArray[i].count++;
            intervalsArrayKS[i].count++;
            break;
          }
        }
      }
    });

    setIntervalArrayKS(intervalsArrayKS);

     // CALCULAR Fo, Fe y Chi
     function calcularFrecuenciaEsperada () {
      const frecuenciasEsperadas = [];
      for (let i = 0; i < intervalsArray.length; i++) {
        const lowerBound = parseFloat(intervalsArray[i].intervalStart);
        const upperBound = parseFloat(intervalsArray[i].intervalEnd);
        const marcaClase = (lowerBound + upperBound) / 2;
        const exponente = -0.5 * Math.pow((marcaClase - media) / desviacion, 2);
        const coeficiente = Math.exp(exponente) / (desviacion * Math.sqrt(2 * Math.PI));
        const intervaloSize = upperBound - lowerBound;
        const probabilidad = coeficiente * intervaloSize;
        const expectedFrequency = probabilidad * randomNumbers.length
        frecuenciasEsperadas.push(expectedFrequency);
      }
      return frecuenciasEsperadas;
    };

    const frecuenciasObservadas = intervalsArray.map(
      (interval) => interval.count
    );
    const frecuenciasEsperadas = calcularFrecuenciaEsperada();
    const frecuenciasEsperadasKS = calcularFrecuenciaEsperada();
    setFrecuenciaEsperadaKS(frecuenciasEsperadasKS)

    for (let i = 0; i < intervalsArray.length - 1; i++) { 
      while (isNaN(frecuenciasEsperadas[i]) || frecuenciasEsperadas[i] < 5) { 
          intervalsArray[i + 1].count += parseFloat(intervalsArray[i].count); 
          intervalsArray[i + 1].intervalStart = intervalsArray[i].intervalStart; 
          const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i + 1] + frecuenciasEsperadas[i]).toFixed(2)); 
          frecuenciasEsperadas[i + 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada; 
          intervalsArray.splice(i, 1); 
          frecuenciasEsperadas.splice(i, 1); 
          i = 0; 
      } 
      if (i == intervalsArray.length - 2) { 
          if (isNaN(frecuenciasEsperadas[intervalsArray.length - 1]) || frecuenciasEsperadas[intervalsArray.length - 1] < 5) { 
              intervalsArray[i + 1].count += parseFloat(intervalsArray[i].count); 
              intervalsArray[i + 1].intervalStart = intervalsArray[i].intervalStart; 
              const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i + 1] + frecuenciasEsperadas[i]).toFixed(2)); 
              frecuenciasEsperadas[i + 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada; 
              intervalsArray.splice(i, 1); 
              frecuenciasEsperadas.splice(i, 1); 
              i = 0; 
          } 
      } 
  }
    

    drawChart(intervalsArrayKS);
    setIntervalArrayChi(intervalsArray);

    const estadistico = intervalsArray.map((interval, index) => {
      return Math.pow(interval.count - frecuenciasEsperadas[index], 2) / frecuenciasEsperadas[index];
    });
  
    setFrecuenciaObservada(frecuenciasObservadas);
    setFrecuenciaEsperada(frecuenciasEsperadas);
    setC(estadistico);
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
              label: "Frecuencia Observada",
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
              title: {
                display: true,
                text: "Frecuencias Observadas"
              }
            },
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Intervalos"
              }
            },
          },
        },
      })
    );
  };

  return (
    <div>
    <h2>Normal</h2>
   <label htmlFor="a">Ingrese el valor de la media:</label>
   <input
     type="number"
     id="a"
     value={media}
     onChange={handleAChange}
     placeholder="Media"
   />
   <br />
   <label htmlFor="b">Ingrese el valor de la desviacion:</label>
   <input
     type="number"
     id="b"
     value={desviacion}
     onChange={handleBChange}
     placeholder="Desviacion"
   />

      {/*
      {a && b && (
        <p>
          A ingresado: {a}, B ingresado: {b}
        </p>
      )}
      */}

      <br />
      <label>
        Tamaño de la muestra (hasta 1,000,000):
        <input
          type="number"
          value={sampleSize}
          onChange={handleSampleSizeChange}
        />
      </label>

      <br />
      <button onClick={generateRandomNumbers}>Generar Muestra</button>

      {numerosGenerados && (
        <>
        <div className="numberList">
          <NumberList randomNumbers={randomNumbers}/>
        </div>
  
        <label className="selectIntervalos">
          Seleccionar intervalos:
          <select value={interval} onChange={handleIntervalChange} className="selectIntervalos">
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
          <p>Máximo: {parseFloat(dataStats.max).toFixed(4)}</p>
          <p>Mínimo: {parseFloat(dataStats.min).toFixed(4)}</p>
          <p>Rango: {parseFloat(dataStats.range).toFixed(4)}</p>
          <p>Amplitud: {parseFloat(dataStats.amplitude).toFixed(4)}</p>
          </div>
          {/* <Tabla frecuencias={intervals}/> */}
      </>
      )}

      <div>
        <canvas id="myChart"></canvas>
      </div>


      {numerosGenerados && dataStats && frecuenciaEsperada && (
        <>
          <h4>H0: La serie de datos presenta una distribucion Normal</h4>

          <br />
          <br />
          <h3>Tabla ChiCuadrado</h3>
          <Tabla intervalArray={intervalArrayChi} fe={frecuenciaEsperada}
                  c={c} setChiCalculado={setChiCalculado}/>
            
            
            <div>

      
              Chi calculado: {parseFloat(chiCalculado).toFixed(4)}
              {(chiCalculado < parseFloat(jStat.chisquare.inv(0.95, intervalArrayChi.length-1-2).toFixed(4)))
                ? "   <   "
                : "   >   "}
              Chi tabulado (α: 0,05 - grados de libertad: {intervalArrayChi.length-1-2}): {parseFloat(jStat.chisquare.inv(0.95, intervalArrayChi.length-1-2)).toFixed(4)}    ➙           
              {(chiCalculado < parseFloat(jStat.chisquare.inv(0.95, intervalArrayChi.length-1-2).toFixed(4)))
                ? "   No se rechaza la H0"
                : "   Se rechaza la H0"}
            </div>
          

          <br />
          <br />
          <h3>Tabla KS</h3>
          <TablaKS cantidadDatos={randomNumbers.length} intervalArray={intervalArrayKS} fe={frecuenciaEsperadaKS}
                  c={c} setKsCalculado={setKsCalculado}/>

          <div className="resultadosBondad">
            
            KS calculado: {parseFloat(ksCalcualdo).toFixed(4)}
            {(ksCalcualdo < parseFloat(1.36/Math.sqrt(randomNumbers.length).toFixed(4)))
              ? "   <   "
              : "   >   "}
            KS tabulado (α: 0,05): {parseFloat(1.36/Math.sqrt(randomNumbers.length)).toFixed(4)}    ➙           
            {(ksCalcualdo < parseFloat(1.36/Math.sqrt(randomNumbers.length).toFixed(4)))
              ? "   No se rechaza la H0"
              : "   Se rechaza la H0"}
          </div>
        </>
      )}
    </div>
  );
}

export default Normal;
