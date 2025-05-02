"use client";

import React, { useState } from "react";
import { Employee } from "@/app/lib/definitions";

export function EmployeeDetailsModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!employee) return null;
  
  const hasImage = !!employee.image_url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 md:m-4 md:w-1/3 rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
        <h2 className="mb-4 text-lg font-bold">Detalles del empleado</h2>
        <p>
          <strong>Nombre:</strong> {employee.name}
        </p>
        <p>
          <strong>Email:</strong> {employee.email}
        </p>
        <p>
          <strong>RFC:</strong> {employee.rfc}
        </p>
        <p>
          <strong>Domicilio:</strong> {employee.direccion}
        </p>
        <p>
          <strong>Telefono:</strong> {employee.telefono}
        </p>
        <p>
          <strong>Tipo de empleado:</strong> {employee.tipo_empleado}
        </p>
        <p>
          <strong>Total de facturas realizadas:</strong> {employee.total_invoices}
        </p>
        <p>
          <strong>Fecha de ingreso:</strong> {employee.fecha_creado.toLocaleString()}
        </p>

        <div className="flex items-center justify-center mt-4">
          {!imageLoaded && hasImage && (
            <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 animate-pulse">
              Cargando...
            </div>
          )}
          {!hasImage && (
            <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 animate-pulse">
              Sin Foto
            </div>
          )}
          {hasImage && (
            <img
              src={employee.image_url}
              alt="Vista previa"
              className={`w-40 h-40 rounded-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0 absolute"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            )
          }
        </div>

        <div className="mt-4 flex justify-start">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-800 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
