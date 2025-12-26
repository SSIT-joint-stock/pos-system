'use client';
import { useOauth } from '@main/hooks/oauth/use-oauth';
import { Button, Checkbox, Input, Loading } from '@repo/design-system/components/ui/';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { RouterLink } from '@repo/design-system/routes/components';
import { Lock, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import StepResetPassword from '../steps/step-reset-password';
import FormReactiveAccount from './form-reactive-account';

export function FormLogin({
  login,
  loginForm,
  loading,
}: {
  login: (data: any) => void;
  loginForm: any;
  loading: boolean;
}) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalActiveAcc, setIsOpenModalActiveAcc] = useState<boolean>(false);
  const { callBackGoogle } = useOauth();
  const { showErrorToast } = useToast();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const lastErrorShown = useRef<string | null>(null);

  useEffect(() => {
    if (!error || lastErrorShown.current === error) return;

    if (error === 'account_not_verified') {
      showErrorToast('Email của bạn chưa được xác thực. Vui lòng xác thực email!');
      lastErrorShown.current = error;
    } else if (error === 'server_error') {
      showErrorToast('Có lỗi xảy ra trong quá trình đăng nhập Google.');
      lastErrorShown.current = error;
    }
  }, [error, showErrorToast]);

  return (
    <>
      <form onSubmit={loginForm.handleSubmit(login)} className="flex flex-col gap-4 w-full ">
        <Input
          disabled={loading}
          {...loginForm.register('usernameOrEmail')}
          name="usernameOrEmail"
          error={loginForm.formState.errors.usernameOrEmail?.message}
          size="sm"
          radius="sm"
          label="Email / Tên đăng nhập"
          placeholder="example@gmail.com"
          leftSection={<Mail size={16} />}
        />
        <Input
          disabled={loading}
          {...loginForm.register('password')}
          name="password"
          error={loginForm.formState.errors.password?.message}
          isInputPassword
          size="sm"
          radius="sm"
          type="password"
          label="Password"
          placeholder="**********"
          leftSection={<Lock size={16} />}
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between text-sm mt-3">
          <Checkbox label="Ghi nhớ tài khoản" radius="xl" size="sm" />
          <p
            onClick={() => setIsOpenModal(true)}
            className="text-pos-blue-500 cursor-pointer hover:underline text-sm font-medium"
          >
            Quên mật khẩu
          </p>
        </div>

        {/* Sign in button */}
        <Button
          disabled={loading}
          type="submit"
          size="sm"
          radius="sm"
          title={loading ? <Loading /> : 'Đăng nhập'}
          variant="filled"
        />
        {/* Google sign in */}
        <Button
          type="button"
          onClick={() => callBackGoogle()}
          size="sm"
          radius="sm"
          variant="default"
          icon={
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="22"
                height="22"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            </>
          }
          title="Tiếp tục với Google"
        />

        {/* Sign up link */}
        <div className="flex items-center justify-between">
          <p className="text-center text-sm font-medium text-gray-400">
            Bạn chưa có tài khoản?{' '}
            <RouterLink href="/auth/register" className="text-pos-blue-500 hover:underline">
              Đăng ký
            </RouterLink>
          </p>
          <p
            onClick={() => setIsOpenModalActiveAcc(true)}
            className="text-sm text-pos-blue-500 font-medium hover:cursor-pointer hover:underline"
          >
            Xác thực tài khoản
          </p>
        </div>
      </form>
      <StepResetPassword isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      <FormReactiveAccount
        isOpenModalActiveAcc={isOpenModalActiveAcc}
        setIsOpenModalActiveAcc={setIsOpenModalActiveAcc}
      />
    </>
  );
}
