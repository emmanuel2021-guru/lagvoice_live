/**
 * App Root
 * Routing configuration with public and role-protected routes
 */
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AdminLayout } from './components/common/Layout'
import { StudentLayout } from './components/common/Layout'

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const FacultyDashboard = lazy(() => import('./pages/FacultyDashboard'))
const FeedbackForm = lazy(() => import('./pages/FeedbackForm'))
const TicketList = lazy(() => import('./pages/TicketList'))
const TicketDetail = lazy(() => import('./pages/TicketDetail'))
const EvaluationForm = lazy(() => import('./pages/EvaluationForm'))
const AdminComplaints = lazy(() => import('./pages/AdminComplaints'))
const AdminPolls = lazy(() => import('./pages/AdminPolls'))
const AdminReports = lazy(() => import('./pages/AdminReports'))
const AdminEvaluations = lazy(() => import('./pages/AdminEvaluations'))
const AdminQaAudits = lazy(() => import('./pages/AdminQaAudits'))
const AdminServicomCharters = lazy(() => import('./pages/AdminServicomCharters'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const AdminSettings = lazy(() => import('./pages/AdminSettings'))
const StudentPolls = lazy(() => import('./pages/StudentPolls'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const StaffDashboard = lazy(() => import('./pages/StaffDashboard'))
const SecureInbox = lazy(() => import('./pages/SecureInbox'))
const NonStaffDashboard = lazy(() => import('./pages/NonStaffDashboard'))
const NonStaffPolls = lazy(() => import('./pages/NonStaffPolls'))
const NonStaffMemos = lazy(() => import('./pages/NonStaffMemos'))
const FacultyPeerReview = lazy(() => import('./pages/FacultyPeerReview'))
const SupervisoryAssessment = lazy(() => import('./pages/SupervisoryAssessment'))
const HodSelfAssessment = lazy(() => import('./pages/HodSelfAssessment'))
const HodDashboard = lazy(() => import('./pages/HodDashboard'))
const DeanDashboard = lazy(() => import('./pages/DeanDashboard'))
const HrDashboard = lazy(() => import('./pages/HrDashboard'))
import StaffLayout from './components/common/Layout/StaffLayout'

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <img src="/images/logo-n.png" alt="LagVoice" className="w-10 h-10 rounded-xl object-contain animate-pulse" />
        <p className="text-sm text-ink/40">Loading LagVoice...</p>
      </div>
    </div>
  )
}

// Placeholder page for unimplemented routes
function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-bold text-ink mb-2">{title}</h2>
        <p className="text-ink/40">This page is under development.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><StudentDashboard /></StudentLayout>
            </ProtectedRoute>
          }
        />
        {/* Staff / Non-Staff Routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffLayout><StaffDashboard /></StaffLayout>
            </ProtectedRoute>
          }
        />
          <Route path="/hod" element={<ProtectedRoute allowedRoles={['hod']}><StaffLayout><HodDashboard /></StaffLayout></ProtectedRoute>} />
          <Route path="/dean" element={<ProtectedRoute allowedRoles={['dean']}><StaffLayout><DeanDashboard /></StaffLayout></ProtectedRoute>} />
        {/* HR Routes */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <StaffLayout><HrDashboard /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/*"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <StaffLayout><HrDashboard /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/inbox"
          element={
            <ProtectedRoute allowedRoles={['staff', 'non-staff', 'hod', 'dean', 'hr']}>
              <StaffLayout><SecureInbox /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/ticket/:id"
          element={
            <ProtectedRoute allowedRoles={['staff', 'non-staff', 'hod', 'dean', 'hr']}>
              <StaffLayout><TicketDetail /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-staff"
          element={
            <ProtectedRoute allowedRoles={['staff', 'non-staff']}>
              <StaffLayout><NonStaffDashboard /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-staff/polls"
          element={
            <ProtectedRoute allowedRoles={['non-staff']}>
              <StaffLayout><NonStaffPolls /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-staff/memos"
          element={
            <ProtectedRoute allowedRoles={['non-staff']}>
              <StaffLayout><NonStaffMemos /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/peer-review"
          element={
            <ProtectedRoute allowedRoles={['staff', 'faculty', 'hod', 'dean']}>
              <StaffLayout><FacultyPeerReview /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/supervisory"
          element={
            <ProtectedRoute allowedRoles={['hod', 'dean']}>
              <StaffLayout><SupervisoryAssessment /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/self-assessment"
          element={
            <ProtectedRoute allowedRoles={['hod', 'dean']}>
              <StaffLayout><HodSelfAssessment /></StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/feedback"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><FeedbackForm /></StudentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tickets"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><TicketList /></StudentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/ticket/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><TicketDetail /></StudentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/evaluations"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><EvaluationForm /></StudentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/polls"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><StudentPolls /></StudentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><ProfilePage /></StudentLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminComplaints /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/evaluations"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminEvaluations /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/qa"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminQaAudits /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/servicom"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminServicomCharters /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/polls"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminPolls /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminReports /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inbox"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><SecureInbox /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminUsers /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminSettings /></AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <AdminLayout><FacultyDashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/peer-review"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <AdminLayout><FacultyPeerReview /></AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

