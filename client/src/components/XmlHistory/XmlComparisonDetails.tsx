import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { clearSelected } from "@/features/xmlhistory/xmlhistorySlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const XmlComparisonDetails = () => {
  const dispatch = useAppDispatch();
  const { selected } = useAppSelector((state) => state.xmlhistory);

  if (!selected) return null;

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Sample Report - ${selected.sampleName}`, 14, 20);

    const tableData = selected.comparisonResults.map((item) => [
      item.itemName,
      `[${item.lowertolerance} - ${item.uppertolerance}]`,
      item.resultValue,
      item.inTolerance ? "OK" : "Not OK",
    ]);

    autoTable(doc, {
      head: [["Item Name", "Expected Range", "Reported Value", "Status"]],
      body: tableData,
      startY: 30,
    });

    doc.save(`${selected.sampleName}_report.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sample Details - {selected.sampleName}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPdf}
              className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Download PDF
            </button>
            <button
              onClick={() => dispatch(clearSelected())}
              className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3 border-b">Item Name</th>
                <th className="p-3 border-b">Expected Range</th>
                <th className="p-3 border-b">Reported Value</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {selected.comparisonResults.map((item, idx) => {
                const resultNum = Number(item.resultValue);
                const lowerNum = Number(item.lowertolerance);
                const upperNum = Number(item.uppertolerance);

                let rowBgClass = "";
                if (resultNum > upperNum) {
                  rowBgClass = "bg-red-100";
                } else if (resultNum < lowerNum) {
                  rowBgClass = "bg-blue-100";
                } else {
                  rowBgClass = "bg-green-100";
                }

                return (
                  <tr
                    key={idx}
                    className={`${rowBgClass} hover:bg-gray-50 border-t text-center transition`}
                  >
                    <td className="p-3">{item.itemName}</td>
                    <td className="p-3">
                      [{item.lowertolerance} - {item.uppertolerance}]
                    </td>
                    <td className="p-3">{item.resultValue}</td>
                    <td
                      className={`p-3 font-semibold ${
                        item.inTolerance ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.inTolerance ? "OK" : "Not OK"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default XmlComparisonDetails;
