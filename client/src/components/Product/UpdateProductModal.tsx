import { UpdateProductInterface, ProductItem } from "@/types";
import { useState } from "react";

interface UpdateProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (cleanedData: Omit<UpdateProductInterface, "id">) => void;
  formData?: UpdateProductInterface;
  setFormData: React.Dispatch<
    React.SetStateAction<UpdateProductInterface | undefined>
  >;
}

interface ErrorsInterface {
  name?: string;
  items?: string;
  [key: string]: string | undefined;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  open,
  onClose,
  onConfirm,
  formData,
  setFormData,
}) => {
  if (!open || !formData) return null;

  const [errors, setErrors] = useState<Partial<ErrorsInterface>>({});

  const validate = () => {
    const newErrors: Partial<ErrorsInterface> = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.items || formData.items.length === 0) {
      newErrors.items = "At least one item is required";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.name || !item.name.trim()) {
          newErrors[`itemName_${index}`] = `Item ${
            index + 1
          }: Name is required`;
        }

        if (item.uppertolerance === undefined || isNaN(item.uppertolerance)) {
          newErrors[`itemUpper_${index}`] = `Item ${
            index + 1
          }: Upper tolerance is required`;
        }

        if (item.lowertolerance === undefined || isNaN(item.lowertolerance)) {
          newErrors[`itemLower_${index}`] = `Item ${
            index + 1
          }: Lower tolerance is required`;
        }

        if (
          item.uppertolerance !== undefined &&
          item.lowertolerance !== undefined &&
          !isNaN(item.uppertolerance) &&
          !isNaN(item.lowertolerance)
        ) {
          // Accept if both zero
          if (!(item.uppertolerance === 0 && item.lowertolerance === 0)) {
            if (item.uppertolerance <= item.lowertolerance) {
              newErrors[`itemTolerance_${index}`] = `Item ${
                index + 1
              }: Upper tolerance must be greater than lower tolerance`;
            }
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCleanedData = (): Omit<UpdateProductInterface, "id"> => {
    return {
      name: formData.name,
      items: formData.items.map(({ id, ...rest }) => rest),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const cleanedData = getCleanedData();
    onConfirm(cleanedData);
  };

  const handleItemChange = (
    index: number,
    field: keyof ProductItem,
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newItems = [...prev.items];
      const parsedValue =
        field === "name" ? value : value === "" ? "" : Number(value);
      newItems[index] = { ...newItems[index], [field]: parsedValue };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            name: "",
            value: 0,
            uppertolerance: 0,
            lowertolerance: 0,
          },
        ],
      };
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="px-4 py-4 border-b bg-blue-300 rounded-t-lg">
          <h2 className="text-xl font-bold text-stone-800 font-serif">
            Update Product
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
                setFormData((prev) => ({ ...prev!, name: e.target.value }))
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
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    placeholder="Item Name"
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800"
                  />
                  {errors[`itemName_${index}`] && (
                    <p className="text-sm text-red-600">
                      {errors[`itemName_${index}`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Upper Tolerance
                  </label>
                  <input
                    type="number"
                    value={item.uppertolerance}
                    placeholder="Upper Tolerance"
                    onChange={(e) =>
                      handleItemChange(index, "uppertolerance", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800"
                  />
                  {errors[`itemUpper_${index}`] && (
                    <p className="text-sm text-red-600">
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
                    placeholder="Lower Tolerance"
                    onChange={(e) =>
                      handleItemChange(index, "lowertolerance", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800"
                  />
                  {errors[`itemLower_${index}`] && (
                    <p className="text-sm text-red-600">
                      {errors[`itemLower_${index}`]}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                {errors[`itemTolerance_${index}`] && (
                  <p className="text-sm text-red-600 col-span-5">
                    {errors[`itemTolerance_${index}`]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:text-blue-800 text-sm"
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
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
