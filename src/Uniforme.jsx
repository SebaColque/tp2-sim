import { useState } from "react";
import Chart from "chart.js/auto";
import NumberList from "./components/NumberList";
import jStat from "jstat";
import "./Uniforme.css"
import Tabla from "./components/Tabla";
import TablaKS from "./components/TablaKS";

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
    const numeroA = parseFloat(a);
    const numeroB = parseFloat(b);
    for (let i = 0; i < sampleSize; i++) {
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
//   const calcularChiCuadrado = (observadas, esperadas) => {
//     let chiCuadrado = 0;
//     for (let i = 0; i < observadas.length; i++) {
//       chiCuadrado += Math.pow(observadas[i] - esperadas[i], 2) / esperadas[i];
//     }
//     return chiCuadrado;
//   };

  // FUNCION CALCULAR KS
//   const calcularKS = (observadas, esperadas, cantidadDatos) => {
//     const diferenciasPoPeAc = [];
//     let probObservadaAcumulada = 0;
//     let probEsperadaAcumulada = 0;
//     for (let i = 0; i < observadas.length; i++) {
//         probObservadaAcumulada += observadas[i]/cantidadDatos;
//         probEsperadaAcumulada += esperadas[i]/cantidadDatos;
//         diferenciasPoPeAc.push(Math.abs(probObservadaAcumulada-probEsperadaAcumulada));
//       }
//       return Math.max(...diferenciasPoPeAc);
//   }


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
    // console.log(intervalsArray)
    setIntervalArrayKS(intervalsArrayKS);

    const frecuenciasObservadas = intervalsArray.map(
      (interval) => interval.count
    );
    const frecuenciasEsperadas = Array.from(
      { length: intervalsArray.length },
      () => randomNumbers.length / intervalsArray.length
    );
    const frecuenciasEsperadasKS = Array.from(
      { length: intervalsArrayKS.length },
      () => randomNumbers.length / intervalsArrayKS.length
    );
    setFrecuenciaEsperadaKS(frecuenciasEsperadasKS)
    //   AGRUPAR INTERVALOS CON Fo < 5
    // for (let i = 0; i < intervalsArray.length; i++) {
    //   if (intervalsArray[i].count < 5 && i !== intervalsArray.length - 1) {
    //     intervalsArray[i].count += intervalsArray[i + 1].count;
    //     intervalsArray.splice(i + 1, 1);
    //     i--;
    //   }
    // }
    // for (let i = intervalsArray.length - 1; i > 0; i--) {
    //   while (isNaN(frecuenciasEsperadas[i]) || frecuenciasEsperadas[i] < 5) {
    //     intervalsArray[i - 1].count += parseFloat(intervalsArray[i].count);
    //     intervalsArray[i - 1].intervalEnd = intervalsArray[i].intervalEnd;
    //     const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i - 1] + frecuenciasEsperadas[i]).toFixed(2));
    //     frecuenciasEsperadas[i - 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada;
    //     intervalsArray.splice(i, 1);
    //     frecuenciasEsperadas.splice(i, 1);
    //     i = intervalsArray.length - 1;
    //   }
    //   if(i==1){
    //     if(isNaN(frecuenciasEsperadas[0]) || frecuenciasEsperadas[0] < 5) {
    //       intervalsArray[i - 1].count += parseFloat(intervalsArray[i].count);
    //       intervalsArray[i - 1].intervalEnd = intervalsArray[i].intervalEnd;
    //       const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i - 1] + frecuenciasEsperadas[i]).toFixed(2));
    //       frecuenciasEsperadas[i - 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada;
    //       intervalsArray.splice(i, 1);
    //       frecuenciasEsperadas.splice(i, 1);
    //       i = intervalsArray.length - 1;
    //     }
    //   }

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

    // CALCULAR Fo, Fe y Chi
    

    const estadistico = intervalsArray.map((interval, index) => {
      return Math.pow(interval.count - frecuenciasEsperadas[0], 2) / frecuenciasEsperadas[0];
    });

    // const cAc = [];
    // let acumulado = 0;
    // for (let i = 0; i < c.length; i++) {
    //     acumulado += c[i];
    //     console.log(c[i])
    //     cAc.push(acumulado);
    // }
  
    setFrecuenciaObservada(frecuenciasObservadas);
    setFrecuenciaEsperada(frecuenciasEsperadas);
    setC(estadistico);
    // setCAc(cAc)

    // const chicalc = calcularChiCuadrado(intervalsArray.count, frecuenciasEsperadas)
    // const chicalc = 0
    // console.log(chicalc)
    // setChiCalculado(chicalc);
    // setChiCalculadoMenor(chicalc < parseFloat(jStat.chisquare.inv(0.95, intervalsArray.length-1).toFixed(4)))

    // const kscacl = calcularKS(frecuenciasObservadas, frecuenciasEsperadasKS, randomNumbers.length)
    // console.log(kscacl)
    // setKsCalculado(kscacl)
    // setKsCalculadoMenor(kscacl < parseFloat(1.36/Math.sqrt(randomNumbers.length).toFixed(4)))
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
          <h4>H0: La serie de datos presenta una distribucion uniforme</h4>

          <br />
          <br />
          <h3>Tabla ChiCuadrado</h3>
          <Tabla intervalArray={intervalArrayChi} fe={frecuenciaEsperada}
                  c={c} setChiCalculado={setChiCalculado}/>
            
            
            <div>

      
              Chi calculado: {parseFloat(chiCalculado).toFixed(4)}
              {(chiCalculado < parseFloat(jStat.chisquare.inv(0.95, intervalArrayChi.length-1).toFixed(4)))
                ? "   <   "
                : "   >   "}
              Chi tabulado (α: 0,05 - grados de libertad: {intervalArrayChi.length-1}): {parseFloat(jStat.chisquare.inv(0.95, intervalArrayChi.length-1)).toFixed(4)}    ➙           
              {(chiCalculado < parseFloat(jStat.chisquare.inv(0.95, intervalArrayChi.length-1).toFixed(4)))
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

export default Uniforme;
