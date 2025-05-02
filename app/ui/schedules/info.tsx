'use client';

import { useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { EmployeeField } from '@/app/lib/definitions';
import { themeType } from '@/app/lib/theme';

export default function SchedulesInfo({
  employees,
  userEmail,
  theme,
}: {
  employees: EmployeeField[];
  userEmail: string;
  theme: themeType;
}) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialLoadedImages: Record<string, boolean> = {};

    employees.forEach((employee) => {
      const img = document.getElementById(
        `img-${employee.id}`,
      ) as HTMLImageElement | null;
      if (img?.complete) {
        initialLoadedImages[employee.id] = true;
      }
    });

    setLoadedImages(initialLoadedImages);
  }, [employees]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1
          className={`${lusitana.className} text-2xl font-semibold ${theme.text} md:text-3xl`}
        >
          Horarios de los empleados
        </h1>
      </div>

      <div className="space-y-6">
        {employees.map((employee) => {
          const imageLoaded = loadedImages[employee.id] || false;
          const hasImage = !!employee.image_url;

          return (
            <div
              key={employee.id}
              className={`rounded-lg ${theme.container} p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl`}
            >
              <a
                href={`/dashboard/schedules/${employee.id}`}
                className="block text-blue-600 transition-colors duration-200 hover:text-blue-800"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Imagen + info */}
                  <div className="flex flex-shrink-0 items-center gap-4">
                    <div className="relative aspect-square w-20 md:w-40">
                      {!imageLoaded && hasImage && (
                        <div className="flex h-full w-full animate-pulse items-center justify-center rounded-full bg-gray-200 px-2 text-center text-xs text-gray-500 md:text-base">
                          Cargando...
                        </div>
                      )}
                      {hasImage ? (
                        <img
                          id={`img-${employee.id}`}
                          src={employee.image_url}
                          alt="Vista previa"
                          className={`h-full w-full rounded-full object-cover transition-opacity duration-300 ${
                            imageLoaded ? 'opacity-100' : 'hidden opacity-0'
                          }`}
                          onLoad={() => handleImageLoad(employee.id)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 px-2 text-center text-xs text-gray-500 md:text-base">
                          Sin Foto
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="max-w-[149px] truncate text-sm font-semibold md:max-w-none md:text-lg">
                        {employee.name}
                      </span>
                      <span className="text-xs text-gray-500 md:text-sm">
                        {employee.tipo_empleado}
                      </span>
                    </div>
                  </div>

                  {/* ID */}
                  <div className="text-right text-xs text-gray-500 md:text-sm">
                    ID: {employee.id}
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
