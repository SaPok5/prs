import { jsPDF } from "jspdf";
import { ArrowDownToLine } from "lucide-react";

function ExportButton({ rows }: { rows: Array<{ [key: string]: any }> }) {
    const exportToPDF = () => {
        if (!rows.length) return;

        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Set the font
        doc.setFont("helvetica", "normal");

        // Add a title or any content
        doc.text("Commission Table", 14, 10);

        // Create the table header
        const headers = Object.keys(rows[0]);
        const headerY = 20; // Y-coordinate for header
        headers.forEach((header, index) => {
            doc.text(header, 14 + index * 40, headerY);
        });

        // Create the table rows
        rows.forEach((row, rowIndex) => {
            const y = headerY + 10 + rowIndex * 10;
            headers.forEach((header, colIndex) => {
                doc.text(String(row[header]), 14 + colIndex * 40, y);
            });
        });

        // Save the PDF
        doc.save("table-data.pdf");
    };

    return (
        <div className="relative">
            <button
                onClick={exportToPDF}
                className="flex items-center bg-white text-blue-500 px-3 py-1.5 hover:bg-gray-200 rounded-[10px] border border-blue-300"
            >
                <ArrowDownToLine className="mr-2 text-3xl text-blue-500" />
                <p className="text-lg font-bold text-blue-500">Export to PDF</p>
            </button>
        </div>
    );
}

export default ExportButton;
