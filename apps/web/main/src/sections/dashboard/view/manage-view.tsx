import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CircleChevronDown,
  Download,
  Ellipsis,
  Plus,
  Search,
  SlidersHorizontal,
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
export function ManageView() {
  return (
    <div className="w-full h-full ">
      <header className="text-3xl font-bold text-blue-400">Quan Ly San Pham</header>
      <div className="bg-white w-full h-[7%] mt-4 rounded-sm flex items-center justify-between px-7">
        <div className="w-[47%] h-[70%] bg-gray-100 rounded-sm flex items-center justify-center text-sm gap-8">
          <p>Tat Ca</p>
          <p>San Pham Moi</p>
          <p>San Pham Het Han</p>
          <p>San Pham Sap Het So Luong</p>
        </div>
        <div className=" h-[70%] w-[25%] flex items-center gap-3.5 cursor-pointer">
          <div className="flex items-center gap-2 border rounded-sm h-full w-[32%] px-2">
            <Download />
            Export
          </div>
          <div className="flex items-center gap-1 border rounded-sm h-full px-4 w-[70%] bg-blue-400 text-white hover:bg-blue-300 ">
            <Plus />
            <p>Them San Pham</p>
          </div>
        </div>
      </div>
      <div className="mt-2 h-[83%] bg-white w-full px-7 py-3 rounded-sm">
        <div className="flex items-center justify-between w-full   ">
          <div className="flex items-center gap-4">
            <button className="px-5 py-1.5 flex items-center gap-2 text-sm bg-gray-100 rounded-md ">
              <SlidersHorizontal size={15} />
              <p>Filter</p>
            </button>
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-md py-1.5 px-3.5">
              <Search size={18} />
              <input
                type="text"
                className="outline-none placeholder:text-sm placeholder:text-gray-400 text-sm text-gray-800"
                placeholder="tim kiem san pham.."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md bg-white border border-gray-300 px-2 py-2">
              <ArrowUpDown color="#615875" size={18} />
            </button>
            <button className="rounded-md bg-white border border-gray-300 px-2 py-2">
              <Ellipsis color="#615875" size={18} />
            </button>
          </div>
        </div>
        <div className="w-full  mt-5 ">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-gray-500">
                <th className="px-5 ">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className=" w-5 h-5" />
                    <p>Id</p>
                  </div>
                </th>
                <th className="text-left px-4">Products</th>
                <th className="text-left px-4">Stock</th>
                <th className="text-left px-4">Price</th>
                <th className="text-left px-4">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {productItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 ">
                  <td className="px-5 py-6">
                    <div className="flex items-center gap-2 ">
                      <input type="checkbox" className="w-5 h-5" />
                      <p>{item.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <p>{item.productName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2">{item.stock}</td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2">
                    <button className="border border-gray-200 text-gray-500 px-3 py-1 rounded hover:bg-blue-600 hover:text-white">
                      <CircleChevronDown />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-full mt-4   flex items-center justify-center">
            <ChevronLeft />
            <p className="px-3">1</p>
            <p className="px-3">2</p>
            <p className="px-3">3</p>
            <p className="px-3">4</p>
            <p className="px-3">5</p>
            <p className="px-3">6</p>
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
}
