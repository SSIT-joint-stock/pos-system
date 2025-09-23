'use client';
import { currentUserAtom } from '@repo/design-system/stores/auth';
import { useAtom } from 'jotai';
import { ChevronDown, Lock, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
} from '../../../../../../../packages/design-system/src/components/ui';
import StepResetPassword from '../../auth/components/steps/step-reset-password';

export default function AccountManagement({ isExpand }: { isExpand: boolean }) {
  const [currentUser] = useAtom(currentUserAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalProfile, setIsOpenModalProfile] = useState(false);
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false);
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center ${isExpand ? 'w-full' : 'w-[44px] '} ${isExpand ? 'gap-2' : 'gap-0'} w-full transition-all duration-300 hover:bg-gray-100 cursor-pointer ${isExpand ? 'p-2' : 'p-0'} rounded-lg ${isOpen ? 'bg-gray-100' : ''}`}
      >
        <Image
          src={'/avatar.png'}
          width={40}
          height={40}
          alt="avatar"
          className="w-10 h-10 rounded-full shrink-0 overflow-hidden object-cover "
          unoptimized
        />
        <div
          className={`flex ${isExpand ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'} gap-1.5 overflow-hidden transition-all duration-300 items-center `}
        >
          <div
            className={`flex flex-col gap-1 transition-all duration-300 overflow-hidden ${
              isExpand ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            <h2 className="text-sm font-medium text-gray-800 truncate">{currentUser?.username}</h2>
            <p className="text-xs text-gray-500 ">{currentUser?.email}</p>
          </div>
          <ChevronDown
            size={18}
            className={` transition-transform duration-300  text-gray-500 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className={`w-full flex flex-col gap-2 bg-gray-50 overflow-hidden transition-all duration-300
      ${isOpen ? 'max-h-40 opacity-100 visible p-2' : 'max-h-0 opacity-0 p-0 invisible'}`}
      >
        {/* Profile */}
        <button
          onClick={() => setIsOpenModalProfile(true)}
          className={`w-full cursor-pointer text-gray-500 text-xs font-semibold text-left px-2 py-1 hover:bg-gray-200 ${isOpen && isOpenModalProfile ? 'bg-gray-200' : ''} rounded flex items-center gap-2 `}
        >
          <User size={`${isExpand ? 14 : 16}`} />
          <span className={`${isExpand === false && 'hidden'} text-nowrap`}>Quản lý tài khoản</span>
        </button>

        {/* Change password */}
        <button
          onClick={() => setIsOpenModalChangePassword(true)}
          className={`w-full cursor-pointer text-gray-500 text-xs font-semibold text-left px-2 py-1 hover:bg-gray-200 ${isOpen && isOpenModalChangePassword ? 'bg-gray-200' : ''} rounded flex items-center gap-2 `}
        >
          <Lock size={`${isExpand ? 14 : 16}`} />
          <span className={`${isExpand === false && 'hidden'} text-nowrap`}>Đổi mật khẩu</span>
        </button>
      </div>
      {/* Modal profile */}
      <Modal
        size="lg"
        opened={isOpenModalProfile}
        onClose={() => setIsOpenModalProfile(false)}
        title="Quản lý tài khoản"
      >
        <form className="flex flex-col gap-2">
          <Input label="Tên tài khoản" value={currentUser?.username} size="sm" radius="md" />
          <Input label="Email" value={currentUser?.email} size="sm" radius="md" />
          <Button title="Thay đổi" variant="filled" radius="md" size="sm" type="submit" />
        </form>
      </Modal>
      {/* Modal change password */}
      <StepResetPassword
        isOpenModal={isOpenModalChangePassword}
        setIsOpenModal={setIsOpenModalChangePassword}
      />
    </>
  );
}
