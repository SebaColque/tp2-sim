import  { useEffect, useState } from 'react';
import FrequencyChart from './components/FrecuencyChart'
import jStat from 'jstat';
import NumberList from './components/NumberList';
import TablaChi from './components/Tabla';
import TablaKS from './components/TablaKS';
import Chart from "chart.js/auto";

function Exponencial() {
  const [media, setMedia] = useState('');
  const [lambda, setLambda] = useState('');
  const [numerosAleatorios, setNumerosAleatorios] = useState([]);
  const [cantIntervalos, setCantIntervalos] = useState(10);
  const [cantIntervalosUser, setCantIntervalosUser] = useState(10);
  const [dataSet, setDataSet] = useState(false);
  const [dataStats, setDataStats] = useState(false);
  const [frecuencias, setFrecuencias] = useState([]);
  const [cantMuestra, setCantMuestra] = useState(10000);
  const [intervalArrayKS, setIntervalArrayKS] = useState();
  const [resultadoPrueba, setResultadoPrueba] = useState(null); // Aceptar o rechazar la hipótesis
  const [chiCuadrado, setChiCuadrado] = useState(null);
  const [chiTabulado, setChiTabulado] = useState(null);
  const [ksCalculado, setKsCalculado] = useState();
  const [ksCalculadoMenor, setKsCalculadoMenor] = useState(false);
  const [c, setC] = useState();
  const [frecuenciaEsperadaKS,setFrecuenciaEsperadaKS] = useState([]);
  const [frecuenciaEsperadaKS2,setFrecuenciaEsperadaKS2] = useState([]);
  const [frecChi, setFrecChi] = useState(
    {
      fo: [],
      fe: []
    }
  );

  const [muestra, setMuestra] = useState(30);
  const handleSampleSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 1000000) {
      
      setMuestra(value);
    }
  };

  useEffect(() => {
    if (numerosAleatorios.length > 0) {
      calcularFrecuencias(numerosAleatorios, cantIntervalos);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numerosAleatorios, cantIntervalos]);

  const generarNumerosAleatorios = (muestra) => {
    if (!media) {
      alert('Por favor ingrese un valor de media.');
      return;
    }

    const lambda = 1 / media;
    setLambda(lambda);
    const nuevosNumerosAleatorios = [];

    for (let i = 0; i < muestra; i++) {
      const x = -Math.log(1 - Math.random()) / lambda; // Función inversa de la distribución exponencial
      nuevosNumerosAleatorios.push(x.toFixed(4)); // Redondeamos a 4 decimales
    }
    setNumerosAleatorios(nuevosNumerosAleatorios);

  };

  const handleChangeMedia = (event) => {
    setMedia(event.target.value);
  };

  const handleChangeIntervalos = (event) => {
    setCantIntervalos(parseInt(event.target.value, 10));
    setCantIntervalosUser(parseInt(event.target.value, 10));
  };

  const handleChangeMuestra = (event) => {
    setCantMuestra(parseInt(event.target.value, 10));
  };

  const calcularFrecuenciasEsperadas = (k, min, max, numeros, lambda) => {
    const amplitud = (max - min) / k;
    const frecEsperadaKS = [];
    for (let i = 0; i < k; i++) {
        let intervaloInicio = min + (i * amplitud);
        let intervaloFin = intervaloInicio + amplitud;

        // Calcular la probabilidad acumulada para los límites del intervalo
        const probInicio = 1 - Math.exp(-lambda * intervaloFin);
        const probFin = 1 - Math.exp(-lambda * intervaloInicio);

        // Frecuencia esperada es la probabilidad del intervalo multiplicada por la cantidad total de números generados
        let frecuenciaEsperada = parseFloat((probInicio - probFin) * numeros.length);

        frecEsperadaKS.push(parseFloat(frecuenciaEsperada.toFixed(2)));
      }
    return frecEsperadaKS;
};


  const calcularFrecuencias = (numeros, k) => {
    const max = numeros.reduce(
      (max, current) => Math.max(max, current),
      -Infinity
    );
    const min = numeros.reduce(
      (min, current) => Math.min(min, current),
      Infinity
    );

    const rango = max - min;
    const amplitud = rango / k;

    const frecuencias = [];
    const frecuenciasKS = [];

    for (let i = 0; i < k; i++) {
      const intervaloInicio = min + i * amplitud - (0.000001);
      const intervaloFin = intervaloInicio + amplitud;

      const frecuencia = numeros.filter((numero) => numero >= intervaloInicio && numero < intervaloFin).length;

      
      
      frecuencias.push({
        intervaloSuperior: parseFloat(intervaloFin.toFixed(2)),
        intervaloInferior: parseFloat(intervaloInicio.toFixed(2)),
        frecuencia: parseFloat(frecuencia)
      });
      frecuenciasKS.push({
        intervalStart :  parseFloat(intervaloInicio.toFixed(2)),
        intervalEnd : parseFloat(intervaloFin.toFixed(2)),
        count: parseFloat(frecuencia)
      });

    }
    // console.log(frecuenciasKS)
    // setIntervalArrayKS(frecuenciasKS);


    const frecuenciasEsperadas = calcularFrecuenciasEsperadas(k, min, max, numeros, lambda);
    const frecuenciasEsperadasKS = calcularFrecuenciasEsperadas(k, min, max, numeros, lambda);
    setFrecuenciaEsperadaKS(frecuenciasEsperadasKS);

    for (let i = 0; i < frecuencias.length - 1; i++) { 
      while (isNaN(frecuenciasEsperadas[i]) || frecuenciasEsperadas[i] < 5) { 
          frecuencias[i + 1].count += parseFloat(frecuencias[i].count); 
          frecuencias[i + 1].intervalStart = frecuencias[i].intervalStart; 
          const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i + 1] + frecuenciasEsperadas[i]).toFixed(2)); 
          frecuenciasEsperadas[i + 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada; 
          frecuencias.splice(i, 1); 
          frecuenciasEsperadas.splice(i, 1); 
          i = 0; 
      } 
      if (i == frecuencias.length - 2) { 
          if (isNaN(frecuenciasEsperadas[frecuencias.length - 1]) || frecuenciasEsperadas[frecuencias.length - 1] < 5) { 
              frecuencias[i + 1].count += parseFloat(frecuencias[i].count); 
              frecuencias[i + 1].intervalStart = frecuencias[i].intervalStart; 
              const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i + 1] + frecuenciasEsperadas[i]).toFixed(2)); 
              frecuenciasEsperadas[i + 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada; 
              frecuencias.splice(i, 1); 
              frecuenciasEsperadas.splice(i, 1); 
              i = 0; 
          } 
      } 
  }

    // for (let i = frecuencias.length - 1; i > 0; i--) {
    //   while (isNaN(frecuenciasEsperadas[i]) || frecuenciasEsperadas[i] < 5) {
    //     frecuencias[i - 1].frecuencia += parseFloat(frecuencias[i].frecuencia);
    //     const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i - 1] + frecuenciasEsperadas[i]).toFixed(2));
    //     frecuenciasEsperadas[i - 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada;
    //     frecuencias.splice(i, 1);
    //     frecuenciasEsperadas.splice(i, 1);
    //     i = frecuencias.length - 1;
    //   }
    // }
    
    const frecuenciasObservadas = frecuencias.map((frecuencia) => frecuencia.frecuencia);

    const stats = {
      count: numeros.length,
      max: max,
      min: min,
      range: rango,
      amplitude: amplitud,
    };
    setDataStats(stats);
    
    setIntervalArrayKS(frecuenciasKS);
    setFrecChi({
      fo: frecuenciasObservadas,
      fe: frecuenciasEsperadas
    });

    drawChart(frecuenciasKS);
    
    const chiCuadrado = calcularChiCuadrado(frecuenciasObservadas, frecuenciasEsperadas);
    const kscacl = calcularKS(frecuenciasObservadas, frecuenciasEsperadasKS, numerosAleatorios.length)
    setKsCalculado(kscacl)
    setKsCalculadoMenor(kscacl < parseFloat(1.36/Math.sqrt(numerosAleatorios.length).toFixed(4)))

    // Determinar el resultado de la prueba
    const gradosLibertad = k - 2;
    const valorCritico = jStat.chisquare.inv(0.95, gradosLibertad); 
    setChiTabulado(valorCritico);
    const resultado = chiCuadrado <= valorCritico ? 'No se rechaza H0' : 'Se rechaza H0';
    setResultadoPrueba(resultado);

    setFrecuencias(frecuencias);
    setChiCuadrado(chiCuadrado);
    calculateStats();
  };

  const calcularChiCuadrado = (observadas, esperadas) => {
    let chiCuadrado = 0;
    let estadistico = [];
    for (let i = 0; i < observadas.length; i++) {
      if (isFinite(esperadas[i])) { // Verificar si es un número válido
        estadistico.push(Math.pow(observadas[i] - esperadas[i], 2) / esperadas[i]);
        chiCuadrado += estadistico[i];
      }
    }
    setC(estadistico);
    return chiCuadrado;
  };
  
  const calculateStats = () => {
    setDataSet(true);
  }



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

  const [myChart, setMyChart] = useState();
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
    <div className='exponencial'>
  <h2>Exponencial</h2>
  <div className='form'>
    <div className='form-group'>
      <label htmlFor="media">Ingrese el valor de la media:</label>
      <input
        type="number"
        id="media"
        value={media}
        onChange={handleChangeMedia}
        placeholder="Media"
      />
    </div>
    <div className='form-group'>
      <label>
        Tamaño de la muestra (hasta 1,000,000):
        <input
          type="number"
          value={muestra}
          onChange={handleSampleSizeChange}
        />
      </label>
    </div>
    <div className='form-group'>
      <label>Seleccionar intervalos:</label>
      <select value={cantIntervalos} onChange={handleChangeIntervalos} className="selectIntervalos">
        <option value="10">10</option>
        <option value="12">12</option>
        <option value="16">16</option>
        <option value="23">23</option>
      </select>
    </div>
  </div>

  <button onClick={() => generarNumerosAleatorios(muestra)}>Generar números aleatorios</button>

  {/* {media && <p>Media ingresada: {media}</p>} */}
  {numerosAleatorios.length > 0 && (
    <div>
      <h3>Números aleatorios generados:</h3>
      <NumberList randomNumbers={numerosAleatorios}/>
      <br />
      {/* <button onClick={calculateStats}>Crear histograma</button> */}
      {dataSet && (
        <div>
          {dataSet && dataStats && (
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
        </div>
      )}
    </div>
  )}


      <div>
        <canvas id="myChart"></canvas>
      </div>
  {numerosAleatorios.length > 0 && dataSet && dataStats && (
    <div>
      <div>
        <div>
          <p>H0: La serie de datos presenta una distribución exponencial</p>
        </div>
        <br />
        <br />
        <h3>Tabla ChiCuadrado</h3>
        <TablaChi
          intervalArray={frecuencias.map(({ intervaloInferior, intervaloSuperior, frecuencia }) => ({
            intervalStart: parseFloat(intervaloInferior.toFixed(4)),
            intervalEnd: parseFloat(intervaloSuperior.toFixed(4)),
            count: parseFloat(frecuencia)
          }))}
          fe={frecChi.fe}
          c={c}
          setChiCalculado={setChiCuadrado}
        />
        <div>
          Chi calculado: {parseFloat(chiCuadrado).toFixed(4)}
          {chiCuadrado < parseFloat(jStat.chisquare.inv(0.95, frecuencias.length - 2).toFixed(4))
            ? "   <   "
            : "   >   "}
          Chi tabulado (α: 0,05 - grados de libertad: {frecuencias.length - 2}): {parseFloat(jStat.chisquare.inv(0.95, frecuencias.length - 2)).toFixed(4)}    ➙
          {chiCuadrado < parseFloat(jStat.chisquare.inv(0.95, frecuencias.length - 2).toFixed(4))
            ? "   No se rechaza la H0"
            : "   Se rechaza la H0"}
        </div>
        <br />
        <br />
        <br />
        <br />
        <h3>Tabla KS</h3>
        <TablaKS
          cantidadDatos={numerosAleatorios.length}
          intervalArray={intervalArrayKS}
          fe={frecuenciaEsperadaKS}
          c={c}
          setKsCalculado={setKsCalculado}
        />
        <div className='chi'>
          <div>
            <h3>KS calculado:</h3>
            <p>{ksCalculado !== null ? parseFloat(ksCalculado).toFixed(4) : 'Calculando...'}</p>
          </div>
          <div>{ksCalculado < parseFloat(1.36 / Math.sqrt(numerosAleatorios.length)).toFixed(4) ? '<' : '>'}</div>
          <div>
            <h3>KS Tabulado (α: 0,05):</h3>
            <p>{parseFloat(1.36 / Math.sqrt(numerosAleatorios.length)).toFixed(4) !== null ? parseFloat(1.36 / Math.sqrt(numerosAleatorios.length)).toFixed(4) : 'Calculando...'}</p>
          </div>
          <h3>Resultado de la prueba:</h3>
          <p>{ksCalculadoMenor ? "   No se rechaza la H0" : "   Se rechaza la H0"}</p>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
  export default Exponencial;