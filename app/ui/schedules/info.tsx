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
  employees: EmployeeField[],
  userEmail: string,
  theme: themeType,
}) {
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialLoadedImages: Record<string, boolean> = {};
      
        employees.forEach((employee) => {
          const img = document.getElementById(`img-${employee.id}`) as HTMLImageElement | null;
          if (img?.complete) {
            initialLoadedImages[employee.id] = true;
          }
        });
      
        setLoadedImages(initialLoadedImages);
      }, [employees]);
      
    
    const handleImageLoad = (id: string) => {
      setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`${lusitana.className} text-2xl md:text-3xl font-semibold text-gray-800`}>
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
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
            >
              <a
                href={`/dashboard/schedules/${employee.id}`}
                className="block text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Imagen + info */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="relative w-20 md:w-40 aspect-square">
                      {!imageLoaded && hasImage && (
                        <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-center px-2 animate-pulse text-xs md:text-base">
                          Cargando...
                        </div>
                      )}
                      {hasImage ? (
                        <img
                          id={`img-${employee.id}`}
                          src={employee.image_url}
                          alt="Vista previa"
                          className={`w-full h-full rounded-full object-cover transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "hidden opacity-0"
                          }`}
                          onLoad={() => handleImageLoad(employee.id)
                        }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs md:text-base text-center px-2">
                          Sin Foto
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="text-sm md:text-lg font-semibold truncate max-w-[149px] md:max-w-none">
                        {employee.name}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">{employee.tipo_empleado}</span>
                    </div>
                  </div>

                  {/* ID */}
                  <div className="text-xs md:text-sm text-gray-500 text-right">
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
