import { NextRequest, NextResponse } from 'next/server';
import { Server } from 'socket.io';
import { sql } from '@vercel/postgres';

let io: Server | null = null;

export async function GET(req: NextRequest) {
  if (!io) {
    const server = (req as any).socket?.server || (global as any).server;
    console.log('Iniciando servidor WebSocket...');

    io = new Server(server, {
      path: '/api/socket',
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('Cliente WebSocket conectado');

      socket.on(
        'send-location',
        async (truckId, invoiceId, employeeId, location) => {
          console.log(
            `Recibido: Ubicación para el camión ${truckId}:`,
            location,
            `Venta ID: ${invoiceId}`,
          );

          try {
            // Verifica si los parámetros son correctos
            console.log('Parametros de la base de datos:', {
              truckId,
              invoiceId,
              employeeId,
              location,
            });

            // Guardar en la base de datos
            const result = await sql`
            INSERT INTO locations (truck_id, invoice_id, employee_id, latitude, longitude, timestamp)
            VALUES (${truckId}, ${invoiceId}, ${employeeId}, ${location.latitude}, ${location.longitude}, NOW())
            RETURNING *;
          `;
            console.log(
              'Ubicación guardada en la base de datos:',
              result.rows[0],
            );

            // Emitir la ubicación a todos los clientes
            io?.emit('update-location', { truckId, location });
          } catch (error) {
            console.error(
              'Error guardando ubicación en la base de datos:',
              error,
            );
          }
        },
      );

      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });

    console.log('Servidor WebSocket iniciado correctamente');
  }

  return NextResponse.json({ message: 'WebSocket conectado' });
}
