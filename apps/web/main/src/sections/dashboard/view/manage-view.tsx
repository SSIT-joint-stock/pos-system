"use client";
import { Modal, Select, Table } from "@repo/design-system/components/ui";
import FilterBar from "../components/filter-bar";
import { BadgeAlert, CirclePlus, Download, Edit, Eye, Pencil, Plus, ShoppingCart, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NumberInput, TextInput } from "@mantine/core";
import api from "@main/libs/axios";

const tableHeaders = ["Sản Phẩm", "Danh Mục", "Số Lượng", "Giá", "Trạng Thái", "Thao Tác"];
const statusColors: Record<string, string> = {
  Published: " text-pos-blue-500",
  Inactive: "text-gray-700",
  "Stock Out": " text-orange-600",
};
export function ManageView() {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [products, setProducts] = useState<any>([null]);
  useEffect(() => {
    api
      .get("/api/stores/:storeId/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/*MODAL ADD PRODUCT */}
      <Modal
        opened={openAddModal}
        size="lg"
        title={
          <div className="flex items-center justify-center gap-2 text-lg font-medium">
            <CirclePlus size={20} />
            <p>Thêm Sản Phẩm</p>
          </div>
        }
        onClose={() => {
          setOpenAddModal(false);
        }}
      >
        <div className="space-y-4">
          <TextInput label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" required />

          <NumberInput label="Giá" placeholder="Nhập giá sản phẩm" min={0} required />

          <NumberInput label="Số lượng" placeholder="Nhập số lượng" min={0} />

          <TextInput label="Mô tả" placeholder="Nhập mô tả sản phẩm" />

          <Select
            label="Cửa hàng"
            placeholder="Chọn cửa hàng"
            data={[
              { value: "store1", label: "Cửa hàng 1" },
              { value: "store2", label: "Cửa hàng 2" },
            ]}
          />

          <div className="flex justify-end gap-5">
            <button onClick={() => setOpenAddModal(false)} className=" text-red-500">
              Hủy
            </button>
            <button className="px-2 py-1 rounded-md bg-pos-blue-400 text-pos-blue-50">Thêm Sản Phẩm</button>
          </div>
        </div>
      </Modal>

      {/* DELETE MODAL */}
      <Modal opened={deleteModal} size="sm" onClose={() => setDeleteModal(false)}>
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
              <BadgeAlert size={38} />
            </div>
            <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
            <div className="text-sm text-gray-500 text-center">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan của trường này sẽ biến mất.
            </div>
          </div>
          <button className="bg-red-600 rounded-lg text-white w-full py-2 cursor-pointer font-bold">
            Xác Nhận Xóa{" "}
          </button>
          <button
            onClick={() => {
              setDeleteModal(false);
            }}
            className="cursor-pointer"
          >
            Hủy
          </button>
        </div>
      </Modal>

      {/* MODAL VIEW and EDIT PRODUCT */}
      <Modal
        opened={openViewModal || openEditModal}
        onClose={() => {
          setOpenViewModal(false);
          setOpenEditModal(false);
        }}
        size="lg"
        title={
          openEditModal ? (
            <div className="flex items-center gap-2 font-medium text-gray-600">
              <Pencil size={20} />
              <p>Chỉnh sửa sản phẩm</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-medium text-gray-600">
              <ShoppingCart size={20} />
              <p>Xem thông tin sản phẩm</p>
            </div>
          )
        }
      >
        <div className="space-y-6">
          {/* GRID INFO */}
          <div className="grid grid-cols-2 gap-4">
            {/* ID */}
            {openEditModal ? (
              <TextInput label="ID" value={selectedProduct?.id} disabled />
            ) : (
              <div>
                <p className="font-medium text-gray-700">ID</p>
                <p className="text-gray-600">{selectedProduct?.id}</p>
              </div>
            )}

            {/* Store ID */}
            {openEditModal ? (
              <TextInput label="Store ID" value={selectedProduct?.store_id} disabled />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Store ID</p>
                <p className="text-gray-600">{selectedProduct?.store_id}</p>
              </div>
            )}

            {/* Name */}
            {openEditModal ? (
              <TextInput label="Tên sản phẩm" defaultValue={selectedProduct?.name} />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Tên sản phẩm</p>
                <p className="text-gray-600">{selectedProduct?.name}</p>
              </div>
            )}

            {/* SKU */}
            {openEditModal ? (
              <TextInput label="SKU" defaultValue={selectedProduct?.sku} />
            ) : (
              <div>
                <p className="font-medium text-gray-700">SKU</p>
                <p className="text-gray-600">{selectedProduct?.sku}</p>
              </div>
            )}

            {/* Barcode */}
            {openEditModal ? (
              <TextInput label="Barcode" defaultValue={selectedProduct?.barcode || ""} />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Barcode</p>
                <p className="text-gray-600">{selectedProduct?.barcode || "—"}</p>
              </div>
            )}

            {/* Price */}
            {openEditModal ? (
              <NumberInput label="Giá bán" defaultValue={selectedProduct?.price} min={0} />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Giá bán</p>
                <p className="text-gray-600">{selectedProduct?.price}</p>
              </div>
            )}

            {/* Cost */}
            {openEditModal ? (
              <NumberInput label="Giá vốn" defaultValue={selectedProduct?.cost} min={0} />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Giá vốn</p>
                <p className="text-gray-600">{selectedProduct?.cost}</p>
              </div>
            )}

            {/* Status */}
            {openEditModal ? (
              <Select
                label="Trạng thái"
                data={[
                  { value: "ACTIVE", label: "ACTIVE" },
                  { value: "INACTIVE", label: "INACTIVE" },
                  { value: "ARCHIVED", label: "ARCHIVED" },
                ]}
                defaultValue={selectedProduct?.product_status || "ACTIVE"}
              />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Trạng thái</p>
                <p className="text-gray-600">{selectedProduct?.product_status}</p>
              </div>
            )}
          </div>

          {/* Image URL */}
          {openEditModal ? (
            <TextInput label="Image URL" defaultValue={selectedProduct?.image_url || ""} />
          ) : (
            <div>
              <p className="font-medium text-gray-700">Image URL</p>
              <p className="text-gray-600">{selectedProduct?.image_url || "—"}</p>
            </div>
          )}

          {/* Description */}
          {openEditModal ? (
            <TextInput label="Mô tả" defaultValue={selectedProduct?.description || ""} />
          ) : (
            <div>
              <p className="font-medium text-gray-700">Mô tả</p>
              <p className="text-gray-600">{selectedProduct?.description || "—"}</p>
            </div>
          )}

          {/* Meta */}
          {openEditModal ? (
            <TextInput label="Meta (JSON)" defaultValue={JSON.stringify(selectedProduct?.meta || {})} />
          ) : (
            <div>
              <p className="font-medium text-gray-700">Meta</p>
              <pre className="text-sm bg-gray-50 p-2 rounded-md text-gray-600">
                {JSON.stringify(selectedProduct?.meta || {}, null, 2)}
              </pre>
            </div>
          )}

          {/* Created By */}
          {openEditModal ? (
            <TextInput label="Created By" value={selectedProduct?.created_by} disabled />
          ) : (
            <div>
              <p className="font-medium text-gray-700">Created By</p>
              <p className="text-gray-600">{selectedProduct?.created_by}</p>
            </div>
          )}

          {/* Created At */}
          <div>
            <p className="font-medium text-gray-700">Ngày tạo</p>
            <p className="text-gray-600">{new Date(selectedProduct?.createdAt).toLocaleString()}</p>
          </div>

          {/* Updated At + Actions */}
          <div className="mt-6 border-t border-gray-300 pt-4 flex items-center justify-between text-sm text-gray-500">
            <p>Lần cuối cập nhật: {new Date(selectedProduct?.updatedAt).toLocaleString()}</p>

            {openEditModal && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="px-4 py-1 rounded-md text-red-500 hover:bg-red-50"
                >
                  Hủy
                </button>
                <button className="px-5 py-1 rounded-md bg-pos-blue-500 text-white hover:bg-pos-blue-600">Lưu</button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <div className="flex flex-col h-full ">
        {/* ACTION */}
        <FilterBar
          actions={
            <>
              <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} />
                <span className="text-gray-900 font-medium text-xs"> Xuất dữ liệu</span>
              </button>
              <button
                onClick={() => {
                  setOpenAddModal(true);
                }}
                className="bg-pos-blue-50 border text-nowrap  border-pos-blue-500 rounded-md flex items-center gap-2 py-2 px-4  text-pos-blue-500 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              >
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
              <tr key={idx} className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300">
                <td className="px-4 py-2 text-xs font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-2 text-xs text-gray-500 font-medium">{product.category}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{product.stock}</td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(product.price))}
                </td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium rounded-xl ${statusColors[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-5 pl-4">
                    <button
                      data-tooltip-target="tooltip-default"
                      onClick={() => {
                        setOpenViewModal(true);
                        setSelectedProduct(product);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-gray-700 hover:text-white opacity-70 transition-opacity duration-200"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setOpenEditModal(true);
                        setSelectedProduct(product);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedProduct(product);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200 ml-auto"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </>
          )}
        />
      </div>
    </>
  );
}
