import { useEffect, useState } from "react";

function TablaKS({cantidadDatos, intervalArray, fe, setKsCalculado}) {

    let maximoPrimeraLista = 0;

    const [observadoAcumulado, setObservadoAcumulado] = useState([]);
    const [esperadoAcumulado, setEsperadoAcumulado] = useState([]);
    const [diferenciaPoPe, setDiferenciaPoPe] = useState([]);
    // console.log(intervalArray, fe)
    useEffect(() => {
      if (intervalArray) {
        const poacumulada = [];
        let oacumulado = 0;
        intervalArray.forEach((interval, index) => {
            oacumulado += interval.count/cantidadDatos;
          poacumulada.push(oacumulado.toFixed(4));
        });
        setObservadoAcumulado(poacumulada);

        const peacumulada = [];
        let eacumulado = 0;
        fe.forEach((frecuencia, index) => {
            eacumulado += frecuencia/cantidadDatos;
            peacumulada.push(eacumulado.toFixed(4));
        });
        setEsperadoAcumulado(peacumulada);

        const diferenciaPoPeArray = []
        poacumulada.forEach((p, index) => {
            diferenciaPoPeArray.push(Math.abs(poacumulada[index]-peacumulada[index]))
        })
        setDiferenciaPoPe(diferenciaPoPeArray)

      }
    }, [cantidadDatos, fe, intervalArray]);
    


    return ( 
        <table>
        <thead>
          <tr>
            <th>Intervalos</th>
            <th>Lim. Inferior</th>
            <th>Lim. Superior</th>
            <th>Fo</th>
            <th>Fe</th>
            <th>Po</th>
            <th>Pe</th>
            <th>Po(AC)</th>
            <th>Pe(AC)</th>
            <th>|Po(AC)-Pe(AC)|</th>
            <th>Max</th>
          </tr>
        </thead>
        <tbody>
          {observadoAcumulado && intervalArray.map((interval, index) => {
            maximoPrimeraLista = Math.max(maximoPrimeraLista, parseFloat(diferenciaPoPe[index]).toFixed(4));
            if(index === intervalArray.length -1){
              setKsCalculado(maximoPrimeraLista.toFixed(4))
            }
            return (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{interval.intervalStart}</td>
              <td>{interval.intervalEnd}</td>
              <td>{interval.count}</td>
              <td>{parseFloat(fe[index]).toFixed(4)}</td>
              <td>{parseFloat(interval.count/cantidadDatos).toFixed(4)}</td>
              <td>{parseFloat(fe[index]/cantidadDatos).toFixed(4)}</td>
              <td>{observadoAcumulado[index]}</td>
              <td>{esperadoAcumulado[index]}</td>
              <td>{parseFloat(diferenciaPoPe[index]).toFixed(4)}</td>
              {index === intervalArray.length -1
              ?
              <td style={{backgroundColor: "blue"}}>{maximoPrimeraLista.toFixed(4)}</td>
              :
              <td>{maximoPrimeraLista.toFixed(4)}</td>
              }
            </tr>
            )
        })}
        </tbody>
      </table>

     );
}

export default TablaKS;