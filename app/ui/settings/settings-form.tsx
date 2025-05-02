'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import { updateTheme } from '@/app/lib/actions';
import { Button } from '../button';
import { User } from '@/app/lib/definitions';
import { themeType } from '@/app/lib/theme';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';

export default function Form({
  user,
  theme,
}: {
  user: User;
  theme: themeType;
}) {

    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(updateTheme, initialState);
    const [isGood, setIsGood] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (state?.success) {
        toast.success('Tema actualizado con éxito!');
        setIsGood(false);
        router.refresh();
      }
      if (state?.errors) {
        setIsGood(false);
      }
    }, [state, router]);

    
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGood(true);
    const formData = new FormData(e.currentTarget);
    dispatch(formData);
  };


  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer theme="colored" />
      
      <input type="hidden" name="user-email" value={user.email} />
      <div className={`rounded-md ${theme.container} p-4 md:p-6`}>
        <div className="mb-4">
          <label
            htmlFor="theme"
            className={`mb-2  block text-sm font-medium
            ${theme.text}
          `}
          >
            Elige un tema:
          </label>
          <div className="relative">
            <select
              id="theme"
              name="theme"
              className={`peer block w-full cursor-pointer rounded-md border 
                py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                ${theme.border} ${theme.bg} ${theme.text}
              `}
              defaultValue={user.theme}
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a theme
              </option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            {!user.theme || user.theme == 'system' ? (
              <>
                <SunIcon
                  className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
                  -translate-y-1/2 text-gray-500 ${theme.inputIcon}
                  `}
                />
                <MoonIcon
                  className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
                  -translate-y-1/2 text-gray-500 ${theme.inputIcon}
                  `}
                />
              </>
            ) : user.theme == 'dark' ? (
              <>
                <MoonIcon
                  className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
                    -translate-y-1/2 text-gray-500 ${theme.inputIcon}
                    `}
                />
              </>
            ) : (
              <>
                <SunIcon
                  className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] 
                    -translate-y-1/2 text-gray-500 ${theme.inputIcon}
                    `}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          disabled={isGood}
          className="disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
        >
          {isGood ? 'Actualizando...' : 'Actualizar Configuracion'}
        </Button>
      </div>
    </form>
  );
}
