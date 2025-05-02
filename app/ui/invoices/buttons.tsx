import { DocumentTextIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, deleteCustomer, deleteEmployee } from '@/app/lib/actions';
import { themeType } from '@/app/lib/theme';
import { ClipboardDocumentListIcon } from '@heroicons/react/20/solid';
import { Button } from '../button';
import { use, useEffect } from 'react';
import { toast } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { on } from 'events';
import { Invoice } from '@/app/lib/definitions';
import { fetchFilteredInvoices } from '@/app/lib/data';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-800 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Factura</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ 
  id,
  disabled,
  theme 
}: 
{ 
  id: string;
  disabled: boolean;
  theme: themeType
}) {

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      event.preventDefault();
    }
  };
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      onClick={handleClick}
      aria-disabled={disabled} className={`rounded-md border p-2 
        ${disabled ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 
        `${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText} ${theme.hoverBorder}`}`}
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}



export function ViewDetailsInvoices({ 
  id,
  onOpen,
  theme 
}: 
{ 
  id: string;
  onOpen: (id: string) => void;
  theme: themeType
}) {
  return (
    
    <button className={`btn-generate-pdf rounded-md border p-2
      ${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText}
      ${theme.hoverBorder}`} onClick={() => onOpen(id)}>
      <DocumentTextIcon className="w-5" />     
    </button>
  );
}



export function DeleteInvoice({ 
  id,
  disabled,
  theme, 
  data,
}: 
{ 
  id: string;
  disabled: boolean;
  theme: themeType;
  data: any[];

}) {
  const router = useRouter(); // Recargar la página para reflejar los cambios.

  // const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  const handleDelete = async () => {
    try {
      // Lógica para eliminar la factura.
      await deleteInvoice(id); // Asegúrate de que deleteInvoice sea una función asíncrona que elimine la factura.
      
      // const updatedInvoices = await fetchFilteredInvoices(data[0], data[1], data[2]); // Actualiza la lista de facturas después de eliminar una.
      // setInvoices(updatedInvoices);
  
      // Mostrar una alerta de éxito.
      toast.success('Factura eliminada con éxito');
      router.refresh(); // Recargar la página para reflejar los cambios.
    } catch (error) {
      // Manejar errores y mostrar una alerta de error.
      toast.error('Error al eliminar la factura');
    }
  };



  return (
    // <form action={deleteInvoiceWithId}>
      <button onClick={handleDelete} disabled={disabled} className={`rounded-md border p-2 
      ${disabled ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 
      `${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText} ${theme.hoverBorder}`}`}>
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    // </form>
  );
}


export function CreateEmployee() {
  return (
    <Link
      href="/dashboard/employees/create"
      className="flex h-10 items-center rounded-lg bg-blue-800 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Empleado</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateEmployee({ 
  id,
  disabled,
  theme 
}: 
{ 
  id: string;
  disabled: boolean;
  theme: themeType
}) {

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      event.preventDefault();
    }
  };
  
  return (
    <Link
      href={`/dashboard/employees/${id}/edit`}
      onClick={handleClick}
      aria-disabled={disabled} className={`rounded-md border p-2 
        ${disabled ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 
        `${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText} ${theme.hoverBorder}`}`}
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


export function ViewDetailsEmployee({ 
  id,
  onOpen,
  theme 
}: 
{ 
  id: string;
  onOpen: (id: string) => void;
  theme: themeType
}) {
  return (
    
    <button className={`rounded-md border p-2
      ${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText}
      ${theme.hoverBorder}`} onClick={() => onOpen(id)}>
      <DocumentTextIcon className="w-5" />     
    </button>
  );
}


export function DeleteEmployee({ 
  id,
  disabled,
  theme 
}: 
{ 
  id: string;
  disabled: boolean;
  theme: themeType
}) {
  // const deleteEmployeeWithId = deleteEmployee.bind(null, id);
  const router = useRouter(); // Recargar la página para reflejar los cambios.

  const handleDelete = async () => {
    try {
      // Lógica para eliminar la factura.
      await deleteEmployee(id); // Asegúrate de que deleteInvoice sea una función asíncrona que elimine la factura.
      
      // const updatedInvoices = await fetchFilteredInvoices(data[0], data[1], data[2]); // Actualiza la lista de facturas después de eliminar una.
      // setInvoices(updatedInvoices);
  
      // Mostrar una alerta de éxito.
      toast.success('Empleado eliminado con éxito');
      router.refresh(); // Recargar la página para reflejar los cambios.

    } catch (error) {
      // Manejar errores y mostrar una alerta de error.
      toast.error('Error al eliminar el empleado');
    }
  };

 
  return (
    // <form action={deleteEmployeeWithId}>
      <button onClick={handleDelete} disabled={disabled} className={`rounded-md border p-2 
      ${disabled ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 
      `${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText} ${theme.hoverBorder}`}`}>
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    // </form>
  );
}

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-800 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Cliente</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ 
  id,
  disabled,   
  theme 
}: 
{ 
  id: string;
  disabled: boolean;   
  theme: themeType
}) {

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      event.preventDefault();
    }
  };

  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      onClick={handleClick}
      aria-disabled={disabled} className={`rounded-md border p-2 
      ${disabled ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 
      `${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText} ${theme.hoverBorder}`}`}
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


export function ViewDetailsCustomer({ 
  id,
  onOpen,
  theme 
}: 
{ 
  id: string;
  onOpen: (id: string) => void;
  theme: themeType
}) {
  return (
    
    <button className={`rounded-md border p-2
      ${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText}
      ${theme.hoverBorder}`} onClick={() => onOpen(id)}>
      <DocumentTextIcon className="w-5" />     
    </button>
  );
}


export function DeleteCustomer({ 
  id,
  disabled,
  theme 
}: 
{ 
  id: string;
  disabled: boolean;
  theme: themeType
}) {
  // const deleteCustomerWithId = deleteCustomer.bind(null, id);
  const router = useRouter(); // Recargar la página para reflejar los cambios.

  const handleDelete = async () => {
    try {
      // Lógica para eliminar la factura.
      await deleteCustomer(id); // Asegúrate de que deleteInvoice sea una función asíncrona que elimine la factura.
      
      // const updatedInvoices = await fetchFilteredInvoices(data[0], data[1], data[2]); // Actualiza la lista de facturas después de eliminar una.
      // setInvoices(updatedInvoices);
  
      // Mostrar una alerta de éxito.
      toast.success('Cliente eliminado con éxito');
      router.refresh(); // Recargar la página para reflejar los cambios.
    } catch (error) {
      // Manejar errores y mostrar una alerta de error.
      toast.error('Error al eliminar el cliente.');
    }
  };

 
  return (
    // <form action={deleteCustomerWithId}>
      <button onClick={handleDelete} disabled={disabled} className={`rounded-md border p-2 
      ${disabled ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 
      `${theme.border} ${theme.text} ${theme.hoverBg} ${theme.hoverText} ${theme.hoverBorder}`}`}>
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    // </form>
  );
}