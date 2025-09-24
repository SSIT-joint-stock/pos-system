'use client';
import { Button, Input, Loading, Modal, Table } from '@repo/design-system/components/ui';
import { formatDate } from '../../../../../main/src/utils/index';
import React, { useEffect, useState } from 'react';
import FilterBar from '../components/filter-bar';
import {
  Download,
  Eye,
  Store,
  Users,
  Package,
  SquareMenu,
  Plus,
  ArrowUpDown,
  Warehouse,
  InfoIcon,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react';
import useStore from '../../../../../main/src/hooks/store/use-store';
import { Store as StoreType } from '@repo/design-system/types/store';
const tableHeaders = [
  'Tên Cửa Hàng',
  'Chủ Cửa Hàng',
  'Sản Phẩm',
  'Danh Mục',
  'Thành Viên',
  'Ngày Tạo',
  'Thao Tác',
];

export function ManageStoresView() {
  const { stores, loading, getStores, createStoreForm, createStore } = useStore();
  const [selectedStore, setSelectedStore] = useState<StoreType>();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleSwitchStore = (store: any) => {
    // Logic để chuyển đổi sang store khác
    console.log('Switching to store:', store.name);
    // Có thể gọi API để set current store hoặc redirect
    // Ví dụ: router.push(`/dashboard/store/${store.id}`);
  };
  useEffect(() => {
    getStores();
  }, []);

  return (
    <>
      {/* VIEW MODAL - CHỈ XEM THÔNG TIN */}
      <Modal
        opened={openViewModal}
        size="lg"
        onClose={() => {
          setOpenViewModal(false);
        }}
      >
        <div className="flex items-center border-b border-b-gray-200 pb-2.5 mb-4 gap-2.5">
          <Store size={18} className="text-pos-blue-500" />
          <div className="flex items-center gap-2">
            <h3 className="text-gray-700">Thông tin cửa hàng:</h3>
            {selectedStore && selectedStore?.name && (
              <h3 className="text-pos-blue-400 font-semibold">{selectedStore?.name}</h3>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Store Basic Info - CHỈ HIỂN THỊ */}
          <div className="border-b border-b-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <label className="text-gray-500">Tên cửa hàng:</label>
                  <p className="font-medium text-gray-800">{selectedStore?.name}</p>
                </div>

                <div>
                  <label className="text-gray-500">Mô tả:</label>
                  <p className="font-medium text-gray-800">{selectedStore?.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-gray-500">Chủ cửa hàng:</label>
                  <p className="font-medium text-gray-800">{selectedStore?.owner?.username}</p>
                </div>

                <div>
                  <label className="text-gray-500">Email:</label>
                  <p className="font-medium text-pos-blue-500">{selectedStore?.owner?.email}</p>
                </div>

                <div>
                  <label className="text-gray-500">Ngày tạo:</label>
                  <p className="font-medium text-gray-800">
                    {selectedStore?.createdAt ? formatDate(selectedStore.createdAt) : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="border-b border-b-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Thống kê</h3>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-pos-blue-50 p-3 rounded-lg text-center">
                <Package className="w-6 h-6 text-pos-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-pos-blue-600">
                  {selectedStore?._count?.products || 0}
                </p>
                <p className="text-xs text-gray-500">Sản phẩm</p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg text-center">
                <SquareMenu className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-600">
                  {selectedStore?._count?.categories || 0}
                </p>
                <p className="text-xs text-gray-500">Danh mục</p>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <Users className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-orange-600">
                  {selectedStore?._count?.members || 0}
                </p>
                <p className="text-xs text-gray-500">Thành viên</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <Users className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-600">
                  {selectedStore?._count?.customer || 0}
                </p>
                <p className="text-xs text-gray-500">Khách hàng</p>
              </div>
            </div>
          </div>

          {/* Members List */}
          {selectedStore?.members && selectedStore.members.length > 0 && (
            <div className="pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Danh sách thành viên</h3>

              <div className="space-y-2">
                {selectedStore.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{member.user.username}</p>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {member.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(member.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button - CHỈ CÓ NÚT CHUYỂN ĐỔI STORE */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              className="text-center text-gray-600 font-bold px-4 py-2 cursor-pointer hover:bg-gray-50 rounded"
              onClick={() => setOpenViewModal(false)}
            >
              Đóng
            </button>
            <button
              className="rounded-md bg-pos-blue-400 px-4 py-2 text-white font-bold text-center cursor-pointer hover:bg-pos-blue-500 flex items-center gap-2"
              onClick={() => handleSwitchStore(selectedStore)}
            >
              <ArrowUpDown size={16} />
              Chuyển đổi store
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        size="lg"
        title="Tạo cửa hàng"
        opened={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <div className="flex flex-col gap-3 w-full h-fit">
          <Input
            {...createStoreForm.register('name')}
            error={createStoreForm.formState.errors.name?.message}
            size="sm"
            type="text"
            name="name"
            label="Tên doanh nghiệp"
            placeholder="Doanh nghiệp ABC"
            leftSection={<Warehouse size={16} />}
          />
          <Input
            {...createStoreForm.register('description')}
            size="sm"
            type="text"
            name="description"
            label="Thông tin doanh nghiệp"
            placeholder="Chuyên nghiệp, giá rẻ, dễ dùng"
            leftSection={<InfoIcon size={16} />}
          />
          <Input
            {...createStoreForm.register('phone_number')}
            size="sm"
            type="text"
            name="phone_number"
            label="Số diện thoại"
            placeholder="0123456789"
            leftSection={<Phone size={16} />}
          />
          <Input
            {...createStoreForm.register('address')}
            size="sm"
            type="text"
            name="address"
            label="Địa chỉ"
            placeholder="Hà Nội, Việt Nam"
            leftSection={<MapPin size={16} />}
          />
          <Input
            {...createStoreForm.register('business_hour')}
            size="sm"
            type="text"
            name="business_hour"
            label="Giờ hoạt động"
            placeholder="8:00 - 18:00"
            leftSection={<Clock size={16} />}
          />

          <Button
            onClick={() => {
              createStoreForm.handleSubmit(createStore)();
              setOpenCreateModal(false);
            }}
            disabled={loading}
            type="submit"
            size="sm"
            title="Hoàn thành"
            variant="filled"
          />
        </div>
      </Modal>
      <div className="flex flex-col h-full gap-5">
        {/* ACTION BAR */}
        <FilterBar
          actions={
            <>
              <button
                onClick={() => setOpenCreateModal(true)}
                className="bg-pos-blue-400 border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              >
                <Plus size={16} className="text-white" />
                <span className="text-white font-medium text-xs">Tạo cửa hàng</span>
              </button>

              <button className="bg-gray-600 border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} className="text-white" />
                <span className="text-white font-medium text-xs">Xuất dữ liệu</span>
              </button>
            </>
          }
        />

        {/* TABLE */}

        <Table
          totalPages={Math.ceil(stores.length / 10)}
          tableHeaders={tableHeaders}
          data={stores}
          isLoading={loading}
          loading={<Loading />}
          renderRow={(store) => (
            <tr
              key={store.id}
              className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{store.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{store.description}</p>
                </div>
              </td>

              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{store?.owner?.username}</p>
                  <p className="text-xs text-pos-blue-500">{store.owner.email}</p>
                </div>
              </td>

              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {store._count.products} sản phẩm
                </span>
              </td>

              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {store._count.categories} danh mục
                </span>
              </td>

              <td className="px-4 py-3 ">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {store._count.members} thành viên
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="text-sm text-gray-500">
                  <p>{formatDate(store.createdAt)}</p>
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* CHỈ CÓ NÚT XEM CHI TIẾT */}
                  <button
                    onClick={() => {
                      setSelectedStore(store);
                      setOpenViewModal(true);
                    }}
                    className="flex justify-center items-center cursor-pointer w-8 h-8 bg-gray-50 text-gray-500 rounded-md hover:bg-gray-700 hover:text-white transition-all duration-200"
                    title="Xem chi tiết"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </>
  );
}
