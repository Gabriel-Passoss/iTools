import { Toaster } from '@/components/ui/toaster'
import RegisterPage from './register/page'
import LoginPage from './login/page'

export default function Home() {
  return (
    <>
      <Toaster />
      <LoginPage />
      <RegisterPage />
    </>
  )
}
