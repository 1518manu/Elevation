import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowUpFromLine } from 'lucide-react'
import SEOHead from '@/components/common/SEOHead'
import { LoginFormSchema } from '@/lib/validators'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const from = location.state?.from?.pathname || '/admin'
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(LoginFormSchema) })

  const onSubmit = async (data) => {
    const { error } = await signInWithEmail(data.email, data.password)
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' })
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle()
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
  }

  return (
    <>
      <SEOHead title="Admin Login" description="Sign in to Alfa Elevator admin portal" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-card">
          <div className="mb-8 flex flex-col items-center">
            <ArrowUpFromLine className="mb-2 h-10 w-10 text-black" />
            <h1 className="font-heading text-2xl font-bold text-black">Admin Login</h1>
            <p className="text-sm text-gray-500">Sign in to manage your content</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-black">{isSubmitting ? 'Signing in...' : 'Sign In'}</Button>
          </form>
          <div className="my-4 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <Button onClick={handleGoogle} variant="outline" className="w-full">Sign in with Google</Button>
          <p className="mt-6 text-center text-sm text-gray-500"><Link to="/" className="text-black hover:underline">← Back to website</Link></p>
        </div>
      </div>
    </>
  )
}
