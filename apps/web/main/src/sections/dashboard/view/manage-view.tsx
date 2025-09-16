"use client";
import { Button, Loading, Modal, Select, Table } from "@repo/design-system/components/ui";
import FilterBar from "../components/filter-bar";
import { BadgeAlert, CirclePlus, Download, Edit, Eye, Pencil, Plus, ShoppingCart, Trash } from "lucide-react";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { NumberInput, TextInput } from "@mantine/core";
import api from "../../../../../main/src/libs/axios";
import { useAtom } from "jotai";
import { currentStoreAtom } from "@repo/design-system/stores/auth";
import { toast } from "react-toastify";

const tableHeaders = ["Sản Phẩm", "Danh Mục", "Số Lượng", "Giá", "Trạng Thái", "Thao Tác"];
const statusColors: Record<string, string> = {
  ACTIVE: " text-pos-blue-500",
  INACTIVE: "text-gray-700",
};
export interface Product {
  id: string;
  store_id: string;
  name: string;
  sku: string;
  barcode?: string; // optional nếu có sản phẩm không có barcode
  price: number;
  cost: number;
  image_url?: string; // optional vì có thể sản phẩm chưa có hình
  description?: string;
  product_status: "ACTIVE" | "INACTIVE";
  createdAt: string; // dạng ISO string từ backend
  updatedAt: string;
}
export function ManageView() {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [productValue, setProductValue] = useState({});
  const [currentStore] = useAtom(currentStoreAtom);
  const onChangeProductValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProductValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleGetProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/stores/${currentStore?.id}/products`);
      setLoading(false);
      // console.log(res);
      setProducts(res.data.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  console.log(products);
  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/stores/${currentStore?.id}/products`, productValue);
      setOpenAddModal(false);
      toast.success("Them san pham thanh cong");
      handleGetProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/stores/${currentStore?.id}/products/${selectedProduct.id}`);
      handleGetProducts();
      setDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProduct = async () => {
    console.log(productValue);
    try {
      await api.patch(`/stores/${currentStore?.id}/products/${selectedProduct.id}`, productValue);
      setOpenEditModal(false);
      handleGetProducts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentStore?.id) return;
    handleGetProducts();
  }, [currentStore?.id]);

  return (
    <>
      {/* MODAL ADD PRODUCT */}
      <Modal
        opened={openAddModal}
        size="lg"
        onClose={() => setOpenAddModal(false)}
        title={
          <div className="flex items-center justify-center gap-2 text-lg font-medium text-gray-600">
            <CirclePlus size={20} />
            <p>Thêm Sản Phẩm</p>
          </div>
        }
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          {/* Name */}
          <TextInput
            name="name"
            onChange={onChangeProductValue}
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm"
            required
          />

          {/* SKU */}
          <TextInput
            name="sku"
            onChange={onChangeProductValue}
            label="SKU"
            placeholder="Nhập mã SKU (duy nhất)"
            required
          />

          {/* Barcode */}
          <TextInput
            name="barcode"
            // onChange={onChangeProductValue}
            label="Barcode"
            placeholder="Nhập barcode (nếu có)"
          />

          {/* Price */}
          <NumberInput
            name="price"
            onChange={(value) =>
              setProductValue((prev) => ({
                ...prev,
                price: value,
              }))
            }
            label="Giá bán"
            placeholder="Nhập giá sản phẩm"
            min={0}
            required
          />

          {/* Cost */}
          <NumberInput
            name="cost"
            onChange={(value) =>
              setProductValue((prev) => ({
                ...prev,
                cost: value,
              }))
            }
            label="Giá vốn"
            placeholder="Nhập giá vốn"
            min={0}
            required
          />

          {/* Image URL */}
          <TextInput
            name="image_url"
            onChange={onChangeProductValue}
            label="Image URL"
            placeholder="https://example.com/image.png"
          />

          {/* Description */}
          <TextInput
            name="description"
            onChange={onChangeProductValue}
            label="Mô tả"
            placeholder="Nhập mô tả sản phẩm"
          />

          {/* Product Status */}
          <Select
            name="product_status"
            onChange={(value) => {
              setProductValue((prev) => ({
                ...prev,
                product_status: value,
              }));
            }}
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            data={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "INACTIVE", label: "INACTIVE" },
            ]}
          />

          {/* Meta
            <Textarea label="Meta (JSON)" placeholder='Ví dụ: {"color":"red","size":"L"}' autosize minRows={3} /> */}

          {/* Action buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button onClick={() => setOpenAddModal(false)} className="text-red-500 hover:underline">
              Hủy
            </button>
            <Button type="submit" title="Them san pham" size="sm" radius="md" />
          </div>
        </form>
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
          <Button
            onClick={handleDeleteProduct}
            color="red"
            size={"md"}
            className="bg-red-600 rounded-lg text-white py-2 cursor-pointer font-bold w-full"
            title="Xac nhan xoas"
          />

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
              <TextInput onChange={onChangeProductValue} label="ID" value={selectedProduct?.id} disabled />
            ) : (
              <div>
                <p className="font-medium text-gray-700">ID</p>
                <p className="text-gray-600">{selectedProduct?.id}</p>
              </div>
            )}

            {/* Store ID */}
            {openEditModal ? (
              <TextInput onChange={onChangeProductValue} label="Store ID" value={selectedProduct?.store_id} disabled />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Store ID</p>
                <p className="text-gray-600">{selectedProduct?.store_id}</p>
              </div>
            )}

            {/* Name */}
            {openEditModal ? (
              <TextInput
                name="name"
                onChange={onChangeProductValue}
                label="Tên sản phẩm"
                defaultValue={selectedProduct?.name}
              />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Tên sản phẩm</p>
                <p className="text-gray-600">{selectedProduct?.name}</p>
              </div>
            )}

            {/* SKU */}
            {openEditModal ? (
              <TextInput name="sku" onChange={onChangeProductValue} label="SKU" defaultValue={selectedProduct?.sku} />
            ) : (
              <div>
                <p className="font-medium text-gray-700">SKU</p>
                <p className="text-gray-600">{selectedProduct?.sku}</p>
              </div>
            )}

            {/* Barcode */}
            {openEditModal ? (
              <TextInput
                name="barcode"
                onChange={onChangeProductValue}
                label="Barcode"
                defaultValue={selectedProduct?.barcode || ""}
              />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Barcode</p>
                <p className="text-gray-600">{selectedProduct?.barcode || "—"}</p>
              </div>
            )}

            {/* Price */}
            {openEditModal ? (
              <NumberInput
                name="price"
                onChange={(value) =>
                  setProductValue((prev) => ({
                    ...prev,
                    price: value, // lưu thẳng giá trị số
                  }))
                }
                label="Giá bán"
                defaultValue={selectedProduct?.price}
                min={0}
              />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Giá bán</p>
                <p className="text-gray-600">{selectedProduct?.price}</p>
              </div>
            )}

            {/* Cost */}
            {openEditModal ? (
              <NumberInput
                name="cost"
                onChange={(value) =>
                  setProductValue((prev) => ({
                    ...prev,
                    cost: value,
                  }))
                }
                label="Giá vốn"
                defaultValue={selectedProduct?.cost}
                min={0}
              />
            ) : (
              <div>
                <p className="font-medium text-gray-700">Giá vốn</p>
                <p className="text-gray-600">{selectedProduct?.cost}</p>
              </div>
            )}

            {/* Status */}
            {openEditModal ? (
              <Select
                name="product_status"
                onChange={(value) =>
                  setProductValue((prev) => ({
                    ...prev,
                    product_status: value,
                  }))
                }
                label="Trạng thái"
                data={[
                  { value: "ACTIVE", label: "ACTIVE" },
                  { value: "INACTIVE", label: "INACTIVE" },
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
            <TextInput
              name="image_url"
              onChange={onChangeProductValue}
              label="Image URL"
              defaultValue={selectedProduct?.image_url || ""}
            />
          ) : (
            <div>
              <p className="font-medium text-gray-700">Image URL</p>
              <p className="text-gray-600">{selectedProduct?.image_url || "—"}</p>
            </div>
          )}

          {/* Description */}
          {openEditModal ? (
            <TextInput
              name="description"
              onChange={onChangeProductValue}
              label="Mô tả"
              defaultValue={selectedProduct?.description || ""}
            />
          ) : (
            <div>
              <p className="font-medium text-gray-700">Mô tả</p>
              <p className="text-gray-600">{selectedProduct?.description || "—"}</p>
            </div>
          )}

          {/* Meta
          {openEditModal ? (
            <TextInput
              label="Meta (JSON)"
              defaultValue={JSON.stringify(selectedProduct?.meta || {})}
            />
          ) : (
            <div>
              <p className="font-medium text-gray-700">Meta</p>
              <pre className="text-sm bg-gray-50 p-2 rounded-md text-gray-600">
                {JSON.stringify(selectedProduct?.meta || {}, null, 2)}
              </pre>
            </div>
          )} */}

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
                <Button
                  onClick={() => setOpenEditModal(false)}
                  style={{
                    color: "red",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  Hủy
                </Button>
                <button
                  type="submit"
                  onClick={handleEditProduct}
                  className="px-5 py-1 rounded-md bg-pos-blue-500 text-white hover:bg-pos-blue-600"
                >
                  Lưu
                </button>
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

        <>
          <Table
            totalPages={10}
            tableHeaders={tableHeaders}
            data={products}
            isLoading={loading}
            loading={<Loading color="#333" />}
            renderRow={(product, idx) => (
              <>
                <tr key={idx} className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-4 py-2 text-xs font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-2 text-xs text-gray-500 font-medium">{product.sku}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{product.cost}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(product.price))}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-medium rounded-xl ${statusColors[product.product_status]}`}>
                      {product.product_status}
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
        </>
      </div>
    </>
  );
}
