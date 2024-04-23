import { useState } from 'react';

function TablaNumerosAleatorios({ numerosAleatorios }) {
  const [mostrarRestantes, setMostrarRestantes] = useState(false);

  const mostrarMasNumeros = () => {
    setMostrarRestantes(true);
  };

  return ( 
    <div>
      <table>
        <thead>
          <tr>
            <th>Número Aleatorio</th>
          </tr>
        </thead>
        <tbody>
          {mostrarRestantes
            ? numerosAleatorios.map((numero, index) => (
                <tr key={index}>
                  <td>{numero}</td>
                </tr>
              ))
            : numerosAleatorios.slice(0, 20).map((numero, index) => (
                <tr key={index}>
                  <td>{numero}</td>
                </tr>
              ))}
          {!mostrarRestantes && numerosAleatorios.length > 20 && (
            <tr>
              <td colSpan="1">
                <button onClick={mostrarMasNumeros}>Mostrar restantes</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaNumerosAleatorios;