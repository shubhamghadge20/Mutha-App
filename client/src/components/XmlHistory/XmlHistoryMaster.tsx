import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchXmlHistoryThunk,
  selectComparison,
  deleteXmlHistoryThunk,
  setLimit,
  setPage,
  setStartDate,
  setEndDate,
} from "@/features/xmlhistory/xmlhistorySlice";
import type { RootState } from "@/store";
import XmlComparisonDetails from "./XmlComparisonDetails";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";
import AlertModal from "@/components/@/ui/AlertModal";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import advancedFormat from "dayjs/plugin/advancedFormat";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

const formatToDisplayDate = (date: string) => dayjs(date).format("DD-MM-YYYY");
const formatToDisplayTime = (date: string) => dayjs(date).format("hh:mm A");

const XmlHistoryMaster = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    loading,
    selected,
    error,
    limit,
    page,
    totalPages,
    startDate,
    endDate,
  } = useAppSelector((state: RootState) => state.xmlhistory);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [product, setProduct] = useState<string | undefined>(undefined);

  const uniqueProducts = Array.from(
    new Set(data.map((record) => record.selectedProduct).filter(Boolean))
  );

  useEffect(() => {
    const startTimestamp = startDate ? dayjs(startDate).valueOf() : undefined;
    const endTimestamp = endDate ? dayjs(endDate).valueOf() : undefined;

    dispatch(
      fetchXmlHistoryThunk({
        product,
        page,
        limit,
        startTime: startTimestamp,
        endTime: endTimestamp,
      })
    );
  }, [dispatch, page, limit, startDate, endDate, product]);

  useEffect(() => {
    if (!endDate) {
      const now = new Date();
      dispatch(setEndDate(now.toISOString()));
    }
  }, [dispatch, endDate]);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirm = () => {
    if (deleteId) {
      dispatch(deleteXmlHistoryThunk(deleteId));
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setDeleteId(null);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLimit(Number(e.target.value)));
    dispatch(setPage(1));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(setPage(page + 1));
    }
  };

  const safeStartDate = startDate
    ? dayjs(startDate).startOf("minute")
    : dayjs().startOf("day");
  const safeEndDate = endDate
    ? dayjs(endDate).endOf("minute")
    : dayjs().endOf("day");

  const filteredData = data.filter((record: XmlComparisonHistoryItem) => {
    const recordDateTime = dayjs(record.date);
    return (
      recordDateTime.isSameOrAfter(safeStartDate) &&
      recordDateTime.isSameOrBefore(safeEndDate)
    );
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("MachinWise Comparison History Report", 14, 20);

    const columns = [
      "#",
      "Sample ID",
      "Furnace ID",
      "Product",
      "Date",
      "Time",
      "Status",
    ];

    const rows = filteredData.map((record, index) => {
      const isUnlocked = record.comparisonResults.every((r) => r.inTolerance);
      return [
        String(index + 1 + (page - 1) * limit),
        String(record.sampleName),
        String(record.selectedFurnace || "N/A"),
        String(record.selectedProduct || "N/A"),
        String(formatToDisplayDate(record.date)),
        String(formatToDisplayTime(record.date)),
        isUnlocked ? "Unlocked" : "Locked",
      ];
    });

    autoTable(doc, {
      startY: 30,
      head: [columns],
      body: rows,
      styles: { fontSize: 10 },
    });

    const fileName = `MachineWise_Interlocking_History_${safeStartDate.format(
      "DD-MM-YYYY"
    )}_to_${safeEndDate.format("DD-MM-YYYY")}.pdf`;
    doc.save(fileName);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!data || !Array.isArray(data))
    return <p className="p-4">No history data found.</p>;

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-6xl mx-auto relative">
        <div className="bg-white p-6 rounded-lg shadow transition duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">XML Comparison History</h2>
          </div>

          {error && (
            <div className="mb-4 text-red-600 font-semibold">{error}</div>
          )}

          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={(date: Date | null) =>
                  dispatch(setStartDate(date ? date.toISOString() : ""))
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd-MM-yyyy HH:mm"
                className="border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={(date: Date | null) =>
                  dispatch(setEndDate(date ? date.toISOString() : ""))
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd-MM-yyyy HH:mm"
                className="border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <select
                value={product || ""}
                onChange={(e) => {
                  setProduct(e.target.value || undefined);
                  dispatch(setPage(1));
                }}
                className="border px-3 py-2 rounded"
              >
                <option value="">All</option>
                {uniqueProducts.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="px-3 py-3 ml-auto bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Download PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Sample ID</th>
                  <th className="p-3 border-b">Furnace ID</th>
                  <th className="p-3 border-b">Product</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Time</th>
                  <th className="p-3 border-b">View</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record, index) => {
                  const lockStatus = record.lockStatus;
                  return (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50 border-t text-center transition"
                    >
                      <td className="p-3">{index + 1 + (page - 1) * limit}</td>
                      <td className="p-3">{record.sampleName}</td>
                      <td className="p-3">{record.selectedFurnace || "N/A"}</td>
                      <td className="p-3">{record.selectedProduct || "N/A"}</td>
                      <td className="p-3">
                        {formatToDisplayDate(record.date)}
                      </td>
                      <td className="p-3">
                        {formatToDisplayTime(record.date)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => dispatch(selectComparison(record))}
                          className="text-blue-600 underline hover:text-blue-800 transition"
                        >
                          Report
                        </button>
                      </td>
                      <td
                        className={`p-3 font-medium ${
                          lockStatus === "Unlocked"
                            ? "text-green-600"
                            : lockStatus === "Locked"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {record.lockStatus}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => confirmDelete(record._id)}
                          className="text-red-600 underline hover:text-red-800 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>

            <div className="flex items-center space-x-2 ml-auto">
              <label htmlFor="rows" className="text-sm font-medium">
                Show:
              </label>
              <select
                id="rows"
                value={limit}
                onChange={handleLimitChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[10, 25, 50, 100, 500].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <span className="text-sm font-medium">rows</span>
            </div>
          </div>
        </div>

        {selected && <XmlComparisonDetails />}

        <AlertModal
          open={!!deleteId}
          message="Are you sure you want to delete this record?"
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default XmlHistoryMaster;
