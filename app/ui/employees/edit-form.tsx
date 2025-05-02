'use client';

import {
  ArchiveBoxIcon,
  AtSymbolIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  UserCircleIcon,
  UserIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateEmployee } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { Employee } from '@/app/lib/definitions';
import { themeType } from '@/app/lib/theme';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

export default function EditInvoiceForm({
  employee,
  userEmail,
  theme,
}: {
  employee: Employee;
  userEmail: string;
  theme: themeType;
}) {
  const updateEmployeeWithId = updateEmployee.bind(null, employee.id);
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateEmployeeWithId, initialState);
  const [isGood, setIsGood] = useState(false);
  const router = useRouter();
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success('Empleado actualizado con éxito!');
      setTimeout(() => {
        router.push('/dashboard/employees');
        router.refresh();
      }, 2000);
    }
    if (state?.errors) {
      setIsGood(false);
    }
  }, [state, router]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  if (!employee) return null;

  const hasImage = !!employee.image_url;

  const uploadImage = (file: any) => {
    console.log('Archivo:', file); // Verifica si el archivo está bien

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'piaimage');
    formData.append('folder', 'perfil');
    formData.append('resource_type', 'image');

    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/drn7ynbiq/upload';

    fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.secure_url) {
          console.log('Imagen subida con éxito:', data.secure_url);
          // Usa esta URL para guardarla en tu base de datos o mostrar la imagen
          setFotoBase64(data.secure_url);
        } else {
          console.log('Error al subir la imagen:', data);
        }
      })
      .catch((error) => {
        console.error('Error al subir la imagen:', error);
      });
  };

  // Manejador para el cambio de archivo en un input
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file); // Subir la imagen
    } else {
      setFotoBase64(null); // Si no hay archivo, restablecer la imagen
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGood(true);
    const formData = new FormData(e.currentTarget);
    dispatch(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer theme="colored" />

      <input type="hidden" name="userEmail" value={userEmail} />
      <input type="hidden" name="photo" value={fotoBase64 || ''} />

      <div className={`rounded-md ${theme.container} p-4 md:p-6`}>
        <div className="flex flex-col items-center justify-evenly gap-7 md:flex-row">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className={`text-sm text-gray-500 md:text-base ${theme.title}`}>
              Identificador de empleado: {employee.id}
            </h1>
            <h1 className={`text-sm text-gray-500 md:text-base ${theme.title}`}>
              Fecha de ingreso: {employee.fecha_creado}
            </h1>
          </div>
          <div className="flex items-center justify-center">
            {!imageLoaded && hasImage && (
              <div className="flex h-40 w-40 animate-pulse items-center justify-center rounded-full bg-gray-200 text-gray-500">
                Cargando...
              </div>
            )}
            {!hasImage && (
              <div className="flex h-40 w-40 animate-pulse items-center justify-center rounded-full bg-gray-200 text-gray-500">
                Sin Foto
              </div>
            )}
            {hasImage && (
              <img
                ref={imgRef}
                src={employee.image_url}
                alt="Vista previa"
                className={`h-40 w-40 rounded-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'absolute opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            )}
          </div>
        </div>

        <div className="my-4">
          <label
            htmlFor="employee"
            className={`mb-2 block text-sm font-medium
            ${theme.text}
          `}
          >
            Nombre:
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={employee.name}
              placeholder="Escriba el nombre del empleado"
              className={`peer block w-full rounded-md border 
                py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                ${theme.border} ${theme.bg} ${theme.text}
              `}
              aria-describedby="name-error"
            />
            <UserCircleIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
              -translate-y-1/2 text-gray-500 ${theme.inputIcon}
            `}
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="employee"
            className={`mb-2 block text-sm font-medium
            ${theme.text}
          `}
          >
            RFC:
          </label>
          <div className="relative">
            <input
              id="rfc"
              name="rfc"
              type="text"
              disabled
              defaultValue={employee.rfc}
              readOnly
              placeholder="Escriba el rfc del empleado"
              className={`peer block w-full rounded-md border 
                py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                ${theme.border} ${theme.bg} ${theme.text}
              `}
              aria-describedby="rfc-error"
            />
            <UserCircleIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
              -translate-y-1/2 text-gray-500 ${theme.inputIcon}
            `}
            />
          </div>
          <div id="rfc-error" aria-live="polite" aria-atomic="true">
            {state.errors?.rfc &&
              state.errors.rfc.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="employee"
            className={`mb-2 block text-sm font-medium
            ${theme.text}
          `}
          >
            Telefono:
          </label>
          <div className="relative">
            <input
              id="telefono"
              name="telefono"
              type="text"
              defaultValue={employee.telefono}
              placeholder="Escriba el teléfono del empleado"
              className={`peer block w-full rounded-md border 
                py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                ${theme.border} ${theme.bg} ${theme.text}
              `}
              aria-describedby="telefono-error"
            />
            <UserCircleIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
              -translate-y-1/2 text-gray-500 ${theme.inputIcon}
            `}
            />
          </div>
          <div id="telefono-error" aria-live="polite" aria-atomic="true">
            {state.errors?.telefono &&
              state.errors.telefono.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="employee"
            className={`mb-2 block text-sm font-medium
            ${theme.text}
          `}
          >
            Direccion:
          </label>
          <div className="relative">
            <input
              id="direccion"
              name="direccion"
              type="text"
              defaultValue={employee.direccion}
              placeholder="Escriba la dirección del empleado"
              className={`peer block w-full rounded-md border 
                py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                ${theme.border} ${theme.bg} ${theme.text}
              `}
              aria-describedby="direccion-error"
            />
            <UserCircleIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
              -translate-y-1/2 text-gray-500 ${theme.inputIcon}
            `}
            />
          </div>
          <div id="direccion-error" aria-live="polite" aria-atomic="true">
            {state.errors?.direccion &&
              state.errors.direccion.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label
            htmlFor="amount"
            className={`mb-2 block text-sm font-medium
            ${theme.text}
          `}
          >
            Correo Electronico:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="mail"
                defaultValue={employee.email}
                placeholder="Ingrese el correo electrónico del empleado"
                className={`peer block w-full rounded-md border 
                  py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                  ${theme.border} ${theme.bg} ${theme.text}
                `}
                aria-describedby="email-error"
              />
              <AtSymbolIcon
                className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
                -translate-y-1/2 text-gray-500 peer-focus:text-gray-900
                ${theme.inputIcon}
              `}
              />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="foto"
            className={`mb-2 block text-sm font-medium ${theme.text}`}
          >
            Foto:
          </label>
          <div className="relative flex flex-col items-center gap-7 md:flex-row">
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${theme.border} ${theme.bg} ${theme.text}`}
              aria-describedby="foto-error"
              onChange={handleFileChange}
            />{' '}
            {/* Input para subir la foto top-1/2 -translate-y-1/2 */}
            <div className="relative right-3 flex items-center">
              {fotoBase64 ? (
                <img
                  src={fotoBase64}
                  alt="Vista previa"
                  className="h-20 w-20 rounded-full object-cover md:h-40 md:w-40"
                />
              ) : (
                <UserCircleIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
          </div>
          <div id="foto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.photo &&
              state.errors.photo.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className={`mb-2 block text-sm font-medium ${theme.text}`}>
            Selecciona el tipo de empleado
          </legend>
          <div
            className={`rounded-md border px-[14px] py-3
            ${theme.bg} ${theme.border}
          `}
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center">
                <input
                  id="supervisor"
                  name="tipo_empleado"
                  type="radio"
                  value="Supervisor"
                  defaultChecked={employee.tipo_empleado === 'Supervisor'}
                  className={`h-4 w-4 cursor-pointer 
                    text-gray-600 focus:ring-2 ${theme.container} ${theme.border}
                  `}
                  aria-describedby="tipo_empleado-error"
                />
                <label
                  htmlFor="supervisor"
                  className={`ml-2 flex cursor-pointer items-center gap-1.5 rounded-full 
                  px-3 py-1.5 text-xs font-medium text-gray-600
                    ${theme.container} ${theme.border} ${theme.text}
                  `}
                >
                  Supervisor <UserIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="jefe-de-area"
                  name="tipo_empleado"
                  type="radio"
                  value="Jefe de area"
                  defaultChecked={employee.tipo_empleado === 'Jefe de area'}
                  className={`h-4 w-4 cursor-pointer 
                    text-gray-600 focus:ring-2 ${theme.container} ${theme.border}
                  `}
                  aria-describedby="tipo_empleado-error"
                />
                <label
                  htmlFor="jefe-de-area"
                  className={`ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 ${theme.container} ${theme.border} ${theme.text}`}
                >
                  Jefe de area <HomeModernIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="asistente-de-inventario"
                  name="tipo_empleado"
                  type="radio"
                  value="Asistente de Inventario"
                  defaultChecked={
                    employee.tipo_empleado === 'Asistente de Inventario'
                  }
                  className={`h-4 w-4 cursor-pointer 
                    text-gray-600 focus:ring-2 ${theme.container} ${theme.border}
                  `}
                  aria-describedby="tipo_empleado-error"
                />
                <label
                  htmlFor="asistente-de-inventario"
                  className={`ml-2 flex cursor-pointer items-center gap-1.5 rounded-full 
                  px-3 py-1.5 text-xs font-medium text-gray-600
                    ${theme.container} ${theme.border} ${theme.text}
                  `}
                >
                  Asistente de Inventario <ArchiveBoxIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gerente-de-la-planta-principal"
                  name="tipo_empleado"
                  type="radio"
                  value="Gerente de la planta principal"
                  defaultChecked={
                    employee.tipo_empleado === 'Gerente de la planta principal'
                  }
                  className={`h-4 w-4 cursor-pointer 
                    text-gray-600 focus:ring-2 ${theme.container} ${theme.border}
                  `}
                  aria-describedby="tipo_empleado-error"
                />
                <label
                  htmlFor="gerente-de-la-planta-principal"
                  className={`ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 ${theme.container} ${theme.border} ${theme.text}`}
                >
                  Gerente de la planta principal{' '}
                  <BuildingOffice2Icon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="auxiliar"
                  name="tipo_empleado"
                  type="radio"
                  value="Auxiliar"
                  defaultChecked={employee.tipo_empleado === 'Auxiliar'}
                  className={`h-4 w-4 cursor-pointer 
                    text-gray-600 focus:ring-2 ${theme.container} ${theme.border}
                  `}
                  aria-describedby="tipo_empleado-error"
                />
                <label
                  htmlFor="auxiliar"
                  className={`ml-2 flex cursor-pointer items-center gap-1.5 rounded-full 
                  px-3 py-1.5 text-xs font-medium text-gray-600
                    ${theme.container} ${theme.border} ${theme.text}
                  `}
                >
                  Auxiliar <WrenchIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="tipo_empleado-error" aria-live="polite" aria-atomic="true">
            {state.errors?.tipo_empleado &&
              state.errors.tipo_empleado.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        {state?.message && state?.errors && (
          <p className="mt-2 text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/employees"
          className={`
            flex h-10 items-center rounded-lg px-4 text-sm font-medium 
            transition-colors
            ${theme.container} ${theme.border} ${theme.text}
            ${theme.hoverBg} ${theme.hoverText}
          `}
        >
          Cancel
        </Link>
        <Button
          disabled={isGood}
          className="disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
        >
          {isGood ? 'Actualizando...' : 'Actualizar Empleado'}
        </Button>
      </div>
    </form>
  );
}
