'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Lock, Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import { signup } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<'student' | 'recruiter'>('student')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains number', met: /\d/.test(formData.password) },
  ]

  const allRequirementsMet = passwordRequirements.every(req => req.met)
  const passwordMatch = formData.password === formData.confirmPassword && formData.password.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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
      if (!formData.name || !formData.email) {
        setError('Please fill in all fields')
        return
      }

      // split full name into first + last
      const parts = formData.name.trim().split(/\s+/)
      const first_name = parts.shift() || ''
      const last_name = parts.join(' ') || ''

      const res = await signup({
        first_name,
        last_name,
        email: formData.email,
        password: formData.password,
        role: userType,
      })

      // success
      window.location.href = `/auth/signin?registered=1`
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
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
          { value: 'student', label: 'Student', icon: '👨‍💻' },
          { value: 'recruiter', label: 'Recruiter', icon: '🏢' },
        ].map(option => (
          <button
            key={option.value}
            onClick={() => setUserType(option.value as 'student' | 'recruiter')}
            className={`rounded-lg border-2 p-3 text-sm font-medium transition ${
              userType === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-lg mb-1">{option.icon}</div>
            {option.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Register with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center">
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
              type="text"
              placeholder="John Doe"
              name="name"
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
              type="email"
              placeholder="you@example.com"
              name="email"
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
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="mt-3 space-y-2">
              {passwordRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs"
                >
                  <Check
                    className={`h-4 w-4 ${
                      req.met ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  />
                  <span className={req.met ? 'text-muted-foreground' : 'text-muted-foreground'}>
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
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`pl-10 pr-10 ${
                formData.confirmPassword && !passwordMatch
                  ? 'border-destructive/50'
                  : ''
              }`}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            className="h-4 w-4 rounded border border-border cursor-pointer mt-0.5"
            disabled={isLoading}
            required
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
            I agree to the{' '}
            <Link href="/terms" className="text-primary underline hover:text-primary/80">
              Terms of Service
            </Link>
            {' '}and{' '}
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
      <div className="rounded-lg bg-accent/5 border border-accent/20 p-3 text-xs text-muted-foreground text-center">
        <p>🔒 Your password is encrypted and secure. We never share your data.</p>
      </div>
    </div>
  )
}
