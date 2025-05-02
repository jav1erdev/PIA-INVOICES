import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next'; 
import { auth } from '@/auth';
import { getUser } from '@/app/lib/data';
import { darkTheme, defaultTheme, lightTheme, systemDefault, themeType } from '@/app/lib/theme';
import { Button } from '@/app/ui/button';
import ExportButton from '@/app/ui/dashboard/export-button';

export const metadata: Metadata = {
  title: 'Inicio',
};
export default async function Page() {
  const session = await auth();
const userEmail = session?.user?.email!;
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
    <main>
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl ${theme?.title || defaultTheme.title}`}>
            Inicio
          </h1>
        </div>
        <ExportButton />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton theme={theme || defaultTheme} />}>
          <CardWrapper theme={theme || defaultTheme} />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton theme={theme || defaultTheme} />}>
          <RevenueChart theme={theme || defaultTheme}  />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton theme={theme || defaultTheme} />}>
          <LatestInvoices theme={theme || defaultTheme}  />
        </Suspense>
      </div>
    </main>
  );
}