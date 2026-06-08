import ExcelJS from 'exceljs';

export const exportToExcel = async (salaries, workers) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Salary Records');

  // Define columns
  worksheet.columns = [
    { header: 'Worker Name', key: 'workerName', width: 20 },
    { header: 'Mobile Number', key: 'mobile', width: 15 },
    { header: 'Working Days', key: 'workingDays', width: 15 },
    { header: 'Total Salary', key: 'totalSalary', width: 15 },
    { header: 'Advance', key: 'advance', width: 15 },
    { header: 'Final Salary', key: 'finalSalary', width: 15 },
  ];

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2563EB' },
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Add data rows
  salaries.forEach((salary) => {
    const worker = workers.find((w) => w.id === salary.workerId);
    worksheet.addRow({
      workerName: worker ? worker.name : 'Unknown',
      mobile: worker ? worker.mobile : '-',
      workingDays: salary.workingDays,
      totalSalary: salary.totalSalary,
      advance: salary.advance,
      finalSalary: salary.finalSalary,
    });
  });

  // Style data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = { horizontal: 'center', vertical: 'middle' };
      row.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Salary_Records_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
};