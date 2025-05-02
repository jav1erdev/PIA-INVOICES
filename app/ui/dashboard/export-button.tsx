'use client';
import { Button } from "../button";
import { toPng } from 'html-to-image';

export default function ExportButton() {
  const handleExportar = async () => {
    const chartElement = document.querySelector('#revenue-chart');

    if (!chartElement) {
      console.error('No se encontró el gráfico');
      return;
    }

    try {
      const image = await toPng(chartElement as HTMLElement);

      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        console.error('Error al exportar el reporte');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_general-${new Date().toLocaleString("es-ES", { hour12: false })}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar imagen del gráfico', error);
    }
  };

  return (
    <Button onClick={handleExportar}>Exportar Reporte General Excel</Button>
  );
}
