import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages, getUser } from '@/app/lib/data';
import { Metadata } from 'next'; 
import { auth } from '@/auth';
import { darkTheme, defaultTheme, lightTheme, systemDefault, themeType } from '@/app/lib/theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoicesServerTable from '@/app/ui/invoices/servertable';
import ExportButton from '@/app/ui/invoices/export-button';

export const metadata: Metadata = {
  title: 'Facturas',
};
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const session = await auth();
  const userEmail = session?.user?.email!;

  const totalPages = await fetchInvoicesPages(query, userEmail);

  const user = await getUser(userEmail);
  let theme: themeType;

  switch(user.theme) {
    case 'system':
      theme = systemDefault;
      break;
    case 'dark':
      theme = darkTheme;
      break;
    case 'light':
      theme = lightTheme;
      break;
  }

  return (
    <div className="w-full">
      <ToastContainer theme="colored" />

      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl ${theme?.title || defaultTheme.title}`}>Facturas</h1>
        </div>
        <ExportButton />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar facturas (por Id, Estado, Fecha de creacion, Nombre del Cliente o Correo Electronico del Cliente)..." theme={theme || defaultTheme} />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton theme={theme || defaultTheme} />}>
        <InvoicesServerTable query={query} currentPage={currentPage} theme={theme || defaultTheme} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} theme={theme || defaultTheme} />
      </div>
    </div>
  );
}