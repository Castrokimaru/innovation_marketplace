'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { User, Mail, Lock, Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import { signup } from '@/lib/api'

type UserType = 'student' | 'recruiter'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [userType, setUserType] = useState<UserType>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordRequirements = useMemo(
    () => [
      { label: 'At least 8 characters', met: formData.password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
      { label: 'Contains number', met: /\d/.test(formData.password) },
    ],
    [formData.password]
  )

  const allRequirementsMet = passwordRequirements.every((req) => req.met)
  const passwordMatch =
    formData.password.length > 0 && formData.password === formData.confirmPassword

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const fullName = formData.name.trim()
    const email = formData.email.trim().toLowerCase()
    const password = formData.password
    const confirmPassword = formData.confirmPassword

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      return
    }

    if (!allRequirementsMet) {
      setError('Password does not meet all requirements')
      return
    }

    if (!passwordMatch) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // split full name into first + last
      const parts = fullName.split(/\s+/)
      const first_name = parts.shift() || ''
      const last_name = parts.join(' ') || ''

      await signup({
        first_name,
        last_name,
        email,
        password,
        role: userType,
      })

      // redirect without full page refresh
      router.replace('/auth/signin?registered=1')
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Join Moringa Innovation</h1>
        <p className="text-sm text-muted-foreground">
          Create your account and start showcasing your ideas
        </p>
      </div>

      {/* User Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: 'student' as const, label: 'Student', icon: '👨‍💻' },
          { value: 'recruiter' as const, label: 'Recruiter', icon: '🏢' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setUserType(option.value)}
            className={`rounded-lg border-2 p-3 text-sm font-medium transition ${
              userType === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            disabled={isLoading}
          >
            <div className="mb-1 text-lg">{option.icon}</div>
            {option.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Register with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/20">
              <span className="text-destructive">!</span>
            </div>
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="mt-3 space-y-2">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-xs">
                  <Check
                    className={`h-4 w-4 ${req.met ? 'text-accent' : 'text-muted-foreground'}`}
                  />
                  <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`pl-10 pr-10 ${
                formData.confirmPassword && !passwordMatch ? 'border-destructive/50' : ''
              }`}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formData.confirmPassword && !passwordMatch && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border border-border"
            disabled={isLoading}
          />
          <label htmlFor="terms" className="cursor-pointer text-xs text-muted-foreground">
            I agree to the{' '}
            <Link href="/terms" className="text-primary underline hover:text-primary/80">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary underline hover:text-primary/80">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 h-10 font-medium"
          disabled={isLoading || !agreeTerms || !allRequirementsMet}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>

      {/* Security Notice */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-center text-xs text-muted-foreground">
        <p>🔒 Your password is encrypted and secure. We never share your data.</p>
      </div>
    </div>
  )
}
