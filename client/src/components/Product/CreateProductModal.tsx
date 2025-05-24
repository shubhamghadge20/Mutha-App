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

const fixedItemNames = [
  "C",
  "Si",
  "Mn",
  "P",
  "S",
  "Cr",
  "Mo",
  "Ni",
  "Al",
  "Co",
  "Cu",
  "Nb",
  "Ti",
  "V",
  "W",
  "Pb",
  "Sn",
  "Mg",
  "As",
  "Zr",
  "Bi",
  "Ca",
  "Ce",
  "Sb",
  "Se",
  "B",
  "Zn",
  "La",
  "Fe",
];

const initialData: CreateProductInterface = {
  name: "",
  items: fixedItemNames.map((name) => ({
    name,
    uppertolerance: 0,
    lowertolerance: 0,
  })),
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

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    formData.items.forEach((item, index) => {
      const upper = item.uppertolerance;
      const lower = item.lowertolerance;

      if (upper === undefined || isNaN(upper)) {
        newErrors[
          `itemUpper_${index}`
        ] = `Upper tolerance is required for ${item.name}`;
      }

      if (lower === undefined || isNaN(lower)) {
        newErrors[
          `itemLower_${index}`
        ] = `Lower tolerance is required for ${item.name}`;
      }

      if (typeof upper === "number" && typeof lower === "number") {
        if (upper === 0 && lower === 0) {
        } else if (upper <= lower) {
          newErrors[
            `itemUpper_${index}`
          ] = `Upper tolerance must be greater than lower tolerance for ${item.name}`;
          newErrors[
            `itemLower_${index}`
          ] = `Lower tolerance must be less than upper tolerance for ${item.name}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleItemChange = (
    index: number,
    field: keyof Omit<ProductItem, "name" | "value">,
    value: string
  ) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value === "" ? "" : Number(value),
      };
      return { ...prev, items: newItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", uppertolerance: 0, lowertolerance: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(createProductThunk(formData)).unwrap();
      onClose();
      navigate("/product");
    } catch (error: any) {
      toast.error(error?.message || "Product creation failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b bg-blue-300 rounded-t-lg">
          <h2 className="text-xl font-bold text-stone-800 font-serif">
            Create Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-6">
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
              className={`w-full px-4 py-2 border rounded-xl ${
                errors.name ? "border-red-500" : "border-stone-300"
              } bg-stone-50 text-stone-800`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-stone-700 mb-2">Product Items</h3>
            {formData.items.map((item, index) => {
              const isFixedName = fixedItemNames.includes(item.name);
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end"
                >
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">
                      Item Name
                    </label>
                    {isFixedName ? (
                      <p className="px-4 py-2 border rounded-xl border-stone-300 bg-stone-100 text-stone-700 select-none">
                        {item.name}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={item.name}
                        placeholder="Enter item name"
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => {
                            const newItems = [...prev.items];
                            newItems[index] = {
                              ...newItems[index],
                              name: value,
                            };
                            return { ...prev, items: newItems };
                          });
                        }}
                        className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">
                      Upper Tolerance
                    </label>
                    <input
                      type="number"
                      value={item.uppertolerance}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "uppertolerance",
                          e.target.value
                        )
                      }
                      placeholder="Upper"
                      className={`w-full px-4 py-2 border rounded-xl ${
                        errors[`itemUpper_${index}`]
                          ? "border-red-500"
                          : "border-stone-300"
                      } bg-stone-50 text-stone-800`}
                    />
                    {errors[`itemUpper_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[`itemUpper_${index}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">
                      Lower Tolerance
                    </label>
                    <input
                      type="number"
                      value={item.lowertolerance}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "lowertolerance",
                          e.target.value
                        )
                      }
                      placeholder="Lower"
                      className={`w-full px-4 py-2 border rounded-xl ${
                        errors[`itemLower_${index}`]
                          ? "border-red-500"
                          : "border-stone-300"
                      } bg-stone-50 text-stone-800`}
                    />
                    {errors[`itemLower_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[`itemLower_${index}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddItem}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Item
            </button>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
