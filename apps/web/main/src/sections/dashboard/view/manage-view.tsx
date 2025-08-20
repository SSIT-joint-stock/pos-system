"use client";
import {
  AutoComplete,
  DatePickerInput,
  Pagination,
  Select,
} from "@repo/design-system/components/ui";
import {
  ChevronDown,
  Download,
  Edit,
  Eye,
  ListFilter,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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
  const [size, setSize] = useState("450px");
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!refContainer.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setSize(`${height * 0.7}px`);
    });
    observer.observe(refContainer.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    console.log(size);
  }, [size]);
  return (
    <div ref={refContainer} className="max-w-full max-h-full">
      {/* ACTION */}
      <div className="flex items-center bg-white p-5 rounded-md">
        <div className="flex items-center w-full gap-2">
          {/* SEARCH */}
          <div className="w-[30%] border border-gray-200 rounded-md   outline-none">
            <AutoComplete
              radius="md"
              size="xs"
              leftSection={<Search size={16} />}
              variant="unstyled"
              placeholder="Tìm kiếm sản phẩm"
              data={["T-Shirt", "Cap", "Shoes", "Watch", "Sunglass"]}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
              }}
              className="w-full  py-[1px] text-sm text-gray-900 font-medium placeholder:font-normal"
            />
          </div>
          {/* FILTER */}
          <div className="flex items-center gap-2 ">
            <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <span className="text-gray-900 font-medium text-xs">
                Trạng thái
              </span>
              <ChevronDown size={16} />
            </button>
            <button className="bg-white text-nowrap border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <span className="text-gray-900 font-medium text-xs">
                Danh mục
              </span>
              <ChevronDown size={16} />
            </button>
            <div className="w-[21ch] border border-gray-200 rounded-md   outline-none">
              <DatePickerInput
                type="range"
                variant="unstyled"
                radius="md"
                clearable
                placeholder="VD: 15/08/2025-22/08/2025"
                size="xs"
                className="w-fit text-nowrap  py-[1px] px-2 text-sm text-gray-900 font-medium placeholder:font-normal placeholder:text-gray-700"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end w-fit">
          <button className="bg-white border text-nowrap border-gray-100 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
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
        </div>
      </div>
      {/* TABLE AND PAGINATION */}
      <div className="bg-white rounded-md p-5 mt-5">
        {/* TABLE */}
        <div
          style={{ height: size }}
          className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-transparent`}>
          <table className="table-fixed w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="text-left text-base text-gray-800">
                {tableHeaders.map((item, idx) => (
                  <th key={idx} className="px-4 py-2 font-semibold">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.map((product, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-800 font-medium">
              Hiển thị:{" "}
            </span>
            <div className="w-fit">
              <Select
                defaultValue="10"
                size="xs"
                radius="sm"
                data={["10", "20", "30", "40", "50"]}
                className="w-[10ch]"
              />
            </div>
          </div>

          <Pagination size="sm" total={10} />
        </div>
      </div>
    </div>
  );
}
