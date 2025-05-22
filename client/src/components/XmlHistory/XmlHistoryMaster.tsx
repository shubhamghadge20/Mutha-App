import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchXmlHistoryThunk,
  selectComparison,
} from "@/features/xmlhistory/xmlhistorySlice";
import type { RootState } from "@/store";
import XmlComparisonDetails from "./XmlComparisonDetails";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";

const XmlHistoryMaster = () => {
  const dispatch = useAppDispatch();
  const { data, loading, selected } = useAppSelector(
    (state: RootState) => state.xmlhistory
  );

  useEffect(() => {
    dispatch(fetchXmlHistoryThunk());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!data || !Array.isArray(data))
    return <p className="p-4">No history data found.</p>;

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">XML Comparison History</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Sample ID</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Action</th>
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
                    <td
                      className={`p-3 font-medium ${
                        isUnlocked ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isUnlocked ? "Unlocked" : "Locked"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => dispatch(selectComparison(record))}
                        className="text-blue-600 underline hover:text-blue-800 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && <XmlComparisonDetails />}
      </div>
    </div>
  );
};

export default XmlHistoryMaster;
