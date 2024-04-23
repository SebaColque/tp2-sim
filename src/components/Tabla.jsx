function Tabla({frecuencias, fe}) {
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
          {frecuencias.map((frecuencia, index) => (
            <tr key={index}>
                <td>{index}</td>
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