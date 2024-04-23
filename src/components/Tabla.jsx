import { useEffect, useState } from "react";
import './Table.css'

function Tabla({intervalArray, fe, c}) {


  const [acumulado, setAcumulado] = useState([]);
  useEffect(() => {
    if (c) {
      const cAc = [];
      let acumulado = 0;
      for (let i = 0; i < c.length; i++) {
        acumulado += c[i];
        cAc.push(acumulado.toFixed(4));
      }
      setAcumulado(cAc);
    }
  }, [c])

    return ( 
        <table>
        <thead>
          <tr>
            <th>Intervalos</th>
            <th>Lim. Inferior</th>
            <th>Lim. Superior</th>
            <th>Fo</th>
            <th>Fe</th>
            <th>C</th>
            <th>C(AC)</th>
          </tr>
        </thead>
        <tbody>
          {acumulado && intervalArray.map((interavl, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{interavl.intervalStart}</td>
              <td>{interavl.intervalEnd}</td>
              <td>{interavl.count}</td>
              <td>{parseFloat(fe[index]).toFixed(4)}</td>
              <td>{parseFloat(c[index]).toFixed(4)}</td>
              {index === intervalArray.length -1
              ?
              <td style={{backgroundColor: "red"}}>{parseFloat(acumulado[index]).toFixed(4)}</td>
              :
              <td>{parseFloat(acumulado[index]).toFixed(4)}</td>
              }
            </tr>
          ))}
        </tbody>
      </table>

     );
}

export default Tabla;