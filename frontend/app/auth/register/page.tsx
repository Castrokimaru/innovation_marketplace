'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { User, Mail, Lock, Eye, EyeOff, Check, Loader2, ArrowRight } from 'lucide-react'
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
    [formData.password],
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

      router.replace('/auth/signin?registered=1')
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-foreground/70">
          Join Moringa Innovation and start showcasing your ideas.
        </p>
      </div>

      {/* Role toggle */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: 'student' as const, label: 'Student' },
          { value: 'recruiter' as const, label: 'Recruiter' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setUserType(option.value)}
            className={[
              'rounded-md border px-3 py-2 text-sm font-medium transition',
              'flex items-center justify-center',
              userType === option.value
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50',
            ].join(' ')}
            disabled={isLoading}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="h-10 pl-10"
              disabled={isLoading}
              required
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-10 pl-10"
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="h-10 pl-10 pr-10"
              disabled={isLoading}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {formData.password ? (
            <div className="grid gap-1.5 pt-1">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-[11px]">
                  <Check className={`h-3.5 w-3.5 ${req.met ? 'text-accent' : 'text-muted-foreground'}`} />
                  <span className={req.met ? 'text-foreground/80' : 'text-muted-foreground'}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={[
                'h-10 pl-10 pr-10',
                formData.confirmPassword && !passwordMatch ? 'border-destructive/50' : '',
              ].join(' ')}
              disabled={isLoading}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {formData.confirmPassword && !passwordMatch ? (
            <p className="text-[11px] text-destructive">Passwords do not match</p>
          ) : null}
        </div>

        {/* Terms */}
        <div className="rounded-md border border-border/60 bg-muted/20 p-3">
          <label className="flex cursor-pointer items-start gap-3 text-xs text-foreground/70">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border border-border"
              disabled={isLoading}
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        <Button
          type="submit"
          className="h-10 w-full"
          disabled={isLoading || !agreeTerms || !allRequirementsMet}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-foreground/70">Already have an account? </span>
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>

      <div className="rounded-md border border-border/60 bg-background/60 px-3 py-2 text-center text-[11px] text-foreground/70">
        Your password is encrypted. We never share your data.
      </div>
    </div>
  )
}
