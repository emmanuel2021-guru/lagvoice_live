/**
 * AdminReports — Automated Accreditation Reporting
 * NUC reports, departmental reports, export options
 */
import { useState } from 'react'

import { qaService } from '../services/qaService'
import { ticketService } from '../services/ticketService'
import { servicomService } from '../services/servicomService'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const REPORT_TYPES = [
  { id: 'nuc', title: 'NUC Accreditation Report', description: 'Generate a formatted report for the National Universities Commission', icon: (
    <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  )},
  { id: 'institutional', title: 'Institutional Self-Study', description: 'Comprehensive internal quality review report', icon: (
    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  )},
  { id: 'departmental', title: 'Departmental Review', description: 'Performance report for a specific department', icon: (
    <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )},
  { id: 'compliance', title: 'QA Compliance Report', description: 'Quality assurance compliance status and gaps', icon: (
    <svg className="w-5 h-5 text-resolved" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  )},
]

const departments = []

export default function AdminReports() {
  const [generating, setGenerating] = useState(null)
  const [dateRange, setDateRange] = useState('this_month')

  const handleGenerate = async (type) => {
    setGenerating(type)
    try {
      if (type === 'nuc') {
        const result = await qaService.getAllSelfAssessments()
        const assessments = result.data || result
        const nucAssessments = assessments.filter(a => a.accreditationBody === 'NUC')

        const doc = new jsPDF()
        
        // Header
        doc.setFontSize(18)
        doc.setTextColor(128, 0, 0) // Maroon
        doc.text('National Universities Commission (NUC)', 14, 20)
        
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text('Institutional Accreditation Readiness Report', 14, 28)
        
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34)

        // Generate Table Data
        const tableBody = nucAssessments.map(a => [
          a.department,
          a.programName,
          a.submittedBy?.name || 'Unknown',
          a.readinessScore !== undefined && a.readinessScore !== null ? `${a.readinessScore}%` : 'Pending',
          a.status.toUpperCase()
        ])

        if (tableBody.length === 0) {
          tableBody.push([{ content: 'No NUC assessments submitted yet.', colSpan: 5, styles: { halign: 'center', textColor: [150, 150, 150] } }])
        }

        autoTable(doc, {
          startY: 40,
          head: [['Department', 'Program', 'HOD/Submitter', 'Compliance Score', 'Status']],
          body: tableBody,
          headStyles: { fillColor: [128, 0, 0] },
          styles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        })

        doc.save('NUC_Accreditation_Report.pdf')
      } else if (type === 'institutional') {
        // --- SERVICOM Institutional Self-Study Report ---
        const ticketsResult = await ticketService.getTickets()
        const tickets = ticketsResult?.data || ticketsResult || []
        const chartersResult = await servicomService.getCharters()
        const charters = Array.isArray(chartersResult) ? chartersResult : (chartersResult?.data || [])

        const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')
        const rate = tickets.length > 0 ? ((resolved.length / tickets.length) * 100).toFixed(1) : '0.0'

        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.setTextColor(128, 0, 0)
        doc.text('SERVICOM Institutional Self-Study Report', 14, 20)
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text('University of Lagos — Quality Assurance Ecosystem', 14, 28)
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34)

        // Summary
        doc.setFontSize(13)
        doc.setTextColor(0, 0, 0)
        doc.text('Executive Summary', 14, 46)
        doc.setFontSize(10)
        doc.text(`Total Complaints Filed: ${tickets.length}`, 14, 54)
        doc.text(`Resolved / Closed: ${resolved.length}`, 14, 60)
        doc.text(`Resolution Rate: ${rate}%`, 14, 66)
        doc.text(`Service Charters Published: ${charters.length}`, 14, 72)

        // Charters table
        const charterBody = charters.length > 0
          ? charters.map(c => [
              c.department,
              `${c.slaHours || 48}h`,
              Array.isArray(c.commitments) ? c.commitments.length : 0
            ])
          : [[{ content: 'No service charters published yet.', colSpan: 3, styles: { halign: 'center', textColor: [150, 150, 150] } }]]

        autoTable(doc, {
          startY: 80,
          head: [['Department', 'SLA (hours)', 'Commitments']],
          body: charterBody,
          headStyles: { fillColor: [128, 0, 0] },
          styles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        })

        doc.save('SERVICOM_Institutional_Self_Study.pdf')

      } else if (type === 'departmental') {
        // --- SERVICOM Departmental Performance Review ---
        const ticketsResult = await ticketService.getTickets()
        const tickets = ticketsResult?.data || ticketsResult || []

        // Group by category (department)
        const deptMap = {}
        tickets.forEach(t => {
          const dept = t.category || 'Uncategorized'
          if (!deptMap[dept]) deptMap[dept] = { total: 0, resolved: 0, pending: 0 }
          deptMap[dept].total++
          if (t.status === 'resolved' || t.status === 'closed') deptMap[dept].resolved++
          else deptMap[dept].pending++
        })

        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.setTextColor(128, 0, 0)
        doc.text('SERVICOM Departmental Performance Review', 14, 20)
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text('Complaint Resolution by Department', 14, 28)
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34)

        const deptBody = Object.keys(deptMap).length > 0
          ? Object.entries(deptMap).map(([dept, stats]) => [
              dept,
              stats.total,
              stats.resolved,
              stats.pending,
              stats.total > 0 ? `${((stats.resolved / stats.total) * 100).toFixed(1)}%` : '0.0%'
            ])
          : [[{ content: 'No complaint data available.', colSpan: 5, styles: { halign: 'center', textColor: [150, 150, 150] } }]]

        autoTable(doc, {
          startY: 42,
          head: [['Department', 'Total', 'Resolved', 'Pending', 'Resolution Rate']],
          body: deptBody,
          headStyles: { fillColor: [128, 0, 0] },
          styles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        })

        doc.save('SERVICOM_Departmental_Review.pdf')

      } else if (type === 'compliance') {
        // --- QA Compliance Report (NUC + NBTE) ---
        const result = await qaService.getAllSelfAssessments()
        const assessments = result?.data || result || []

        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.setTextColor(128, 0, 0)
        doc.text('Quality Assurance Compliance Report', 14, 20)
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text('NUC & NBTE Accreditation Readiness Overview', 14, 28)
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34)

        const compBody = assessments.length > 0
          ? assessments.map(a => [
              a.department,
              a.programName,
              a.accreditationBody || 'N/A',
              a.readinessScore !== undefined && a.readinessScore !== null ? `${a.readinessScore}%` : 'Pending',
              (a.status || 'draft').toUpperCase()
            ])
          : [[{ content: 'No self-assessments submitted yet.', colSpan: 5, styles: { halign: 'center', textColor: [150, 150, 150] } }]]

        autoTable(doc, {
          startY: 42,
          head: [['Department', 'Program', 'Accreditation Body', 'Readiness Score', 'Status']],
          body: compBody,
          headStyles: { fillColor: [128, 0, 0] },
          styles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        })

        doc.save('QA_Compliance_Report.pdf')

      } else {
        alert('Unknown report type.')
      }
    } catch (err) {
      console.error(err)
      alert(`Error generating report: ${err.message || err}`)
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-gold-dark uppercase tracking-[0.15em] mb-1">Reporting</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Reports</h1>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_TYPES.map(r => (
          <div key={r.id} className="bg-paper rounded-2xl border border-mist/50 p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-maroon/5 flex items-center justify-center shrink-0">
                {r.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-ink">{r.title}</h3>
                <p className="text-[12px] text-ink/35 mt-0.5">{r.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerate(r.id)}
                disabled={generating === r.id}
                className="flex-1 py-2.5 rounded-xl bg-maroon text-white font-semibold text-[13px] shadow-[0_2px_6px_rgba(128,0,0,0.15)] hover:bg-maroon-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating === r.id ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Generating...
                  </>
                ) : 'Generate Report'}
              </button>
              <button className="px-4 py-2.5 rounded-xl border border-mist/70 text-ink/50 font-semibold text-[13px] hover:bg-cream transition-all flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Department Performance */}
      <div className="bg-paper rounded-2xl border border-mist/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-bold text-ink">Department Performance</h2>
            <p className="text-[12px] text-ink/30 mt-0.5">Complaint metrics by department</p>
          </div>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-2 text-[12px] rounded-lg bg-cream border border-mist/50 text-ink focus:outline-none focus:ring-2 focus:ring-maroon/15 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]"
          >
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
        </div>
        <div className="space-y-3">
          {departments.length === 0 ? (
            <div className="text-center py-8 bg-paper rounded-2xl border border-mist/50">
              <p className="text-[14px] text-ink/40 font-medium">No departmental data available.</p>
            </div>
          ) : (
            departments.map(dept => {
              const resolutionRate = Math.round((dept.resolved / dept.complaints) * 100)
            return (
              <div key={dept.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ink">{dept.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-ink/30">{dept.complaints} complaints</span>
                    <span className="text-[11px] text-ink/15">·</span>
                    <span className="text-[11px] text-resolved">{dept.resolved} resolved</span>
                  </div>
                </div>
                <div className="w-24">
                  <div className="h-1.5 bg-mist-light rounded-full overflow-hidden">
                    <div className="h-full bg-maroon rounded-full" style={{ width: `${resolutionRate}%` }} />
                  </div>
                </div>
                <span className="text-[12px] font-mono font-semibold text-ink/50 w-10 text-right">{resolutionRate}%</span>
              </div>
          )
        }))}
      </div>
      </div>
    </div>
  )
}
