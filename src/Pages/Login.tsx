import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <>
    <div className="min-h-screen bg-background text-foreground flex justify-center items-center py-16 px-4">
    <SignIn />
    </div>
    </>
  )
}

export default Login