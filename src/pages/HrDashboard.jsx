/**
 * HrDashboard.jsx
 * UNILAG LagVoice Departmental HR Dashboard
 *
 * Designed with UNILAG brand palette: Navy (#1E1B4B), Maroon (#800000), Gold (#D4AF37), Cream (#F0F3F8)
 * Complete dark mode support and responsive layout.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import hrService from '../services/hrService'
import {
  HrHeaderBanner,
  HrKpiStats,
  HrStaffRoster,
  HrAppraisalsChart,
  HrGrievancesFeed,
  HrStaffModal,
  HrLoadingSkeleton,
  HrErrorAlert,
} from '../components/hr'
import {
  LayoutDashboard,
  Users,
  Award,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

export default function HrDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // State
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)

  // Remote data state
  const [overviewData, setOverviewData] = useState(null)
  const [staffData, setStaffData] = useState([])
  const [appraisalsData, setAppraisalsData] = useState(null)
  const [grievancesData, setGrievancesData] = useState([])

  // Determine active view tab based on URL path or in-page selection
  const currentTab = useMemo(() => {
    const path = location.pathname.toLowerCase()
    if (path.includes('/hr/staff')) return 'staff'
    if (path.includes('/hr/appraisals')) return 'appraisals'
    if (path.includes('/hr/grievances')) return 'grievances'
    return 'overview'
  }, [location.pathname])

  const handleTabChange = (tabKey) => {
    const targetMap = {
      overview: '/hr',
      staff: '/hr/staff',
      appraisals: '/hr/appraisals',
      grievances: '/hr/grievances',
    }
    navigate(targetMap[tabKey] || '/hr')
  }

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch all departmental HR metrics
  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [overviewRes, staffRes, appraisalsRes, grievancesRes] = await Promise.allSettled([
          hrService.getHrOverview(),
          hrService.getDepartmentStaff(),
          hrService.getDepartmentAppraisals(),
          hrService.getDepartmentGrievances(),
        ])

        if (!active) return

        let hasSuccess = false

        // 1. Overview Data
        if (overviewRes.status === 'fulfilled' && overviewRes.value) {
          setOverviewData(overviewRes.value.data || overviewRes.value)
          hasSuccess = true
        }

        // 2. Staff Data
        if (staffRes.status === 'fulfilled' && staffRes.value) {
          const staffList = staffRes.value.staff || (Array.isArray(staffRes.value) ? staffRes.value : [])
          setStaffData(staffList)
          hasSuccess = true
        }

        // 3. Appraisals Data
        if (appraisalsRes.status === 'fulfilled' && appraisalsRes.value) {
          setAppraisalsData(appraisalsRes.value)
          hasSuccess = true
        }

        // 4. Grievances Data
        if (grievancesRes.status === 'fulfilled' && grievancesRes.value) {
          const ticketList = grievancesRes.value.tickets || (Array.isArray(grievancesRes.value) ? grievancesRes.value : [])
          setGrievancesData(ticketList)
          hasSuccess = true
        }

        // Check if all endpoints were rejected
        if (!hasSuccess) {
          const firstError = overviewRes.reason || staffRes.reason || appraisalsRes.reason || grievancesRes.reason
          throw new Error(firstError?.message || 'Failed to connect to HR department services')
        }

        // Check for partial failures across endpoints
        const hasPartialFailure = [overviewRes, staffRes, appraisalsRes, grievancesRes].some(
          (res) => res.status === 'rejected'
        )

        setLastUpdated(new Date())
        if (hasPartialFailure) {
          setError('Some departmental services failed to load. Dashboard data may be incomplete.')
        } else {
          setError(null)
        }
      } catch (err) {
        if (!active) return
        console.error('HR Dashboard fetch error:', err)
        setError(err.message || 'Unable to load departmental HR metrics')
      } finally {
        if (active) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [refreshTrigger])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  // Derive consolidated KPI metrics
  const totalStaffCount =
    overviewData?.totalStaffCount ||
    staffData.length ||
    appraisalsData?.summary?.totalStaff ||
    0

  const academicStaffCount = staffData.filter((s) =>
    ['faculty', 'staff', 'hod', 'dean'].includes(s.role?.toLowerCase())
  ).length
  const nonAcademicStaffCount = staffData.filter((s) =>
    s.role?.toLowerCase() === 'non-staff'
  ).length

  const appraisalRate =
    appraisalsData?.summary?.completionRate ??
    (totalStaffCount > 0
      ? Number(
          (
            (staffData.filter((s) => s.appraisalSummary?.appraisalStatus === 'complete').length /
              totalStaffCount) *
            100
          ).toFixed(1)
        )
      : 0)

  const fullyCompletedAppraisals =
    appraisalsData?.summary?.fullyCompleted ??
    staffData.filter((s) => s.appraisalSummary?.appraisalStatus === 'complete').length

  const openComplaintsCount =
    overviewData?.unresolvedTickets ??
    grievancesData.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length

  const urgentComplaintsCount = grievancesData.filter(
    (t) =>
      t.urgency?.toLowerCase() === 'high' &&
      t.status !== 'resolved' &&
      t.status !== 'closed'
  ).length

  const supervisoryRatingsAverage =
    overviewData?.supervisoryRatingsAverage ??
    appraisalsData?.summary?.supervisory?.averageScore ??
    0

  const peerReviewAverage =
    appraisalsData?.summary?.peerReview?.averageScore ?? 0

  const pendingPeerReviews =
    overviewData?.pendingPeerReviews ??
    appraisalsData?.summary?.peerReview?.pending ??
    0

  // Quick navigation tabs
  const tabItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff Directory', count: totalStaffCount, icon: Users },
    { id: 'appraisals', label: 'Appraisals & Reviews', count: `${Math.round(appraisalRate)}%`, icon: Award },
    { id: 'grievances', label: 'Department Grievances', count: openComplaintsCount, alert: openComplaintsCount > 0, icon: AlertCircle },
  ]

  // KPI card click handler
  const handleKpiCardClick = (cardId) => {
    switch (cardId) {
      case 'staff':
        handleTabChange('staff')
        break
      case 'appraisals':
      case 'score':
        handleTabChange('appraisals')
        break
      case 'grievances':
        handleTabChange('grievances')
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-850 dark:text-slate-100">
      {/* 1. Header Banner */}
      <HrHeaderBanner
        user={user}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        totalStaff={totalStaffCount}
        pendingAppraisals={pendingPeerReviews}
      />

      {/* Error notification if any */}
      {error && (
        <HrErrorAlert
          title="Data Synchronization Notice"
          message={error}
          onRetry={handleRefresh}
          retrying={refreshing}
          onDismiss={() => setError(null)}
        />
      )}

      {/* 2. Quick Views / Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2">
          {tabItems.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1E1B4B] text-white shadow-sm dark:bg-indigo-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.alert
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Role Scope: <strong>Departmental HR</strong></span>
        </div>
      </div>

      {/* 3. Loading State Skeleton */}
      {loading ? (
        <HrLoadingSkeleton />
      ) : (
        <>
          {/* 4. KPI Stat Cards (Rendered across all tabs for high-level visibility) */}
          <HrKpiStats
            totalStaff={totalStaffCount}
            staffBreakdown={{ academic: academicStaffCount, nonAcademic: nonAcademicStaffCount }}
            appraisalRate={appraisalRate}
            appraisalSummary={{ fullyCompleted: fullyCompletedAppraisals, total: totalStaffCount }}
            openComplaints={openComplaintsCount}
            urgentComplaints={urgentComplaintsCount}
            supervisoryScore={supervisoryRatingsAverage}
            peerReviewScore={peerReviewAverage}
            onCardClick={handleKpiCardClick}
          />

          {/* 5. Dynamic Tab View Content */}

          {/* VIEW: OVERVIEW (Comprehensive all-in-one view) */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Mid-Row: Appraisals Visual Chart + Grievances Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                  <HrAppraisalsChart
                    appraisalsData={appraisalsData}
                    loading={loading}
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col">
                  <HrGrievancesFeed
                    tickets={grievancesData}
                    loading={loading}
                  />
                </div>
              </div>

              {/* Bottom-Row: Department Staff Roster */}
              <div>
                <HrStaffRoster
                  staffList={staffData}
                  loading={loading}
                  onSelectStaff={(staff) => setSelectedStaff(staff)}
                />
              </div>
            </div>
          )}

          {/* VIEW: STAFF DIRECTORY ONLY */}
          {currentTab === 'staff' && (
            <div className="space-y-6 animate-fade-in">
              <HrStaffRoster
                staffList={staffData}
                loading={loading}
                onSelectStaff={(staff) => setSelectedStaff(staff)}
              />
            </div>
          )}

          {/* VIEW: APPRAISALS & REVIEWS ONLY */}
          {currentTab === 'appraisals' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                  <HrAppraisalsChart
                    appraisalsData={appraisalsData}
                    loading={loading}
                  />
                </div>
              </div>

              {/* Roster filtered to appraisal context */}
              <div>
                <HrStaffRoster
                  staffList={staffData}
                  loading={loading}
                  onSelectStaff={(staff) => setSelectedStaff(staff)}
                />
              </div>
            </div>
          )}

          {/* VIEW: GRIEVANCES & ESCALATIONS ONLY */}
          {currentTab === 'grievances' && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <HrGrievancesFeed
                  tickets={grievancesData}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* 6. Staff Detail Modal */}
      {selectedStaff && (
        <HrStaffModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  )
}
