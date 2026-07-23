import { useState, useRef } from 'react'
import { PageWrapper } from '@/layouts/PageWrapper'
import { User, GraduationCap, Phone, Users, AlertCircle } from 'lucide-react'
import { useProfile } from '@/store/profile-context'
import { useAuth } from '@/store/auth-context'
import { useAcademicData } from '@/store/academic-context'
import { useToast } from '@/components/shared/Toast'
import { ProfileSkeleton } from '@/components/shared/LoadingSkeleton'
import { PersonalInfoForm, ContactInfoForm } from './components/ProfileEditForms'
import { studentData } from './data'
import { ProfileHeader } from './components/ProfileHeader'
import { InfoSection } from './components/InfoSection'
import { SkillsSection } from './components/SkillsSection'
import { CertificationsSection } from './components/CertificationsSection'
import { AchievementsSection } from './components/AchievementsSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ResumeSection } from './components/ResumeSection'
import { AcademicStatsSection } from './components/AcademicStatsSection'
import { ActivityTimeline } from './components/ActivityTimeline'

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth()
  const { userDoc, studentDoc, loading, uploadAvatar } = useProfile()
  const { data: academicData } = useAcademicData()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editKey, setEditKey] = useState(0)
  const closeEdit = () => setEditKey((k) => k + 1)
  const [uploading, setUploading] = useState(false)

  if (loading && !userDoc && !studentDoc) {
    return <PageWrapper title="Profile"><ProfileSkeleton /></PageWrapper>
  }

  // ─── CANONICAL ACADEMIC STATS from AcademicContext (same as Results, Attendance, Dashboard)
  const canonicalStats = {
    cgpa: academicData.resultStats.cgpa,
    sgpa: academicData.results[academicData.results.length - 1]?.sgpa || 0,
    attendance: academicData.attendanceOverview.overallPercentage,
    creditsCompleted: academicData.resultStats.totalCredits,
    creditsTotal: academicData.resultStats.totalCreditsRequired,
    semesterRank: 12,
    batchStrength: 240,
    backlogs: 0,
    totalBacklogs: 0,
  }

  // ─── FIRESTORE-FIRST: Use real data, empty string for unfilled fields ───────
  // Never silently replace with mock data for user-editable fields.

  const displayName = userDoc?.displayName || user?.displayName || ''
  const firstName = studentDoc?.firstName || displayName.split(' ')[0] || ''
  const lastName = studentDoc?.lastName || displayName.split(' ').slice(1).join(' ') || ''
  const fullName = studentDoc?.fullName || displayName || ''

  const personal = {
    ...studentData.personal,
    firstName,
    lastName,
    fullName: fullName || 'Complete your profile',
    avatar: studentDoc?.avatar || userDoc?.photoURL || user?.photoURL || null,
    dateOfBirth: studentDoc?.dateOfBirth || '',
    gender: studentDoc?.gender || '',
    bloodGroup: studentDoc?.bloodGroup || '',
    nationality: studentDoc?.nationality || '',
    phone: studentDoc?.phone || '',
    languages: studentData.personal.languages, // Portfolio data — stays
  }

  const academic = {
    ...studentData.academic,
    rollNumber: studentDoc?.rollNumber || studentData.academic.rollNumber,
    branch: studentDoc?.branch || studentData.academic.branch,
    program: studentDoc?.program || studentData.academic.program,
    semester: studentDoc?.semester || academicData.subjects[0]?.semester || 6,
    section: studentDoc?.section || studentData.academic.section,
    batch: studentDoc?.batch || studentData.academic.batch,
  }

  const contact = {
    ...studentData.contact,
    email: userDoc?.email || user?.email || '',
    personalEmail: studentDoc?.personalEmail || '',
    phone: studentDoc?.phone || '',
    currentAddress: studentDoc?.currentAddress || '',
    permanentAddress: studentDoc?.permanentAddress || '',
    city: studentDoc?.city || '',
    state: studentDoc?.state || '',
  }

  const stats = {
    ...studentData.stats,
    cgpa: canonicalStats.cgpa,
    sgpa: canonicalStats.sgpa,
    attendance: canonicalStats.attendance,
    creditsCompleted: canonicalStats.creditsCompleted,
    creditsTotal: canonicalStats.creditsTotal,
    semesterRank: canonicalStats.semesterRank,
    batchStrength: canonicalStats.batchStrength,
    backlogs: canonicalStats.backlogs,
    totalBacklogs: canonicalStats.totalBacklogs,
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadAvatar(file)
    setUploading(false)
    if (url) toast({ title: 'Avatar updated', variant: 'success' })
    else toast({ title: 'Upload failed', variant: 'error' })
  }

  const profileData = { ...studentData, personal, academic, contact, stats }

  return (
    <PageWrapper title="Profile">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

      <ProfileHeader data={profileData} onEdit={() => {}} onAvatarClick={() => fileInputRef.current?.click()} uploading={uploading} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <InfoSection title="Personal Information" icon={User} editable delay={1} key={`personal-${editKey}`}
            editForm={<PersonalInfoForm initial={{ firstName: personal.firstName, lastName: personal.lastName, dateOfBirth: personal.dateOfBirth, gender: personal.gender, bloodGroup: personal.bloodGroup, nationality: personal.nationality, phone: personal.phone }} onDone={closeEdit} />}
            fields={[
              { label: 'Full Name', value: personal.fullName },
              { label: 'Date of Birth', value: personal.dateOfBirth ? formatDate(personal.dateOfBirth) : '' },
              { label: 'Gender', value: personal.gender },
              { label: 'Blood Group', value: personal.bloodGroup },
              { label: 'Nationality', value: personal.nationality },
              { label: 'Phone', value: personal.phone },
              { label: 'Languages', value: personal.languages.join(', '), span: 2 },
            ]} />

          <InfoSection title="Academic Information" icon={GraduationCap} delay={2} fields={[
            { label: 'Roll Number', value: academic.rollNumber },
            { label: 'Program', value: academic.program && academic.branch ? `${academic.program} — ${academic.branch}` : '', span: 2 },
            { label: 'Semester', value: academic.semester ? `${academic.semester} (Section ${academic.section})` : '' },
            { label: 'Batch', value: academic.batch },
          ]} />

          <InfoSection title="Contact Information" icon={Phone} editable delay={3}
            editForm={<ContactInfoForm initial={{ personalEmail: contact.personalEmail, phone: contact.phone, currentAddress: contact.currentAddress, permanentAddress: contact.permanentAddress, city: contact.city, state: contact.state, pincode: '' }} onDone={closeEdit} />}
            fields={[
              { label: 'University Email', value: contact.email },
              { label: 'Personal Email', value: contact.personalEmail },
              { label: 'Phone', value: contact.phone },
              { label: 'Current Address', value: contact.currentAddress, span: 2 },
              { label: 'City & State', value: contact.city && contact.state ? `${contact.city}, ${contact.state}` : '', span: 2 },
            ]} />

          <InfoSection title="Parents / Guardian" icon={Users} editable delay={4} fields={[
            { label: "Father's Name", value: studentDoc?.fatherName || '' },
            { label: "Father's Phone", value: studentDoc?.fatherPhone || '' },
            { label: "Father's Email", value: studentDoc?.fatherEmail || '' },
            { label: "Mother's Name", value: studentDoc?.motherName || '' },
            { label: "Mother's Phone", value: studentDoc?.motherPhone || '' },
            { label: "Mother's Email", value: studentDoc?.motherEmail || '' },
          ]} />

          <InfoSection title="Emergency Contact" icon={AlertCircle} editable delay={5} fields={[
            { label: 'Name', value: studentDoc?.emergencyContactName || '' },
            { label: 'Relation', value: studentDoc?.emergencyContactRelation || '' },
            { label: 'Phone', value: studentDoc?.emergencyContactPhone || '' },
          ]} />

          {/* Portfolio sections — use existing mock data (not user-editable via this page) */}
          <ProjectsSection projects={studentData.projects} delay={6} />
          <AchievementsSection achievements={studentData.achievements} delay={7} />
        </div>

        <div className="space-y-6">
          <AcademicStatsSection stats={stats} delay={2} />
          <ResumeSection resume={studentData.resume} delay={3} />
          <SkillsSection skills={studentData.skills} delay={4} />
          <CertificationsSection certifications={studentData.certifications} delay={5} />
          <ActivityTimeline activities={studentData.activities} delay={6} />
        </div>
      </div>
    </PageWrapper>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}
