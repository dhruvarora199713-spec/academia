import { z } from 'zod'

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  religion: z.string().optional(),
  category: z.string().optional(),
  languages: z.string().min(1, 'At least one language is required'),
})

export const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  personalEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  alternatePhone: z.string().optional(),
  currentAddress: z.string().min(5, 'Address is required'),
  permanentAddress: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode is required'),
  country: z.string().min(2, 'Country is required'),
})

export const parentInfoSchema = z.object({
  fatherName: z.string().min(2, 'Father\'s name is required'),
  fatherOccupation: z.string().min(2, 'Occupation is required'),
  fatherPhone: z.string().min(10, 'Phone number is required'),
  fatherEmail: z.string().email('Invalid email'),
  motherName: z.string().min(2, 'Mother\'s name is required'),
  motherOccupation: z.string().min(2, 'Occupation is required'),
  motherPhone: z.string().min(10, 'Phone number is required'),
  motherEmail: z.string().email('Invalid email'),
})

export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  relation: z.string().min(2, 'Relation is required'),
  phone: z.string().min(10, 'Phone number is required'),
  alternatePhone: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>
export type ParentInfoFormData = z.infer<typeof parentInfoSchema>
export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>
