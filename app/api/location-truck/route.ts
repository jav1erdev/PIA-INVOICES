import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude, truckId } = await req.json();

    if (!latitude || !longitude || !truckId) {
      return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO locations (latitude, longitude, truck_id, timestamp) 
      VALUES (${latitude}, ${longitude}, ${truckId}, NOW()) 
      RETURNING *`;

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error guardando ubicación', error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await sql`
      SELECT * FROM locations ORDER BY timestamp DESC`;

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error obteniendo ubicaciones', error: error.message },
      { status: 500 },
    );
  }
}
