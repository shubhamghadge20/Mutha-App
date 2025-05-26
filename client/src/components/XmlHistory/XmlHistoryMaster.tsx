import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchXmlHistoryThunk,
  selectComparison,
  deleteXmlHistoryThunk,
} from "@/features/xmlhistory/xmlhistorySlice";
import type { RootState } from "@/store";
import XmlComparisonDetails from "./XmlComparisonDetails";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";
import AlertModal from "../@/ui/AlertModal";

const XmlHistoryMaster = () => {
  const dispatch = useAppDispatch();
  const { data, loading, selected, error } = useAppSelector(
    (state: RootState) => state.xmlhistory
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchXmlHistoryThunk());
  }, [dispatch]);

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

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Sample ID</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Time</th>
                  <th className="p-3 border-b">View</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record: XmlComparisonHistoryItem, index: number) => {
                  const dateObj = new Date(record.date);
                  const isUnlocked = record.comparisonResults.every(
                    (r) => r.inTolerance
                  );

                  return (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50 border-t text-center transition"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{record.sampleName}</td>
                      <td className="p-3">{dateObj.toLocaleDateString()}</td>
                      <td className="p-3">{dateObj.toLocaleTimeString()}</td>
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
                          isUnlocked ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isUnlocked ? "Unlocked" : "Locked"}
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
