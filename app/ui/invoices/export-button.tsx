'use client';
import { Button } from '../button';

export default function ExportButton() {
  const handleExportar = async () => {
    try {
      const response = await fetch('/api/export-excel', {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Error al exportar el reporte');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_factura-${new Date().toLocaleString('es-ES', {
        hour12: false,
      })}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar el reporte', error);
    }
  };

  return (
    <Button onClick={handleExportar}>Exportar Reporte Factura Excel</Button>
  );
}
