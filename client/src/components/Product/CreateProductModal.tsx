import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { CreateProductInterface, ProductItem } from "@/types";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { createProductThunk } from "@/features/product";

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
}

interface ErrorsInterface {
  name?: string;
  items?: string;
  [key: string]: string | undefined;
}

const initialItem: ProductItem = {
  name: "",
  value: 0,
  uppertolerance: 0,
  lowertolerance: 0,
};

const initialData: CreateProductInterface = {
  name: "",
  items: [initialItem],
};

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateProductInterface>(initialData);
  const [errors, setErrors] = useState<Partial<ErrorsInterface>>({});

  const validateForm = () => {
    const newErrors: Partial<ErrorsInterface> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.items.length)
      newErrors.items = "At least one item is required";

    formData.items.forEach((item, index) => {
      if (!item.name.trim())
        newErrors[`itemName_${index}`] = `Item ${index + 1}: Name is required`;
      if (item.value === undefined || isNaN(item.value))
        newErrors[`itemValue_${index}`] = `Item ${
          index + 1
        }: Value is required`;
      if (item.uppertolerance === undefined || isNaN(item.uppertolerance))
        newErrors[`itemUpper_${index}`] = `Item ${
          index + 1
        }: Upper tolerance is required`;
      if (item.lowertolerance === undefined || isNaN(item.lowertolerance))
        newErrors[`itemLower_${index}`] = `Item ${
          index + 1
        }: Lower tolerance is required`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleItemChange = (
    index: number,
    field: keyof ProductItem,
    value: string
  ) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      const parsedValue =
        field === "name" ? value : value === "" ? "" : Number(value);
      newItems[index] = { ...newItems[index], [field]: parsedValue };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem }],
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(createProductThunk(formData)).unwrap();
      onClose();
      navigate("/product");
    } catch (error: any) {
      toast.error(error?.message || "Creation failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="px-4 py-4 border-b bg-green-100 rounded-t-lg">
          <h2 className="text-xl font-bold text-stone-800 font-serif">
            Create Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-8 py-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-stone-700 mb-2">Product Items</h3>
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4"
              >
                {["name", "value", "uppertolerance", "lowertolerance"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">
                        {field === "name"
                          ? "Name"
                          : field === "value"
                          ? "Value"
                          : field === "uppertolerance"
                          ? "Upper Tolerance"
                          : "Lower Tolerance"}
                      </label>
                      <input
                        type={field === "name" ? "text" : "number"}
                        value={item[field as keyof ProductItem] as any}
                        placeholder={
                          field === "name"
                            ? "Item Name"
                            : field === "value"
                            ? "Item Value"
                            : field === "uppertolerance"
                            ? "Upper Tolerance"
                            : "Lower Tolerance"
                        }
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            field as keyof ProductItem,
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800"
                      />
                      {errors[
                        `${
                          field === "name"
                            ? "itemName"
                            : field === "value"
                            ? "itemValue"
                            : field === "uppertolerance"
                            ? "itemUpper"
                            : "itemLower"
                        }_${index}`
                      ] && (
                        <p className="text-sm text-red-600">
                          {
                            errors[
                              `${
                                field === "name"
                                  ? "itemName"
                                  : field === "value"
                                  ? "itemValue"
                                  : field === "uppertolerance"
                                  ? "itemUpper"
                                  : "itemLower"
                              }_${index}`
                            ]
                          }
                        </p>
                      )}
                    </div>
                  )
                )}

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              + Add Item
            </button>

            {errors.items && (
              <p className="text-sm text-red-600">{errors.items}</p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
