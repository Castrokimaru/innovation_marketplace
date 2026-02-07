'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Lock, Shield, Mail, Globe, Users, Eye, EyeOff, Save, Loader2, AlertTriangle } from 'lucide-react'

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage platform configuration and preferences</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-foreground/70">
          <AlertTriangle className="h-4 w-4" />
          Settings are UI-only (no backend endpoints wired yet).
        </div>
      </div>

      {/* Platform Settings */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Platform Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Platform Name</label>
            <Input type="text" defaultValue="Moringa Innovation Marketplace" placeholder="Enter platform name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Platform URL</label>
            <Input type="url" defaultValue="https://moringa-innovation.com" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Support Email</label>
            <Input type="email" defaultValue="support@moringa.com" placeholder="support@..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Maintenance Mode</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Enable maintenance mode</span>
              </label>
              <p className="text-xs text-muted-foreground">Platform will be unavailable during maintenance</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Email Settings */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Email Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">SMTP Host</label>
            <Input type="text" placeholder="smtp.example.com" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SMTP Port</label>
              <Input type="number" placeholder="587" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SMTP Username</label>
              <Input type="text" placeholder="username" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">From Email</label>
            <Input type="email" placeholder="noreply@moringa.com" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-muted-foreground">Use TLS Encryption</span>
          </label>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={() => alert('Test email not implemented yet')}>
            Test Email
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notification Settings</h3>
        </div>

        <div className="space-y-3">
          {[
            { label: 'New Project Submissions', desc: 'Notify admins when new projects are submitted' },
            { label: 'User Registration', desc: 'Send confirmation emails to new users' },
            { label: 'Project Approvals', desc: 'Notify users when their projects are approved' },
            { label: 'Contact Messages', desc: 'Send notification when users submit contact forms' },
            { label: 'Payment Notifications', desc: 'Send payment receipt and confirmation emails' },
          ].map((item, index) => (
            <label
              key={index}
              className="flex items-start gap-3 cursor-pointer rounded-lg border border-border/60 bg-background p-3 hover:bg-muted/40 transition"
            >
              <input type="checkbox" className="w-4 h-4 mt-1" defaultChecked />
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} placeholder="Enter current password" />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <Shield className="inline mr-2 h-4 w-4" />
              Strong password requirements: at least 12 characters, including uppercase, lowercase, numbers, and symbols.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* User Roles */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">User Roles & Permissions</h3>
        </div>

        <div className="space-y-3">
          {[
            { role: 'Super Admin', permissions: 'Full access to all features', status: 'Active' },
            { role: 'Admin', permissions: 'Manage projects, users, and reports', status: 'Active' },
            { role: 'Moderator', permissions: 'Review and approve projects', status: 'Active' },
            { role: 'Support', permissions: 'Handle user support and inquiries', status: 'Active' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/40">
              <div>
                <p className="font-medium text-foreground">{item.role}</p>
                <p className="text-sm text-muted-foreground">{item.permissions}</p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400">
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => alert('Manage roles not implemented yet')}>
            Manage Roles
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start border-destructive/30 text-destructive hover:text-destructive bg-transparent"
            onClick={() => alert('Not implemented')}
          >
            Reset All Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-destructive/30 text-destructive hover:text-destructive bg-transparent"
            onClick={() => alert('Not implemented')}
          >
            Clear Cache
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-destructive/30 text-destructive hover:text-destructive bg-transparent"
            onClick={() => alert('Not implemented')}
          >
            Export Database
          </Button>
        </div>

        <p className="mt-4 text-xs text-destructive/70">These actions are irreversible. Please proceed with caution.</p>
      </Card>
    </div>
  )
}
