// FurnaceGatewayMaster.tsx
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaNetworkWired } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  getFurnaceGatewaysThunk,
  deleteFurnaceGatewayThunk,
  getFurnaceGatewayThunk,
} from "@/features/FurnaceGateway";
import { FurnaceGateway } from "@/types";
import CreateFurnaceGatewayModal from "./CreateFurnaceGatewayModal";
import UpdateFurnaceGatewayModal from "./UpdateFurnaceGatewayModal";
import AlertModal from "../@/ui/AlertModal";

const FurnaceGatewayMaster = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.furnaceGateway);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<FurnaceGateway | null>(
    null
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    dispatch(getFurnaceGatewaysThunk());
  }, [dispatch]);

  const handleEdit = async (id: string) => {
    await dispatch(getFurnaceGatewayThunk(id))
      .unwrap()
      .then((gateway) => {
        setSelectedGateway(gateway);
        setUpdateModalOpen(true);
      });
  };

  const onDelete = (id: string) => {
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      dispatch(deleteFurnaceGatewayThunk(selectedId));
      setShowAlert(false);
      setSelectedId(null);
    }
  };

  return (
    <>
      <AlertModal
        open={showAlert}
        message="Are you sure you want to delete this gateway?"
        onClose={() => {
          setShowAlert(false);
          setSelectedId(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <CreateFurnaceGatewayModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <UpdateFurnaceGatewayModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        gatewayData={selectedGateway}
      />

      <div className="max-w-7xl mx-auto my-10 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-md rounded-t-xl">
          <h2 className="text-3xl font-bold text-white font-serif tracking-wide">
            Furnace Gateway Management
          </h2>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 text-white font-semibold rounded-lg px-5 py-2 transition"
          >
            <FaNetworkWired className="w-4 h-4" />
            Add Gateway
          </button>
        </div>

        {loading && (
          <p className="p-6 text-stone-500 italic text-center">
            Loading furnace gateways...
          </p>
        )}

        {!loading && list?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-md font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-md font-semibold text-gray-700">
                    Furnace ID
                  </th>
                  <th className="px-6 py-4 text-left text-md font-semibold text-gray-700">
                    Gateway MAC
                  </th>
                  <th className="px-6 py-4 text-left text-md font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((gateway, index) => (
                  <tr
                    key={gateway.id}
                    className="even:bg-gray-50 hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-800 text-sm">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-800 text-sm">
                      {gateway.furnaceId}
                    </td>
                    <td className="px-6 py-4 text-gray-800 text-sm">
                      {gateway.gatewayMac}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(gateway.id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                          aria-label={`Edit gateway ${gateway.furnaceId}`}
                        >
                          <FaEdit className="w-5 h-5 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => onDelete(gateway.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                          aria-label={`Delete gateway ${gateway.furnaceId}`}
                        >
                          <FaTrashAlt className="w-5 h-5 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className="px-8 py-10 text-center text-stone-500 text-sm italic">
              No furnace gateways found. Please add one.
            </p>
          )
        )}
      </div>
    </>
  );
};

export default FurnaceGatewayMaster;
