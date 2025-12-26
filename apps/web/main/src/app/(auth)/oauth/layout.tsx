import SigninLayout from '@main/app/(auth)/auth/login/layout';

export default function OauthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SigninLayout>{children}</SigninLayout>;
}
