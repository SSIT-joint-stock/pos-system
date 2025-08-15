import {
  ChevronDown,
  Download,
  Ellipsis,
  ListFilter,
  Plus,
} from "lucide-react";
import React from "react";

const productItems = [
  {
    id: 1,
    productName: "nuoc tang luc",
    stock: 299,
    price: "13.000d",
  },
  {
    id: 2,
    productName: "nuoc tang luc",
    stock: 299,
    price: "13.000d",
  },
  {
    id: 3,
    productName: "nuoc tang luc",
    stock: 299,
    price: "13.000d",
  },
  {
    id: 4,
    productName: "nuoc tang luc",
    stock: 299,
    price: "13.000d",
  },
  {
    id: 5,
    productName: "nuoc tang luc",
    stock: 299,
    price: "13.000d",
  },
  {
    id: 6,
    productName: "nuoc tang luc",
    stock: 299,
    price: "13.000d",
  },
];
const products = [
  {
    name: "Casual Sunglass",
    category: "Sunglass",
    stock: 124,
    stockStatus: "Low Stock",
    price: "$47",
    status: "Published",
  },
  {
    name: "T-Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "",
    price: "$47",
    status: "Published",
  },
  {
    name: "Green Tea",
    category: "Beauty",
    stock: 0,
    stockStatus: "Out of Stock",
    price: "$47",
    status: "Draft List",
  },
  {
    name: "Denim Shirt",
    category: "Clothes",
    stock: 124,
    stockStatus: "Low Stock",
    price: "$47",
    status: "Inactive",
  },
  {
    name: "Casual Jacket",
    category: "Clothes",
    stock: 0,
    stockStatus: "Out of Stock",
    price: "$47",
    status: "Stock Out",
  },
  {
    name: "Cap",
    category: "Cap",
    stock: 124,
    stockStatus: "",
    price: "$47",
    status: "Published",
  },
  {
    name: "Nike Cats",
    category: "Shoes",
    stock: 124,
    stockStatus: "",
    price: "$47",
    status: "Inactive",
  },
  {
    name: "Cooling Fan",
    category: "Electronic",
    stock: 124,
    stockStatus: "Low Stock",
    price: "$47",
    status: "Stock Out",
  },
  {
    name: "Man Watch",
    category: "Watch",
    stock: 124,
    stockStatus: "Low Stock",
    price: "$47",
    status: "Stock Out",
  },
];

const statusColors: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  "Draft List": "bg-gray-100 text-gray-700",
  Inactive: "bg-red-100 text-red-700",
  "Stock Out": "bg-yellow-100 text-yellow-700",
};
export function ManageView() {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-pos-blue-500 text-xl">
          Danh sách sản phẩm
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-100 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <Download size={16} />
            <span className="text-gray-900 font-medium text-sm">
              {" "}
              Xuất dữ liệu
            </span>
          </button>
          <button className="bg-pos-blue-50 border border-pos-blue-50 rounded-md flex items-center gap-2 py-2 px-4  text-pos-blue-500 cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <Plus size={16} />
            <span className="font-medium text-sm "> Thêm sản phẩm</span>
          </button>
        </div>
      </div>
      <div className="bg-white mt-10 rounded-md p-4">
        <div className="flex items-center justify-between w-full">
          <input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="border border-gray-200 rounded-md py-1 text-sm text-gray-800 placeholder:text-sm placeholder:text-gray-400 px-4 w-[26%] outline-none"
          />

          <div className="flex items-center gap-3">
            <button className="bg-white border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <span className="text-gray-900 font-medium text-sm">
                Trạng thái
              </span>
              <ChevronDown size={16} />
            </button>
            <button className="bg-white border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <span className="text-gray-900 font-medium text-sm">
                Danh mục
              </span>
              <ChevronDown size={16} />
            </button>
            <button className="bg-white border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <ListFilter size={16} />
              <span className="text-gray-900 font-medium text-sm">
                Lọc sản phẩm
              </span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full ">
            <thead className="py-4">
              <tr className="text-left bg-gray-50 text-base text-gray-800 ">
                <th className="px-2 py-4 font-semibold">Product Name</th>
                <th className="px-2 py-4 font-semibold">Category</th>
                <th className="px-2 py-4 font-semibold">Stock</th>
                <th className="px-2 py-4 font-semibold">Price</th>
                <th className="px-2 py-4 font-semibold">Status</th>
                <th className="px-2 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, idx) => (
                <tr
                  key={idx}
                  className="border-b border-b-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2 flex items-center gap-2">
                    {/* Placeholder for image */}
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <span className="text-sm font-medium text-gray-900">
                      {" "}
                      {product.name}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500 font-medium">
                    {product.category}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500">
                    {product.stock}{" "}
                    {product.stockStatus && (
                      <span
                        className={
                          product.stockStatus === "Out of Stock"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }>
                        {product.stockStatus}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500">
                    {product.price}
                  </td>
                  <td>
                    <span
                      className={`text-xs font-medium py-2 px-4 rounded-full ${statusColors[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button className="cursor-pointer bg-white rounded-full ">
                      <Ellipsis size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
