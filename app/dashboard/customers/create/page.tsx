import { getUser } from '@/app/lib/data';
import { darkTheme, lightTheme, systemDefault, themeType } from '@/app/lib/theme';
import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { auth } from '@/auth';
import { Metadata } from 'next'; 

export const metadata: Metadata = {
  title: 'Crear Cliente',
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
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          {
            label: 'Crear Cliente',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
        theme={theme}
      />
      <Form userEmail={userEmail} theme={theme}/>
    </main>
  );
}