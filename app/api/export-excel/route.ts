import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { fetchFilteredInvoices, fetchRevenue, fetchCardData, fetchAllCustomersExportExcel, fetchAllEmployeesExportExcel, fetchAllInvoicesByEmailGroupedByMonth } from '@/app/lib/data';
import { auth } from '@/auth';
import { formatCurrency } from '@/app/lib/utils';
import { table } from 'console';

export async function POST(req: Request) {
  
    async function fetchImageBuffer(imageUrl: string): Promise<Buffer> {
        const res = await fetch(imageUrl);
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
  
    try {
    const { image } = await req.json();
    const session = await auth();
    const email = session?.user?.email!;
    const revenueData = await fetchRevenue();
    const invoices = await fetchFilteredInvoices('', 1, email);
    const cardData = await fetchCardData(email);
    const employees = await fetchAllEmployeesExportExcel(email);
    const customers = await fetchAllCustomersExportExcel(email);




    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte General');

    // 🏷️ TÍTULO CENTRAL
    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `📊 Reporte General de Actividad - ${new Date().toLocaleString("es-ES", { hour12: true })}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.addRow([]);

    // 📋 RESUMEN GENERAL
    sheet.addRow(['Resumen General']);
    const resumenHeader = sheet.getRow(sheet.lastRow!.number);
    resumenHeader.font = { bold: true };
    resumenHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };

    sheet.addRow(['Total Facturas', cardData.numberOfInvoices]);
    sheet.addRow(['Total Clientes', cardData.numberOfCustomers]);
    sheet.addRow(['Dinero Generado', cardData.totalPaidInvoices]);
    sheet.addRow(['Dinero Pendiente', cardData.totalPendingInvoices]);
    sheet.addRow([]);

    // 📈 INGRESOS POR MES
    sheet.addRow([`Ingresos por mes del Año - ${new Date().getFullYear()}`]);
    const ingresosHeader = sheet.getRow(sheet.lastRow!.number);
    ingresosHeader.font = { bold: true };
    ingresosHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2EFDA' },
    };

    sheet.addRow(['Mes', 'Ingreso']);
    revenueData.forEach(({ month, revenue }) => {
      sheet.addRow([month, formatCurrency(revenue)]);
    });
    sheet.addRow([]);

    // 🧾 FACTURAS
    sheet.addRow(['Facturas']);
    const facturasHeader = sheet.getRow(sheet.lastRow!.number);
    facturasHeader.font = { bold: true };
    facturasHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFCE4D6' },
    };

    sheet.addRow(['ID', 'Cliente', 'Email', 'Fecha Creación', 'Fecha Pago', 'Total', 'Estado']);
    const columnHeader = sheet.getRow(sheet.lastRow!.number);
    columnHeader.font = { bold: true };

    invoices.forEach((inv) => {
      sheet.addRow([
        inv.id_tmp,
        inv.name,
        inv.email,
        inv.fecha_creado,
        inv.fecha_para_pagar,
        formatCurrency(inv.amount),
        inv.status,
      ]);
    });

    // 📌 Insertar título de la gráfica
    sheet.addRow([]);
    sheet.addRow(['Gráfica de Ingresos por Mes']);
    const graficoHeader = sheet.getRow(sheet.lastRow!.number);
    graficoHeader.font = { bold: true };
    graficoHeader.alignment = { vertical: 'middle', horizontal: 'center' };
    graficoHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFAAF2BC' },
    };
    sheet.mergeCells(`A${graficoHeader.number}:F${graficoHeader.number}`);

    // 🖼️ Insertar imagen al final
    if (image && image.startsWith('data:image/png;base64,')) {
      const base64Data = image.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      });

      const rowAfter = sheet.lastRow!.number + 1;

      sheet.addImage(imageId, {
        tl: { col: 1, row: rowAfter },
        ext: { width: 600, height: 300 },
      });
    }
    // 📏 Ajustes de columnas
    // sheet.columns.forEach((col) => {
    //   let max = 10;
    //   col.eachCell?.({ includeEmpty: true }, (cell) => {
    //     max = Math.max(max, String(cell.value).length + 2);
    //   });
    //   col.width = max;
    // });
    sheet.columns.forEach((col, index) => {
        
        let custom_Width;
        
        if (index === 0) custom_Width = 22; // Ajusta el ancho de la columna 4 a 20
        if (index === 2) custom_Width = 35; // Ajusta el ancho de la columna 4 a 20
        if (index === 3) custom_Width = 17; // Ajusta el ancho de la columna 6 a 15
        if (index === 4) custom_Width = 17; // Ajusta el ancho de la columna 6 a 15
        if (index === 5) custom_Width = 35; // Ajusta el ancho de la columna 6 a 15
        
        if (custom_Width) {
            col.width = custom_Width;
        } else {
            let max = 10;

            col.eachCell?.({ includeEmpty: true }, (cell) => {
            const val = String(cell.value ?? '');
            max = Math.max(max, val.length + 2);
            });
        col.width = Math.min(max, 40); // Limita a 40 como máximo
        }
    });


    // HOJA EMPLEADOS
    const sheetEmp = workbook.addWorksheet('Empleados');
    sheetEmp.mergeCells('A1:J1');
    sheetEmp.getCell('A1').value = '📋 Lista de Empleados';
    sheetEmp.getCell('A1').font = { size: 14, bold: true };
    sheetEmp.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    sheetEmp.addRow([]);

    sheetEmp.addRow([
    'ID', 'Nombre', 'Email', 'RFC', 'Dirección', 'Teléfono', 'Tipo',
    'Fecha de Registro', 'Total Facturas', 'Foto'
    ]);
    const empHeader = sheetEmp.getRow(3);
    empHeader.font = { bold: true };
    empHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCE5FF' }, // Azul suave
    };
    empHeader.alignment = { vertical: 'middle', horizontal: 'center' };
    sheetEmp.autoFilter = {
    from: {
        row: 3,
        column: 1
    },
    to: {
        row: 3,
        column: 10
    }
    };

    employees.forEach((emp) => {
    const row = sheetEmp.addRow([
        emp.id,
        emp.name,
        emp.email,
        emp.rfc,
        emp.direccion,
        emp.telefono,
        emp.tipo_empleado,
        emp.fecha_creado,
        emp.total_invoices,
        emp.image_url && emp.image_url.startsWith('http') ? "" : 'Sin Imagen',
    ]);
    row.alignment = { vertical: 'middle', horizontal: 'justify' };

        if (emp.image_url && emp.image_url.startsWith('http')) {
            const imageBuffer = fetchImageBuffer(emp.image_url);
            const imageId = workbook.addImage({
                buffer: imageBuffer,
                extension: 'png',
            });
            const rowIndex = row.number - 1; // Obtener el índice de la fila actual
            sheetEmp.addImage(imageId, {
                tl: { col: 9, row: rowIndex },
                ext: { width: 100, height: 100 },
                editAs: 'oneCell',
            });
        }
    });

    sheetEmp.eachRow((row, rowNumber) => {
        if (rowNumber >= 4) { // Ignorar la fila de encabezado
            row.height = 80; // Ajusta la altura de cada fila a 50
        }
    });
    
    sheetEmp.columns.forEach((col, index) => {
      
      let custom_Width;
      
      
      if (custom_Width) {
        col.width = custom_Width;
      } else {
        let max = 10;
        
        col.eachCell?.({ includeEmpty: true }, (cell) => {
          const val = String(cell.value ?? '');
          max = Math.max(max, val.length + 2);
        });
        col.width = Math.min(max, 40); // Limita a 40 como máximo
      }
    });
    
    // HOJA CLIENTES
    const sheetCli = workbook.addWorksheet('Clientes');
    sheetCli.mergeCells('A1:I1');
    sheetCli.getCell('A1').value = '📋 Lista de Clientes';
    sheetCli.getCell('A1').font = { size: 14, bold: true };
    sheetCli.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    sheetCli.addRow([]);
    
    sheetCli.addRow([
      'ID', 'Nombre', 'Email', 'RFC', 'Dirección', 'Teléfono',
      'Tipo', 'Fecha de Registro', 'Total Facturas'
    ]);
    const cliHeader = sheetCli.getRow(3);
    cliHeader.font = { bold: true };
    cliHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF2CC' }, // Amarillo suave
    };
    cliHeader.alignment = { vertical: 'middle', horizontal: 'center' };
    sheetCli.autoFilter = {
      from: {
        row: 3,
        column: 1
      },
      to: {
        row: 3,
        column: 9
      }
    };
    
    customers.forEach((cli) => {
      const row = sheetCli.addRow([
        cli.id,
        cli.name,
        cli.email,
        cli.rfc,
        cli.direccion,
        cli.telefono,
        cli.tipo_cliente,
        cli.fecha_creado,
        cli.total_invoices
      ]);
      row.alignment = { vertical: 'middle', horizontal: 'justify' };
    });

    sheetCli.eachRow((row, rowNumber) => {
        if (rowNumber >= 4) { // Ignorar la fila de encabezado
            row.height = 80; // Ajusta la altura de cada fila a 50
        }
    });
    
    sheetCli.columns.forEach((col, index) => {
      
      let custom_Width;
      
      
      if (custom_Width) {
        col.width = custom_Width;
      } else {
        let max = 10;
        
        col.eachCell?.({ includeEmpty: true }, (cell) => {
          const val = String(cell.value ?? '');
            max = Math.max(max, val.length + 2);
            });
        col.width = Math.min(max, 40); // Limita a 40 como máximo
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="reporte_general.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error al generar Excel:', error);
    return NextResponse.json({ error: 'Error al generar el reporte' }, { status: 500 });
  }
}


export async function GET() {
  
    try {
    const session = await auth();
    const email = session?.user?.email!;
    const revenueData = await fetchRevenue();
    const cardData = await fetchCardData(email);
    const invoicesByMonth = await fetchAllInvoicesByEmailGroupedByMonth(email);



    const workbook = new ExcelJS.Workbook();
    const sheetFacturas = workbook.addWorksheet('Reporte Factura');
    sheetFacturas.mergeCells('A1:G1');
    sheetFacturas.getCell('A1').value = `🧾 Reporte de Factura - ${new Date().toLocaleString("es-ES", { hour12: true })}`;
    sheetFacturas.getCell('A1').font = { size: 16, bold: true };
    sheetFacturas.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    sheetFacturas.addRow([]);

    // 📋 RESUMEN GENERAL
    sheetFacturas.addRow(['Resumen General']);
    const resumenHeader = sheetFacturas.getRow(sheetFacturas.lastRow!.number);
    resumenHeader.font = { bold: true };
    resumenHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };

    sheetFacturas.addRow(['Total Facturas', cardData.numberOfInvoices]);
    sheetFacturas.addRow(['Dinero Generado', cardData.totalPaidInvoices]);
    sheetFacturas.addRow(['Dinero Pendiente', cardData.totalPendingInvoices]);
    sheetFacturas.addRow([]);

    // 📈 INGRESOS POR MES
    sheetFacturas.addRow([`Ingresos por mes del Año - ${new Date().getFullYear()}`]);
    const ingresosHeader = sheetFacturas.getRow(sheetFacturas.lastRow!.number);
    ingresosHeader.font = { bold: true };
    ingresosHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2EFDA' },
    };

    sheetFacturas.addRow(['Mes', 'Ingreso']);
    revenueData.forEach(({ month, revenue }) => {
      sheetFacturas.addRow([month, formatCurrency(revenue)]);
    });
    sheetFacturas.addRow([]);




    // HOJA FACTURAS POR MES
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Ordenar meses de forma descendente
    const fecha = new Date()
    const currentYear = fecha.getFullYear();
    const currentMonth = fecha.getMonth();

    let filterApplied = false;

    for (let n = currentMonth; n >= 0; n--) {
      const month = n + 1;
      const monthStr = String(month).padStart(2, '0');
      const key = `${currentYear}-${monthStr}`;
      const title = `${monthNames[n]} ${currentYear}`;
    

      sheetFacturas.addRow([title]);
      const monthHeader = sheetFacturas.getRow(sheetFacturas.lastRow!.number);
      monthHeader.font = { size: 15, bold: true };
      monthHeader.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' },
      };
      sheetFacturas.mergeCells(`A${monthHeader.number}:G${monthHeader.number}`);

      if (!invoicesByMonth[key] || invoicesByMonth[key].length === 0) {
        sheetFacturas.addRow(['No hay facturas registradas en este mes']);
        const emptyRow = sheetFacturas.getRow(sheetFacturas.lastRow!.number);
        emptyRow.font = { italic: true };
        emptyRow.alignment = { vertical: 'middle', horizontal: 'center' };
        sheetFacturas.mergeCells(`A${emptyRow.number}:G${emptyRow.number}`);

      } else {
        sheetFacturas.addRow(['ID', 'Cliente', 'Email', 'Fecha Creación', 'Fecha Pago', 'Total', 'Estado']);
        const tableHeader = sheetFacturas.getRow(sheetFacturas.lastRow!.number);
        tableHeader.font = { bold: true };
        tableHeader.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFCE4D6' },
        };

        if (!filterApplied){

          sheetFacturas.autoFilter = {
            from: {
              row: tableHeader.number,
              column: 1
            },
            to: {
              row: tableHeader.number,
              column: 7
            }
          };
          
          filterApplied = true
          
        }
        
        invoicesByMonth[key].forEach(inv => {
          sheetFacturas.addRow([
            inv.id_tmp,
            inv.name,
            inv.email,
            inv.fecha_creado,
            inv.fecha_para_pagar,
            formatCurrency(inv.amount),
            inv.status,
          ]);
        });
      }
      sheetFacturas.addRow([]); // Espacio entre meses
    }

    sheetFacturas.columns.forEach((col, index) => {
        
      let custom_Width;
      
      if (index === 0) custom_Width = 22; // Ajusta el ancho de la columna 4 a 20
      if (index === 2) custom_Width = 35; // Ajusta el ancho de la columna 4 a 20
      if (index === 3) custom_Width = 17; // Ajusta el ancho de la columna 6 a 15
      if (index === 4) custom_Width = 17; // Ajusta el ancho de la columna 6 a 15
      if (index === 5) custom_Width = 35; // Ajusta el ancho de la columna 6 a 15
      
      if (custom_Width) {
          col.width = custom_Width;
      } else {
          let max = 10;

          col.eachCell?.({ includeEmpty: true }, (cell) => {
          const val = String(cell.value ?? '');
          max = Math.max(max, val.length + 2);
          });
      col.width = Math.min(max, 40); // Limita a 40 como máximo
      }
    });



    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="reporte_factura.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error al generar Excel:', error);
    return NextResponse.json({ error: 'Error al generar el reporte' }, { status: 500 });
  }
}
