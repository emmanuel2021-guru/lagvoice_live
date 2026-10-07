import React, { useState, useMemo } from 'react'
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Star,
  Award
} from 'lucide-react'
import HrEmptyState from './HrEmptyState'

/**
 * HrStaffRoster
 * Searchable and filterable department staff roster table
 */
export default function HrStaffRoster({
  staffList = [],
  onSelectStaff,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Helper for role styling
  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'faculty':
        return {
          label: 'Academic Faculty',
          cls: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/40',
        }
      case 'hod':
        return {
          label: 'Head of Dept',
          cls: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40',
        }
      case 'dean':
        return {
          label: 'Dean',
          cls: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/40',
        }
      case 'non-staff':
        return {
          label: 'Non-Academic',
          cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700/50',
        }
      default:
        return {
          label: role ? role.toUpperCase() : 'Staff',
          cls: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/40',
        }
    }
  }

  // Helper for status styling
  const getAppraisalStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Complete
          </span>
        )
      case 'partial':
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            In Progress
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            Pending
          </span>
        )
    }
  }

  // Filtered and searched list
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      // Role filter
      if (roleFilter !== 'all') {
        if (roleFilter === 'academic') {
          if (!['faculty', 'staff', 'hod', 'dean'].includes(staff.role?.toLowerCase())) {
            return false
          }
        } else if (staff.role?.toLowerCase() !== roleFilter.toLowerCase()) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== 'all') {
        const staffStatus = (staff.appraisalSummary?.appraisalStatus || staff.status || 'pending').toLowerCase()
        if (statusFilter === 'complete' && staffStatus !== 'complete') return false
        if (statusFilter === 'in_progress' && !['partial', 'in_progress'].includes(staffStatus)) return false
        if (statusFilter === 'pending' && staffStatus !== 'pending') return false
      }

      // Text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        const nameMatch = staff.name?.toLowerCase().includes(q)
        const emailMatch = staff.email?.toLowerCase().includes(q)
        const idMatch = (staff.staffId || staff.code || '').toLowerCase().includes(q)
        if (!nameMatch && !emailMatch && !idMatch) return false
      }

      return true
    })
  }, [staffList, searchTerm, roleFilter, statusFilter])

  // Pagination calculations
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage) || 1
  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredStaff.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredStaff, currentPage, itemsPerPage])

  const handleResetFilters = () => {
    setSearchTerm('')
    setRoleFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const isFiltered = searchTerm !== '' || roleFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Header with Title & Filter Controls */}
      <div className="p-5 lg:p-6 border-b border-slate-100 dark:border-slate-700/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#1E1B4B]/10 dark:bg-indigo-900/30 text-[#1E1B4B] dark:text-indigo-400">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Departmental Staff Roster
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Directory of personnel with appraisal completion and performance standing
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 self-start sm:self-center">
            {filteredStaff.length} {filteredStaff.length === 1 ? 'member' : 'members'} found
          </span>
        </div>

        {/* Search Bar & Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search staff by name, email, or staff ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1266f1]/30 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1266f1]/30 cursor-pointer"
            >
              <option value="all">All Designations</option>
              <option value="academic">Academic Staff</option>
              <option value="faculty">Faculty Lecturers</option>
              <option value="hod">Head of Dept (HOD)</option>
              <option value="non-staff">Non-Academic Personnel</option>
            </select>
          </div>

          {/* Appraisal Status Filter */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1266f1]/30 cursor-pointer"
            >
              <option value="all">All Appraisal Status</option>
              <option value="complete">Complete</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                title="Reset all filters"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Roster Table (Desktop) & Cards (Mobile) */}
      <div className="p-0 overflow-x-auto">
        {filteredStaff.length === 0 ? (
          <div className="p-8">
            <HrEmptyState
              variant={isFiltered ? 'search' : 'staff'}
              title={isFiltered ? 'No Matching Staff Records' : 'No Staff Members Registered'}
              description={
                isFiltered
                  ? 'No department personnel matched your search query or filter selection.'
                  : 'There are currently no staff members assigned to this department.'
              }
              actionLabel={isFiltered ? 'Clear Filters' : undefined}
              onAction={isFiltered ? handleResetFilters : undefined}
            />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="px-5 py-3.5">Staff Member</th>
                <th className="px-5 py-3.5">Designation</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Contact</th>
                <th className="px-5 py-3.5 hidden lg:table-cell">Supervisory / Peer</th>
                <th className="px-5 py-3.5">Appraisal</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 text-xs">
              {paginatedStaff.map((staff) => {
                const roleBadge = getRoleBadge(staff.role)
                const appraisalStatus = staff.appraisalSummary?.appraisalStatus || 'pending'
                const supervisoryScore = staff.appraisalSummary?.supervisoryAvgScore
                const peerScore = staff.appraisalSummary?.peerReviewAvgScore

                // Avatar initials
                const initials = staff.name
                  ? staff.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'ST'

                return (
                  <tr
                    key={staff.id}
                    onClick={() => onSelectStaff?.(staff)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors cursor-pointer group"
                  >
                    {/* Staff Name & ID */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-[#1E1B4B] dark:text-[#D4AF37] font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-600">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-[#1266f1] transition-colors">
                            {staff.name}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {staff.staffId || staff.code || `ID: ${staff.id}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Designation Badge */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleBadge.cls}`}>
                        {roleBadge.label}
                      </span>
                    </td>

                    {/* Email Contact */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <a
                        href={`mailto:${staff.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-600 dark:text-slate-300 hover:text-[#1266f1] truncate flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{staff.email}</span>
                      </a>
                    </td>

                    {/* Performance Scores mini column */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300" title="Supervisory Assessment Average">
                          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                          <span className="font-mono font-semibold">
                            {supervisoryScore ? Number(supervisoryScore).toFixed(1) : '—'}
                          </span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300" title="Peer Review Average">
                          <Award className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-mono font-semibold">
                            {peerScore ? Number(peerScore).toFixed(1) : '—'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Overall Appraisal Status */}
                    <td className="px-5 py-4">
                      {getAppraisalStatusBadge(appraisalStatus)}
                    </td>

                    {/* Row Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectStaff?.(staff)
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1266f1] hover:bg-[#1266f1]/10 transition-colors cursor-pointer"
                        title="View staff details & appraisals"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredStaff.length > itemsPerPage && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredStaff.length)}
            </strong> of <strong className="text-slate-900 dark:text-white">{filteredStaff.length}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
