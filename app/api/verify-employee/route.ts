import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import * as faceapi from 'face-api.js';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { format } from 'date-fns';

const canvas = require('canvas');

const modelPath = path.join(process.cwd(), 'models');
let modelsLoaded = false;
faceapi.env.monkeyPatch({ Image: canvas.Image, Canvas: canvas.Canvas });

interface Employee {
  id: number;
  descriptor: Float32Array;
}

let employeeCache: Employee[] = [];

async function loadModels() {
  if (!modelsLoaded) {
    console.log('Cargando modelos...');
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    ]);
    modelsLoaded = true;
    console.log('Modelos cargados en memoria');
  }
}
loadModels();

async function loadEmployeeCache() {
  console.log('Precargando empleados en cache...');
  const employees =
    await sql`SELECT id, face_descriptor FROM employees WHERE face_descriptor IS NOT NULL`;
  employeeCache = employees.rows.map((emp) => ({
    id: emp.id,
    descriptor: new Float32Array(Object.values(emp.face_descriptor)),
  }));
  console.log(`Cache cargado con ${employeeCache.length} empleados`);
}
loadEmployeeCache();

function compareFaceDescriptors(
  inputDescriptor: Float32Array,
  dbDescriptor: Float32Array,
) {
  const distance = faceapi.euclideanDistance(inputDescriptor, dbDescriptor);
  return distance < 0.6;
}

async function handleWorkSchedule(
  action: string,
  employeeId: number,
  now: string,
) {
  if (action === 'entry') {
    const existingEntry =
      await sql`SELECT * FROM work_schedules WHERE employee_id = ${employeeId} AND check_out IS NULL`;
    if (existingEntry.rows.length > 0) {
      return { status: 400, message: '⚠️ Ya existe una entrada sin salida' };
    }
    await sql`INSERT INTO work_schedules (employee_id, date, check_in, status) VALUES (${employeeId}, ${
      now.split(' ')[0]
    }, ${now}, 'En proceso')`;
    return {
      status: 200,
      message: `✅ Entrada registrada para empleado ${employeeId}`,
    };
  }
  if (action === 'exit') {
    const entryRecord =
      await sql`SELECT * FROM work_schedules WHERE employee_id = ${employeeId} AND check_out IS NULL`;
    if (entryRecord.rows.length === 0) {
      return {
        status: 400,
        message: '⚠️ No hay entrada registrada o ya se ha registrado la salida',
      };
    }
    await sql`UPDATE work_schedules SET check_out = ${now}, status = 'Completado' WHERE employee_id = ${employeeId} AND check_out IS NULL`;
    return {
      status: 200,
      message: `✅ Salida registrada para empleado ${employeeId}`,
    };
  }
  return { status: 400, message: '⚠️ Acción no reconocida' };
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, action } = await req.json();
    if (!imageBase64 || !action) {
      return NextResponse.json(
        { message: '⚠️ Faltan datos requeridos' },
        { status: 400 },
      );
    }

    const now = new Date();
    const formattedDate = format(now, 'MM/dd/yyyy HH:mm:ss'); // "02/14/2025 14:24:37"

    console.log('Convirtiendo imagen Base64...');
    const base64Data = imageBase64.replace(
      /^data:image\/(png|jpeg);base64,/,
      '',
    );
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const image = await loadImage(imageBuffer);

    console.log('Detectando rostro en la imagen...');
    const detections = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      console.error('❌ No se detectó ningún rostro.');
      return;
    }

    console.log('✅ Rostro detectado con éxito', detections);

    if (!detections || !detections.descriptor) {
      return NextResponse.json(
        { message: '❌ No se detectó una cara válida' },
        { status: 400 },
      );
    }

    const inputFaceDescriptor = new Float32Array(detections.descriptor);
    const matchedEmployee = employeeCache.find((emp) =>
      compareFaceDescriptors(inputFaceDescriptor, emp.descriptor),
    );

    if (!matchedEmployee) {
      return NextResponse.json(
        { message: '❌ No se encontró coincidencia facial' },
        { status: 400 },
      );
    }

    const result = await handleWorkSchedule(
      action,
      matchedEmployee.id,
      formattedDate,
    );
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  } catch (error: any) {
    console.error('Error en el proceso:', error);
    return NextResponse.json(
      {
        message: '❌ Error al registrar la entrada/salida',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
