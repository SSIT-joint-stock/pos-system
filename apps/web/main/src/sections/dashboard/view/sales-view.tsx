"use client";
import React, { useState, useRef } from "react";
import { ProductFilter, CartDetails, SalesProducts } from "@repo/design-system/components/shared/dashboard-screen";
import {
  Beef,
  ChevronDown,
  ChevronRight,
  CupSoda,
  Ellipsis,
  HandCoins,
  Plus,
  ScanLine,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Utensils,
  Wrench,
} from "lucide-react";
import { Input, NumberInput } from "@mantine/core";
import { title } from "process";
import Image from "next/image";
import { Select } from "@repo/design-system/components/ui";

const catagories = [
  {
    title: "Tat ca",
    icon: <ShoppingBasket size={20} />,
  },
  {
    title: "Do an",
    icon: <Utensils size={20} />,
  },
  {
    title: "Do uong",
    icon: <CupSoda size={20} />,
  },
  {
    title: "Do dung",
    icon: <Wrench size={20} />,
  },
  {
    title: "khac",
    icon: <Ellipsis size={20} />,
  },
];

export function SalesView() {
  const [open, setOpen] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1); // nếu nhập rỗng hoặc <= 0 thì reset = 1
    }
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const decreaseQuantity = () => {
    setQuantity(quantity - 1);
  };

  return (
    <div className="w-full bg-white px-3.5 rouded-xl shadow overflow-auto">
      <div className="space-y-3">
        <h1 className="text-3xl font-medium text-gray-800">Order</h1>
        <p className="text-gray-500">
          Experience a seamless purchasing experience with our intuitive cashier interface
        </p>
      </div>
      <div
        className={`flex items-center justify-between border-b-2 border-b-gray-300 py-6  ${open ? " w-[62%]" : " w-full"}`}
      >
        <h2 className="text-lg font-semibold">Danh Sach San Pham</h2>
        <div className="flex items-center justify-center gap-4">
          <button className="px-2.5 py-1 text-nowrap flex items-center justify-center gap-2.5 border border-gray-400 rounded-md cursor-pointer">
            <ScanLine size={22} className="text-gray-700" />
            <p className="text-gray-700">Scan Barcode</p>
          </button>
          <button className="px-2.5 py-1 flex items-center justify-center w-full gap-2.5 border border-gray-400 rounded-md cursor-pointer">
            <Search className="text-gray-500" />
            <input type="text" placeholder="Tim kiem san pham theo ten..." className="outline-0 w-full" />
          </button>
          <button
            onClick={() => {
              setOpen(!open);
            }}
            className="cursor-pointer flex items-center justify-center gap-2.5 px-2.5 py-1 border border-gray-400 rounded-md text-nowrap"
          >
            <ShoppingCart size={20} className="text-gray-500" />
            <p className="text-gray-700">Xem Gio Hang</p>
          </button>
        </div>
      </div>
      <div className={`mt-7 flex justify-between items-center ${open ? " w-[62%]" : " w-full"}`}>
        <div className="flex items-center gap-5 ">
          {catagories.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded-md hover:text-white hover:bg-pos-blue-400 transition-all duration-300"
            >
              <div className="flex items-center justify-center text-sm">{item.icon}</div>
              <p className="text-sm font-medium ">{item.title}</p>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 px-2.5 py-2 border border-gray-300 rounded-md">
          <p className="text-sm font-medium text-gray-400 leading-none">Loc theo san pham</p>
          <ChevronDown size={20} className="text-gray-400" />
        </div>
      </div>
      <div
        className={`grid ${open ? "grid-cols-3 w-[62%]" : "grid-cols-5 w-full"} items-center justify-center gap-5 mt-5 space-y-3.5`}
      >
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div
              onClick={() => setOpen(true)}
              className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer"
            >
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl px-2 py-1 shadow ">
          <Image
            src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
            alt="san pham"
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="">
            <p className="text-lg font-semibold">Denim Fabric Jacket</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Loai san pham:</p>
              <p className=" font-semibold text-gray-600">Quan ao</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 ">
            <div className="flex items-center justify-center  gap-1.5">
              <p className="text-sm text-gray-500">Gia: </p>
              <p className="text-lg font-semibold text-gray-600">199.000 d</p>
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-pos-blue-400 transition-all group duration-300 cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500 group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/*sidebar order */}

      <div
        className={`fixed top-0 right-0 h-screen overflow-auto bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0 transition-all duration-300" : "translate-x-full transition-all duration-300"
        } w-[36%] border border-gray-200 rounded-md shadow px-5 py-2}`}
      >
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="border border-gray-200 shadow px-2 py-1.5 rounded-md mt-2 hover:bg-pos-blue-400 group transition-all duration-300"
        >
          <ChevronRight className="text-gray-400 group-hover:text-white" />
        </button>
        <div className="flex items-center justify-between border-b-2 border-b-gray-200 py-3.5">
          <p className="text-2xl font-semibold text-gray-600">Don Hang</p>
          <div className="px-2.5 py-2 border border-gray-200 rounded-lg">
            <Plus size={25} className="text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-3.5 ">
          <div className="flex items-center justify-between mt-3.5">
            <p className="text-gray-600 font-semibold">3 san pham da duoc chon</p>
            <p className="text-red-500 font-semibold">Xoa tat ca</p>
          </div>
          <div className="flex items-center gap-3.5 border-b-2 border-b-gray-200 py-3.5">
            <div className="">
              <Image
                src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
                alt="san pham"
                width={80}
                height={100}
                className="rounded-xl object-cover"
              />
            </div>
            <div className="w-full">
              <h1>Denim Fabric Jacket</h1>
              <div className="flex items-center gap-3.5  text-sm text-gray-500">
                <p>Loai san pham: </p>
                <p>Quan ao</p>
              </div>
              <div className="flex items-center justify-between mt-4 ">
                <div className="flex items-center justify-center ">
                  <button
                    onClick={decreaseQuantity}
                    className="border border-gray-200 rounded-md px-3.5  text-center flex items-center justify-center leading-0 py-1"
                  >
                    -
                  </button>
                  <input
                    onChange={handleChangeQuantity}
                    name="quantity"
                    value={quantity}
                    className="w-10 text-center outline-0"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="border border-gray-200 rounded-md px-3.5 text-center flex items-center justify-center leading-0 py-1"
                  >
                    +
                  </button>
                </div>
                <div className="text-xl font-semibold">199.000 d</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 border-b-2 border-b-gray-200 py-3.5">
            <div className="">
              <Image
                src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
                alt="san pham"
                width={80}
                height={100}
                className="rounded-xl object-cover"
              />
            </div>
            <div className="w-full">
              <h1>Denim Fabric Jacket</h1>
              <div className="flex items-center gap-3.5  text-sm text-gray-500">
                <p>Loai san pham: </p>
                <p>Quan ao</p>
              </div>
              <div className="flex items-center justify-between mt-4 ">
                <div className="flex items-center justify-center ">
                  <button
                    onClick={decreaseQuantity}
                    className="border border-gray-200 rounded-md px-3.5  text-center flex items-center justify-center leading-0 py-1"
                  >
                    -
                  </button>
                  <input
                    onChange={handleChangeQuantity}
                    name="quantity"
                    value={quantity}
                    className="w-10 text-center outline-0"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="border border-gray-200 rounded-md px-3.5 text-center flex items-center justify-center leading-0 py-1"
                  >
                    +
                  </button>
                </div>
                <div className="text-xl font-semibold">199.000 d</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 border-b-2 border-b-gray-200 py-3.5">
            <div className="">
              <Image
                src={"https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23"}
                alt="san pham"
                width={80}
                height={100}
                className="rounded-xl object-cover"
              />
            </div>
            <div className="w-full">
              <h1>Denim Fabric Jacket</h1>
              <div className="flex items-center gap-3.5  text-sm text-gray-500">
                <p>Loai san pham: </p>
                <p>Quan ao</p>
              </div>
              <div className="flex items-center justify-between mt-4 ">
                <div className="flex items-center justify-center ">
                  <button
                    onClick={decreaseQuantity}
                    className="border border-gray-200 rounded-md px-3.5  text-center flex items-center justify-center leading-0 py-1"
                  >
                    -
                  </button>
                  <input
                    onChange={handleChangeQuantity}
                    name="quantity"
                    value={quantity}
                    className="w-10 text-center outline-0"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="border border-gray-200 rounded-md px-3.5 text-center flex items-center justify-center leading-0 py-1"
                  >
                    +
                  </button>
                </div>
                <div className="text-xl font-semibold">199.000 d</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-md px-2.5 py-1.5 mt-4">
          <div className="space-y-1 border-b-2 border-b-gray-200 py-2.5">
            <div className="flex items-center justify-between">
              <p>Tong tien san pham:</p>
              <p>199.000 d</p>
            </div>
            <div className="flex items-center justify-between ">
              <p>Giam gia: </p>
              <p>-10%</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Thue gia tri san pham: </p>
              <p>+5%</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <p className="text-gray-700 font-bold">Tong thanh toan: </p>
            <p className="text-lg text-gray-700 font-bold">1.000.000 d</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3.5 mt-4">
          <input placeholder="Ma giam gia" className="outline-0 border border-gray-200 w-full rounded-md h-9 px-3" />
          <button className="px-2.5 py-1.5 bg-gray-100 rounded-md text-gray-500 font-semibold text-nowrap">
            Xac nhan
          </button>
        </div>

        <Select data={["Chuyen khoan", "Tien mat"]} className="mt-2" placeholder="Chon phuong thuc thanh toan" />
        <button className="bg-pos-blue-400 text-white rounded-md px-3.5 py-2 flex items-center justify-center gap-3 mt-5 w-full">
          <HandCoins size={20} className="text-white" />
          <p>Thanh toan ngay</p>
        </button>
      </div>
    </div>
  );
}

// <SalesProducts />
