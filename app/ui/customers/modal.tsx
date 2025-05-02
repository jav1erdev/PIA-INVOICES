"use client";

import React from "react";
import { Customer } from "@/app/lib/definitions";

export function CustomerDetailsModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 md:m-4 md:w-1/3 rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
        <h2 className="mb-4 text-lg font-bold">Detalles del cliente</h2>
        <p>
          <strong>Nombre:</strong> {customer.name}
        </p>
        <p>
          <strong>Correo Electrónico:</strong> {customer.email}
        </p>
        <p>
          <strong>RFC:</strong> {customer.rfc}
        </p>
        <p>
          <strong>Direccion:</strong> {customer.direccion}
        </p>
        <p>
          <strong>Telefono:</strong> {customer.telefono}
        </p>
        <p>
          <strong>Tipo de cliente:</strong> {customer.tipo_cliente}
        </p>
        <p>
          <strong>Fecha de ingreso:</strong> {customer.fecha_creado.toLocaleString()}
        </p>
        <div className="mt-4">
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
