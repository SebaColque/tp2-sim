/* eslint-disable react/prop-types */
function Tabla({frecuencias}) {
    return ( 

        <table>
        <thead>
          <tr>
            <th>Lim. Inferior</th>
            <th>Lim. Superior</th>
            <th>Frecuencia</th>
          </tr>
        </thead>
        <tbody>
          {frecuencias.map((frecuencia, index) => (
            <tr key={index}>
              <td>{frecuencia.intervaloInferior}</td>
              <td>{frecuencia.intervaloSuperior}</td>
              <td>{frecuencia.frecuencia}</td>
            </tr>
          ))}
        </tbody>
      </table>

     );
}

export default Tabla;