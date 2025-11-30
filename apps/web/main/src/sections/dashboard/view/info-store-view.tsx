// 'use client';
// import {
//   ShoppingBag,
//   SquareMenu,
//   UsersRound,
//   Users,
//   TrendingUp,
//   DollarSign,
//   Calendar,
//   MapPin,
//   Phone,
//   Clock,
//   Star,
//   BarChart3,
//   Package,
//   CreditCard,
//   Mail,
//   Edit,
//   Trash,
//   BadgeAlert,
// } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import StatCard from '../components/stat-card';
// import useStore from '../../../../../main/src/hooks/store/use-store';
// import { Modal, Input, Button, Select } from '@repo/design-system/components/ui';
// import { currentStoreAtom } from '@repo/design-system/stores/auth';
// import { useAtomValue } from 'jotai';
// import useToast from '@repo/design-system/hooks/client/use-toast-notification';
// import api from '../../../../../main/src/libs/axios';
// import { Controller } from 'react-hook-form';

// interface bank {
//   id: string;
//   name: string;
//   code: string;
//   bin: string;
//   shortName: string;
//   logo: string;
// }
// export function InfoStoreView() {
//   const { store, stats, updateStore, updateStoreForm, getStoreDetail } = useStore();
//   const { showErrorToast } = useToast();
//   const currentStore = useAtomValue(currentStoreAtom);

//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [selectedStore, setSelectedStore] = useState<any>();
//   const [banks, setBanks] = useState<bank[]>([]);
//   const [selectedBank, setSelectedBank] = useState<bank | null>(null);
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//     }).format(amount);
//   };

//   const handleEdit = () => {
//     setSelectedStore(store);
//     setOpenEditModal(true);
//   };

//   const handleDelete = () => {
//     setSelectedStore(store);
//     setDeleteModal(true);
//   };

//   const handleConfirmDelete = () => {
//     // Logic xóa store

//     // API call để xóa store
//     setDeleteModal(false);
//     // Redirect hoặc refresh data
//   };
//   useEffect(() => {
//     if (!currentStore?.id) return;
//     getStoreDetail();index
//   }, [currentStore?.id]);
//   useEffect(() => {
//     if (store) {
//       updateStoreForm.reset({
//         name: store.name || '',
//         description: store.description || '',
//         phone_number: store.phone_number || '',
//         address: store.address || '',
//         business_hour: store.business_hour || '',
//         bank_code: store.bank_code || '',
//         bank_name: store.bank_name || '',
//         bank_account_number: store.bank_account_number || '',
//         bank_account_name: store.bank_account_name || '',
//       });
//     }
//   }, [store]);
//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const res = await api.get('/common/banks');
//         setBanks(res?.data?.data?.data || []);
//       } catch {
//         showErrorToast('Lỗi khi tải danh sách ngân hàng');
//       }
//     };

//     fetchBanks();
//   }, []);

//   return (
//     <>
//       <div className="space-y-8">
//         {/* Main Statistics Grid */}
//         <section className="grid grid-cols-4 items-center gap-6 h-full">
//           <StatCard
//             icon={ShoppingBag}
//             title="Tổng sản phẩm"
//             value={stats?.totalProducts}
//             trend={stats?.totalProducts > 0 ? 12 : null}
//           />
//           <StatCard icon={SquareMenu} title="Tổng danh mục" value={stats?.totalCategories} />
//           <StatCard
//             icon={UsersRound}
//             title="Tổng khách hàng"
//             value={stats?.totalCustomers}
//             trend={stats?.totalCustomers > 0 ? 8 : null}
//           />
//           <StatCard
//             icon={Users}
//             title="Tổng thành viên"
//             value={stats?.totalMembers}
//             trend={stats?.totalMembers > 0 ? 5 : null}
//           />
//         </section>

//         {/* Additional Statistics */}
//         {/* <section className="grid grid-cols-4 items-center gap-6">
//           <StatCard
//             icon={DollarSign}
//             title="Doanh thu tháng"
//             value={
//               stats.monthlyRevenue > 0 ? formatCurrency(stats.monthlyRevenue) : 'Chưa có dữ liệu'
//             }
//             bgColor="bg-green-50"
//             textColor="text-green-600"
//             trend={stats.monthlyRevenue > 0 ? 15 : null}
//           />
//           <StatCard
//             icon={Package}
//             title="Đơn hôm nay"
//             value={stats.todaySales}
//             subtitle={stats.todaySales > 0 ? 'đơn hàng' : 'Chưa có đơn'}
//             bgColor="bg-orange-50"
//             textColor="text-orange-600"
//           />
//           <StatCard
//             icon={Star}
//             title="Đánh giá TB"
//             value={stats.averageRating > 0 ? `${stats.averageRating}/5` : 'Chưa có đánh giá'}
//             subtitle={stats.averageRating > 0 ? 'từ khách hàng' : ''}
//             bgColor="bg-yellow-50"
//             textColor="text-yellow-600"
//           />
//           <StatCard
//             icon={CreditCard}
//             title="Tổng đơn hàng"
//             value={stats.totalOrders || '0'}
//             bgColor="bg-purple-50"
//             textColor="text-purple-600"
//           />
//         </section> */}

//         {/* Store Information */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center gap-6 mb-6">
//             <h1 className="text-2xl font-semibold text-gray-700 border-b-2 border-b-pos-blue-500 w-fit pb-2">
//               Thông tin cửa hàng
//             </h1>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleEdit}
//                 className="flex justify-center items-center cursor-pointer w-8 h-8 bg-pos-blue-50 text-pos-blue-500 rounded-md hover:bg-pos-blue-500 hover:text-white transition-all duration-200"
//                 title="Chỉnh sửa"
//               >
//                 <Edit size={14} />
//               </button>

//               <button
//                 onClick={handleDelete}
//                 className="flex justify-center items-center cursor-pointer w-8 h-8 bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-200"
//                 title="Xóa"
//               >
//                 <Trash size={14} />
//               </button>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Basic Info */}
//             <div className="space-y-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">{store?.name}</h2>
//                 <p className="text-gray-600 leading-relaxed">{store?.description}</p>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <Users size={16} className="text-pos-blue-500" />
//                   <span>
//                     Chủ cửa hàng:{' '}
//                     <span className="font-medium text-gray-800">{store?.owner?.username}</span>
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <Calendar size={16} className="text-pos-blue-500" />
//                   <span>
//                     Ngày tạo:{' '}
//                     <span className="font-medium text-gray-800">
//                       {store &&
//                         store.createdAt &&
//                         new Date(store?.createdAt).toLocaleDateString('vi-VN', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric',
//                         })}
//                     </span>
//                   </span>
//                 </div>

//                 {store?.owner?.email && (
//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <Mail size={16} className="text-pos-blue-500" />
//                     <span>
//                       Email:{' '}
//                       <span className="font-medium text-gray-800">{store?.owner?.email}</span>
//                     </span>
//                   </div>
//                 )}

//                 {store?.phone_number && (
//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <Phone size={16} className="text-pos-blue-500" />
//                     <span>
//                       Điện thoại:{' '}
//                       <span className="font-medium text-gray-800">{store.phone_number}</span>
//                     </span>
//                   </div>
//                 )}

//                 {store?.address && (
//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <MapPin size={16} className="text-pos-blue-500" />
//                     <span>
//                       Địa chỉ: <span className="font-medium text-gray-800">{store.address}</span>
//                     </span>
//                   </div>
//                 )}

//                 {store?.business_hour && (
//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <Clock size={16} className="text-pos-blue-500" />
//                     <span>
//                       Giờ hoạt động:{' '}
//                       <span className="font-medium text-gray-800">{store.business_hour}</span>
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Quick Actions or Additional Info */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê nhanh</h3>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <BarChart3 size={16} className="text-pos-blue-500" />
//                     <span className="text-sm font-medium text-gray-600">Hoạt động</span>
//                   </div>
//                   {store && store.createdAt && (
//                     <p className="text-lg font-bold text-gray-800">
//                       {(
//                         (Date.now() - new Date(store?.createdAt).getTime()) /
//                         (1000 * 60 * 60 * 24)
//                       ).toFixed(0)}{' '}
//                       ngày
//                     </p>
//                   )}
//                   <p className="text-xs text-gray-500">Đã hoạt động</p>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <TrendingUp size={16} className="text-green-500" />
//                     <span className="text-sm font-medium text-gray-600">Trạng thái</span>
//                   </div>
//                   <p className="text-lg font-bold text-green-600">Đang hoạt động</p>
//                   <p className="text-xs text-gray-500">Online</p>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-pos-blue-500 to-pos-blue-600 text-white p-4 rounded-lg">
//                 <h4 className="font-semibold mb-2">Gói dịch vụ hiện tại</h4>
//                 <p className="text-pos-blue-100">Gói Premium</p>
//                 <p className="text-xs text-pos-blue-200 mt-1">Hết hạn: 31/12/2024</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity or Quick Stats */}
//         {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 text-sm">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <span className="text-gray-600">5 sản phẩm mới được thêm</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-gray-600">12 đơn hàng được xử lý</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                 <span className="text-gray-600">3 khách hàng mới đăng ký</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm bán chạy</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600">iPhone 15 Pro</span>
//                 <span className="font-semibold text-gray-800">45 đã bán</span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600">MacBook Air M2</span>
//                 <span className="font-semibold text-gray-800">32 đã bán</span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600">AirPods Pro</span>
//                 <span className="font-semibold text-gray-800">28 đã bán</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê nhanh</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600">Tỷ lệ chuyển đổi</span>
//                 <span className="font-semibold text-green-600">12.5%</span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600">Giá trị đơn TB</span>
//                 <span className="font-semibold text-gray-800">1,250,000₫</span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600">Khách quay lại</span>
//                 <span className="font-semibold text-blue-600">68%</span>
//               </div>
//             </div>
//           </div>
//         </div> */}
//       </div>

//       {/* EDIT MODAL */}
//       <Modal
//         opened={openEditModal}
//         size="80%"
//         onClose={() => setOpenEditModal(false)}
//         title={
//           <>
//             <div className="flex items-center gap-2.5">
//               <Edit size={18} className="text-pos-blue-500" />
//               <div className="flex items-center gap-2">
//                 <h3 className="text-gray-700">Chỉnh sửa cửa hàng:</h3>
//                 <h3 className="text-pos-blue-400 font-semibold">{store?.name}</h3>
//               </div>
//             </div>
//           </>
//         }
//       >
//         <div className="space-y-4 mt-4">
//           <div className="border-b border-b-gray-200 pb-4">
//             <h3 className="font-semibold text-2xl text-gray-800 mb-3">Thông tin cơ bản</h3>

//             <div className="grid grid-cols-1 gap-4 text-sm">
//               <div className="space-y-4">
//                 <div>
//                   <Input
//                     {...updateStoreForm.register('name')}
//                     size="sm"
//                     name="name"
//                     radius="md"
//                     label="Tên cửa hàng"
//                     placeholder="Nhập tên cửa hàng"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-gray-500 block mb-1">Mô tả cửa hàng</label>
//                   <textarea
//                     {...updateStoreForm.register('description')}
//                     name="description"
//                     className="w-full p-2  rounded-md text-sm border border-gray-300 focus:border-pos-blue-500 focus:ring-pos-blue-500 outline-none resize-none"
//                     rows={4}
//                     placeholder="Nhập mô tả cửa hàng"
//                   />
//                 </div>
//                 {/* BANK */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Controller
//                       control={updateStoreForm.control}
//                       name="bank_code"
//                       render={({ field }) => (
//                         <Select
//                           {...field}
//                           searchable
//                           label="Ngân hàng"
//                           placeholder="Chọn ngân hàng"
//                           size="sm"
//                           radius="md"
//                           data={banks.map((bank) => ({
//                             label: `${bank.shortName} - (${bank.name})`,
//                             value: bank.bin,
//                           }))}
//                           onChange={(value) => {
//                             field.onChange(value);
//                             setSelectedBank(banks.find((bank) => bank.bin === value) || null);
//                           }}
//                         />
//                       )}
//                     />
//                   </div>

//                   <div>
//                     <Input
//                       {...updateStoreForm.register('bank_name')}
//                       value={
//                         selectedBank ? selectedBank.name : updateStoreForm.getValues('bank_name')
//                       }
//                       label="Tên ngân hàng hiển thị"
//                       name="bank_name"
//                       size="sm"
//                       radius="md"
//                       placeholder="Nhập tên ngân hàng hiển thị trên hóa đơn"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Input
//                       {...updateStoreForm.register('bank_account_number')}
//                       name="bank_account_number"
//                       label="Số tài khoản"
//                       size="sm"
//                       radius="md"
//                       placeholder="Nhập số tài khoản"
//                     />
//                   </div>

//                   <div>
//                     <Input
//                       {...updateStoreForm.register('bank_account_name')}
//                       name="bank_account_name"
//                       label="Tên người thụ hưởng"
//                       size="sm"
//                       radius="md"
//                       placeholder="Nhập tên người thụ hưởng"
//                       styles={{ input: { textTransform: 'uppercase' } }}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Input
//                       {...updateStoreForm.register('phone_number')}
//                       name="phone_number"
//                       label="Số diện thoại:"
//                       size="sm"
//                       radius="md"
//                       placeholder="Nhập số điện thoại"
//                     />
//                   </div>

//                   <div>
//                     <Input
//                       {...updateStoreForm.register('address')}
//                       name="address"
//                       label="Địa chỉ:"
//                       size="sm"
//                       radius="md"
//                       placeholder="Nhập địa chỉ"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Input
//                     {...updateStoreForm.register('business_hour')}
//                     name="business_hour"
//                     label="Giờ làm việc"
//                     size="sm"
//                     radius="md"
//                     placeholder="VD: 8:00 - 22:00"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center justify-end gap-3 pt-4">
//             <button
//               className="text-center text-red-600 font-bold px-4 py-2 cursor-pointer hover:bg-red-50 rounded"
//               onClick={() => setOpenEditModal(false)}
//             >
//               Hủy
//             </button>
//             <Button
//               onClick={() => {
//                 updateStoreForm.handleSubmit(updateStore)();
//                 setOpenEditModal(false);
//               }}
//               title="Lưu thay đổi"
//             />
//           </div>
//         </div>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal opened={deleteModal} size="sm" onClose={() => setDeleteModal(false)}>
//         <div className="space-y-4 flex flex-col items-center">
//           <div className="flex flex-col gap-3 items-center justify-center">
//             <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
//               <BadgeAlert size={38} />
//             </div>
//             <div className="text-lg font-bold text-center">Xóa Cửa Hàng?</div>
//             <div className="text-sm text-gray-500 text-center max-w-sm">
//               Bạn có chắc chắn muốn xóa cửa hàng
//               <span className="font-semibold">{selectedStore?.name}</span>Hành động này không thể
//               hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
//             </div>
//           </div>
//           <button
//             className="bg-red-600 rounded-lg text-white w-full py-2 cursor-pointer font-bold hover:bg-red-700"
//             onClick={handleConfirmDelete}
//           >
//             Xác Nhận Xóa
//           </button>
//           <button
//             className="cursor-pointer hover:text-gray-600"
//             onClick={() => setDeleteModal(false)}
//           >
//             Hủy
//           </button>
//         </div>
//       </Modal>
//     </>
//   );
// }
