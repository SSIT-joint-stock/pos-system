"use client";
import { Table } from "@repo/design-system/components/ui";
import FilterBar from "../components/filter-bar";
import { Download, Edit, Eye, Plus, Trash } from "lucide-react";
import React from "react";

const products = [
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },

  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },

  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Published",
  },
  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },

  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "Green Tea",
    category: "Beauty",
    stock: 0,
    stockStatus: "Out of Stock",
    price: "400000",
    status: "Draft List",
  },
  {
    name: "Denim Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "Low Stock",
    price: "200000000",
    status: "Inactive",
  },
  {
    name: "Casual Jacket",
    category: "Clothes",
    stock: 0,
    stockStatus: "Out of Stock",
    price: "400000",
    status: "Stock Out",
  },
  {
    name: "Cap",
    category: "Cap",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "Cap",
    category: "Cap",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Published",
  },
  {
    name: "Nike Cats",
    category: "Shoes",
    stock: 124,
    stockStatus: "",
    price: "400000",
    status: "Inactive",
  },
  {
    name: "Cooling Fan",
    category: "Electronic",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Stock Out",
  },
  {
    name: "Man Watch",
    category: "Watch",
    stock: 124,
    stockStatus: "Low Stock",
    price: "400000",
    status: "Stock Out",
  },
];
const tableHeaders = [
  "Sản Phẩm",
  "Danh Mục",
  "Số Lượng",
  "Giá",
  "Trạng Thái",
  "Thao Tác",
];
const statusColors: Record<string, string> = {
  Published: " text-pos-blue-500",
  Inactive: "text-gray-700",
  "Stock Out": " text-orange-600",
};
export function ManageView() {
  // const [size, setSize] = useState("450px");
  // const refContainer = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (!refContainer.current) {
  //     return;
  //   }
  //   const observer = new ResizeObserver((entries) => {
  //     const { height } = entries[0].contentRect;
  //     setSize(`${height * 0.7}px`);
  //   });
  //   observer.observe(refContainer.current);
  //   return () => observer.disconnect();
  // }, []);
  return (
    <div className="flex flex-col h-full">
      {/* ACTION */}
      <FilterBar
        actions={
          <>
            <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <Download size={16} />
              <span className="text-gray-900 font-medium text-xs">
                {" "}
                Xuất dữ liệu
              </span>
            </button>
            <button className="bg-pos-blue-50 border text-nowrap  border-pos-blue-500 rounded-md flex items-center gap-2 py-2 px-4  text-pos-blue-500 cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <Plus size={16} />
              <span className="font-medium text-xs "> Thêm sản phẩm</span>
            </button>
          </>
        }
      />

      {/* TABLE AND PAGINATION */}
      <Table
        totalPages={10}
        tableHeaders={tableHeaders}
        data={products}
        renderRow={(product, idx) => (
          <>
            <tr
              key={idx}
              className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300">
              <td className="px-4 py-2 text-xs font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-4 py-2 text-xs text-gray-500 font-medium">
                {product.category}
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">
                {product.stock}
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(product.price))}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs font-medium rounded-xl ${statusColors[product.status]}`}>
                  {product.status}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-5 pl-4">
                  <button className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 opacity-70 transition-opacity duration-200">
                    <Eye size={16} />
                  </button>
                  <button className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 opacity-70 transition-opacity duration-200">
                    <Edit size={16} />
                  </button>
                  <button className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 opacity-70 transition-opacity duration-200 ml-auto">
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          </>
        )}
      />
    </div>
  );
}
