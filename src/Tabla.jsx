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
              <td>{frecuencia.intervalStart}</td>
              <td>{frecuencia.intervalEnd}</td>
              <td>{frecuencia.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

     );
}

export default Tabla;