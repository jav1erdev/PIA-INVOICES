import darkTheme from '@/app/lib/dark-theme';
import { fetchEmployeesAll, getUser } from '@/app/lib/data';
import { lightTheme, systemDefault, themeType } from '@/app/lib/theme';
import SchedulesInfo from '@/app/ui/schedules/info';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { auth } from '@/auth';
import { Suspense } from 'react';

export const metadata = {
  title: 'Horarios de los empleados',
};

export default async function SchedulesPage() {
  const session = await auth();
  const userEmail = session?.user?.email!;
  const user = await getUser(userEmail);
  const employees = await fetchEmployeesAll();

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
    <Suspense fallback={<InvoicesTableSkeleton theme={theme} />}>
      <SchedulesInfo employees={employees} userEmail={userEmail} theme={theme} />
    </Suspense>
  );
}

