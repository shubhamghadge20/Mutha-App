import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { createFurnaceGatewayThunk } from "@/features/FurnaceGateway";
import { CreateFurnaceGatewayInterface } from "@/types";

interface CreateFurnaceGatewayModalProps {
  open: boolean;
  onClose: () => void;
}

const initialData: CreateFurnaceGatewayInterface = {
  furnaceId: "",
  gatewayMac: "",
};

const CreateFurnaceGatewayModal: React.FC<CreateFurnaceGatewayModalProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null;
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.furnaceGateway);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Partial<CreateFurnaceGatewayInterface>>(
    {}
  );

  const validateForm = () => {
    const newErrors: Partial<CreateFurnaceGatewayInterface> = {};
    if (!formData.furnaceId.trim())
      newErrors.furnaceId = "Furnace ID is required";
    if (!formData.gatewayMac.trim())
      newErrors.gatewayMac = "Gateway MAC is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await dispatch(createFurnaceGatewayThunk(formData));
    if (createFurnaceGatewayThunk.fulfilled.match(result)) {
      setFormData(initialData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-xl max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800 font-serif">
            Create Furnace Gateway
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-10 py-6">
          <div>
            <label
              htmlFor="furnaceId"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Furnace ID
            </label>
            <input
              type="text"
              name="furnaceId"
              id="furnaceId"
              value={formData.furnaceId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.furnaceId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Furnace ID"
            />
            {errors.furnaceId && (
              <p className="text-sm text-red-600 mt-1">{errors.furnaceId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="gatewayMac"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Gateway MAC
            </label>
            <input
              type="text"
              name="gatewayMac"
              id="gatewayMac"
              value={formData.gatewayMac}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.gatewayMac ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="00:A0:C9:14:C8:29"
            />
            {errors.gatewayMac && (
              <p className="text-sm text-red-600 mt-1">{errors.gatewayMac}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFurnaceGatewayModal;
