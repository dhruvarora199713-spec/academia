/**
 * Profile Edit Forms — With validation, trim, type-safe buttons.
 */

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useProfile } from '@/store/profile-context'
import { useToast } from '@/components/shared/Toast'
import type { StudentDocument } from '@/types/firebase/schema'

// ─── Validation Helpers ───────────────────────────────────────────────────────

function validatePersonal(fields: Record<string, string>): string | null {
  const firstName = fields.firstName?.trim()
  const lastName = fields.lastName?.trim()
  if (!firstName || firstName.length < 2) return 'First name must be at least 2 characters'
  if (firstName.length > 50) return 'First name too long (max 50)'
  if (!lastName || lastName.length < 1) return 'Last name is required'
  if (lastName.length > 50) return 'Last name too long (max 50)'
  if (fields.phone && !/^\+?[\d\s-]{7,15}$/.test(fields.phone.trim())) return 'Invalid phone number'
  return null
}

function validateContact(fields: Record<string, string>): string | null {
  const email = fields.personalEmail?.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address'
  if (fields.phone && !/^\+?[\d\s-]{7,15}$/.test(fields.phone.trim())) return 'Invalid phone number'
  if (fields.pincode && !/^\d{5,6}$/.test(fields.pincode.trim())) return 'Pincode must be 5-6 digits'
  if (fields.currentAddress && fields.currentAddress.length > 200) return 'Address too long (max 200)'
  return null
}

// ─── Reusable Field Input ─────────────────────────────────────────────────────

function Field({ label, value, onChange, span, type = 'text', maxLength }: {
  label: string; value: string; onChange: (v: string) => void; span?: boolean; type?: string; maxLength?: number
}) {
  return (
    <div className={span ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-neutral-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength || 100}
        className="h-9 w-full rounded-lg border border-border bg-white px-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
      />
    </div>
  )
}

// ─── Personal Info Edit Form ──────────────────────────────────────────────────

export function PersonalInfoForm({ initial, onDone }: { initial: Record<string, string>; onDone: () => void }) {
  const { updateProfile } = useProfile()
  const { toast } = useToast()
  const [fields, setFields] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, val: string) => { setFields((p) => ({ ...p, [key]: val })); setError(null) }

  const handleSave = async () => {
    const validationError = validatePersonal(fields)
    if (validationError) { setError(validationError); return }

    setSaving(true)
    try {
      const success = await updateProfile({
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        fullName: `${fields.firstName.trim()} ${fields.lastName.trim()}`,
        dateOfBirth: fields.dateOfBirth?.trim() || '',
        gender: fields.gender?.trim() || '',
        bloodGroup: fields.bloodGroup?.trim() || '',
        nationality: fields.nationality?.trim() || '',
        phone: fields.phone?.trim() || '',
      } as Partial<StudentDocument>)
      if (success) {
        toast({ title: 'Personal info updated', variant: 'success' })
        onDone()
      } else {
        toast({ title: 'Save failed', description: 'Check network or deploy Firestore rules.', variant: 'error', duration: 8000 })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-xs text-error-600 bg-error-50 rounded-md px-3 py-2">{error}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="First Name *" value={fields.firstName || ''} onChange={(v) => set('firstName', v)} maxLength={50} />
        <Field label="Last Name *" value={fields.lastName || ''} onChange={(v) => set('lastName', v)} maxLength={50} />
        <Field label="Date of Birth" value={fields.dateOfBirth || ''} onChange={(v) => set('dateOfBirth', v)} type="date" />
        <Field label="Gender" value={fields.gender || ''} onChange={(v) => set('gender', v)} maxLength={20} />
        <Field label="Blood Group" value={fields.bloodGroup || ''} onChange={(v) => set('bloodGroup', v)} maxLength={5} />
        <Field label="Nationality" value={fields.nationality || ''} onChange={(v) => set('nationality', v)} maxLength={30} />
        <Field label="Phone" value={fields.phone || ''} onChange={(v) => set('phone', v)} span maxLength={15} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onDone} className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 rounded-md">Cancel</button>
        <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50">
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}Save
        </button>
      </div>
    </div>
  )
}

// ─── Contact Info Edit Form ───────────────────────────────────────────────────

export function ContactInfoForm({ initial, onDone }: { initial: Record<string, string>; onDone: () => void }) {
  const { updateProfile } = useProfile()
  const { toast } = useToast()
  const [fields, setFields] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, val: string) => { setFields((p) => ({ ...p, [key]: val })); setError(null) }

  const handleSave = async () => {
    const validationError = validateContact(fields)
    if (validationError) { setError(validationError); return }

    setSaving(true)
    try {
      const success = await updateProfile({
        personalEmail: fields.personalEmail?.trim() || '',
        phone: fields.phone?.trim() || '',
        currentAddress: fields.currentAddress?.trim() || '',
        permanentAddress: fields.permanentAddress?.trim() || '',
        city: fields.city?.trim() || '',
        state: fields.state?.trim() || '',
        pincode: fields.pincode?.trim() || '',
      } as Partial<StudentDocument>)
      if (success) { toast({ title: 'Contact info updated', variant: 'success' }); onDone() }
      else { toast({ title: 'Save failed', description: 'Check network or deploy Firestore rules.', variant: 'error', duration: 10000 }) }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-xs text-error-600 bg-error-50 rounded-md px-3 py-2">{error}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Personal Email" value={fields.personalEmail || ''} onChange={(v) => set('personalEmail', v)} type="email" maxLength={100} />
        <Field label="Phone" value={fields.phone || ''} onChange={(v) => set('phone', v)} maxLength={15} />
        <Field label="Current Address" value={fields.currentAddress || ''} onChange={(v) => set('currentAddress', v)} span maxLength={200} />
        <Field label="Permanent Address" value={fields.permanentAddress || ''} onChange={(v) => set('permanentAddress', v)} span maxLength={200} />
        <Field label="City" value={fields.city || ''} onChange={(v) => set('city', v)} maxLength={50} />
        <Field label="State" value={fields.state || ''} onChange={(v) => set('state', v)} maxLength={50} />
        <Field label="Pincode" value={fields.pincode || ''} onChange={(v) => set('pincode', v)} maxLength={6} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onDone} className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 rounded-md">Cancel</button>
        <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50">
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}Save
        </button>
      </div>
    </div>
  )
}
