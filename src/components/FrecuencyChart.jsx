/* eslint-disable react/prop-types */
import  { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const FrequencyChart = ({ numbers, intervals }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      // Si ya hay un gráfico, destrúyelo antes de crear uno nuevo
      chartInstance.current.destroy();
    }

    // Calcular los límites de los intervalos
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const intervalSize = (max - min) / intervals;
    let frequencies = Array(intervals).fill(0);

    // Contar la frecuencia de números en cada intervalo
    numbers.forEach(num => {
      const index = Math.floor((num - min) / intervalSize);
      frequencies[index]++;
    });

    // Configurar los datos para el gráfico
    const labels = [];
    for (let i = 0; i < intervals; i++) {
      const lowerBound = min + i * intervalSize;
      const upperBound = min + (i + 1) * intervalSize;
      labels.push(`${lowerBound.toFixed(2)} - ${upperBound.toFixed(2)}`);
    }

    const data = {
      labels: labels,
      datasets: [{
        label: 'Frecuencia',
        data: frequencies,
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Color de las barras
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde de las barras
        borderWidth: 1
      }]
    };

    // Configurar opciones del gráfico
    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    // Crear el gráfico
    const ctx = chartContainer.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });

    // Devolver una función para destruir el gráfico cuando el componente se desmonte
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [numbers, intervals]);

  return <canvas ref={chartContainer} />;
};

export default FrequencyChart;
