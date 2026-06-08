import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;
const today = () => new Date().toISOString().split('T')[0];

export const exportWorkerPDF = (worker, salaries) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Worker Details', 14, 20);
  doc.setFontSize(11);
  doc.text(`Name: ${worker.name}`, 14, 32);
  doc.text(`Mobile: ${worker.mobile}`, 14, 40);
  doc.text(`Joining Date: ${worker.joiningDate || 'N/A'}`, 14, 48);
  doc.text(`Status: ${worker.status || 'Active'}`, 14, 56);

  doc.setFontSize(14);
  doc.text('Salary History', 14, 70);

  const workerSalaries = salaries.filter((salary) => salary.workerId === worker.id);
  const tableData = workerSalaries.map((salary, index) => [
    index + 1,
    salary.workingDays,
    formatMoney(salary.totalSalary),
    formatMoney(salary.advance),
    formatMoney(salary.finalSalary),
    salary.acStatus || 'Pending',
  ]);

  autoTable(doc, {
    startY: 76,
    head: [['#', 'Working Days', 'Total Salary', 'Advance', 'Final Salary', 'A/C Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`${worker.name.replace(/\s+/g, '_')}_Details.pdf`);
};

export const exportMonthlyPDF = (salaries, workers) => {
  const doc = new jsPDF('landscape');

  doc.setFontSize(18);
  doc.text('Monthly Salary Report', 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);

  const tableData = salaries.map((salary, index) => {
    const worker = workers.find((item) => item.id === salary.workerId);
    return [
      index + 1,
      worker ? worker.name : 'Unknown',
      salary.workingDays,
      formatMoney(salary.totalSalary),
      formatMoney(salary.advance),
      formatMoney(salary.finalSalary),
      salary.acStatus || 'Pending',
    ];
  });

  const totalSalary = salaries.reduce((sum, salary) => sum + Number(salary.totalSalary || 0), 0);
  const totalAdvance = salaries.reduce((sum, salary) => sum + Number(salary.advance || 0), 0);
  const totalFinal = salaries.reduce((sum, salary) => sum + Number(salary.finalSalary || 0), 0);

  autoTable(doc, {
    startY: 34,
    head: [['#', 'Worker Name', 'Working Days', 'Total Salary', 'Advance', 'Final Salary', 'Payment Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    foot: [['', '', '', formatMoney(totalSalary), formatMoney(totalAdvance), formatMoney(totalFinal), '']],
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
  });

  doc.save(`Monthly_Salary_Report_${today()}.pdf`);
};

export const exportFullDatabasePDF = (workers, salaries) => {
  const doc = new jsPDF('landscape');

  doc.setFontSize(18);
  doc.text('Complete Salary Database', 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);
  doc.text(`Total Workers: ${workers.length}`, 14, 36);
  doc.text(`Total Records: ${salaries.length}`, 80, 36);

  doc.setFontSize(14);
  doc.text('All Workers', 14, 48);

  const workerTableData = workers.map((worker, index) => [
    index + 1,
    worker.name,
    worker.mobile,
    worker.joiningDate || 'N/A',
    worker.status || 'Active',
  ]);

  autoTable(doc, {
    startY: 54,
    head: [['#', 'Name', 'Mobile', 'Joining Date', 'Status']],
    body: workerTableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
  });

  const finalY = (doc.lastAutoTable?.finalY || 54) + 10;
  doc.setFontSize(14);
  doc.text('All Salary Records', 14, finalY);

  const salaryTableData = salaries.map((salary, index) => {
    const worker = workers.find((item) => item.id === salary.workerId);
    return [
      index + 1,
      worker ? worker.name : 'Unknown',
      salary.workingDays,
      formatMoney(salary.totalSalary),
      formatMoney(salary.advance),
      formatMoney(salary.finalSalary),
      salary.acStatus || 'Pending',
      salary.confirm || 'No',
    ];
  });

  autoTable(doc, {
    startY: finalY + 6,
    head: [['#', 'Worker Name', 'Working Days', 'Total Salary', 'Advance', 'Final Salary', 'A/C Status', 'Confirm']],
    body: salaryTableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`Full_Database_${today()}.pdf`);
};
