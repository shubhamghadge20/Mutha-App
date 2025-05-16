import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchXmlCompareThunk,
  clearXmlData,
  XmlCompareDataItem,
} from "@/features/xml/xmlSlice";

const XmlMaster: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.xml);

  useEffect(() => {
    dispatch(fetchXmlCompareThunk());

    return () => {
      dispatch(clearXmlData());
    };
  }, [dispatch]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        Error: {error}{" "}
        <button
          onClick={() => dispatch(fetchXmlCompareThunk())}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="text-center py-10">No XML comparison data available.</div>
    );

  return (
    <div className="overflow-x-auto max-w-full p-4">
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Product Name</th>
            <th className="border px-4 py-2 text-left">Item Name</th>
            <th className="border px-4 py-2 text-right">DB Value</th>
            <th className="border px-4 py-2 text-right">XML Value</th>
            <th className="border px-4 py-2 text-right">Difference</th>
            <th className="border px-4 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: XmlCompareDataItem, idx) => (
            <tr
              key={idx}
              className={
                item.status === "Mismatch"
                  ? "bg-yellow-100"
                  : item.status === "Match"
                  ? "bg-green-100"
                  : item.status === "Line Not Found in XML" ||
                    item.status === "Result Value Not Found"
                  ? "bg-red-100"
                  : ""
              }
            >
              <td className="border px-4 py-2">{item.productName}</td>
              <td className="border px-4 py-2">{item.itemName}</td>
              <td className="border px-4 py-2 text-right">
                {item.dbValue !== null ? item.dbValue.toFixed(3) : "-"}
              </td>
              <td className="border px-4 py-2 text-right">
                {item.xmlValue !== null ? item.xmlValue.toFixed(3) : "-"}
              </td>
              <td className="border px-4 py-2 text-right">
                {item.difference !== null ? item.difference.toFixed(3) : "-"}
              </td>
              <td className="border px-4 py-2 text-center">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default XmlMaster;
