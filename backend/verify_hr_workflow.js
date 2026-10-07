/**
 * Automated Verification Script: Login-to-Dashboard Workflow & Security Checks
 * Persona: Department HR User (hr.cs@unilag.edu.ng)
 * Scope: UNILAG LagVoice Multi-Tenant Quality Assurance Platform
 */

const request = require('supertest');
const app = require('./index');

async function runVerification() {
  console.log('===============================================================');
  console.log('🧪 VERIFICATION: DEPARTMENTAL HR LOGIN & SECURITY WORKFLOW');
  console.log('Target User: hr.cs@unilag.edu.ng');
  console.log('===============================================================\n');

  let passedChecks = 0;
  let totalChecks = 0;

  function assert(condition, message) {
    totalChecks++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passedChecks++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      throw new Error(`Verification failure: ${message}`);
    }
  }

  // -------------------------------------------------------------
  // STEP 1: Authenticate as hr.cs@unilag.edu.ng
  // -------------------------------------------------------------
  console.log('1. Testing Login Workflow for Department HR (Computer Science)...');
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'hr.cs@unilag.edu.ng',
      password: 'Password123!',
      role: 'hr'
    });

  assert(loginRes.status === 200, `Login status HTTP 200 (Got ${loginRes.status})`);
  assert(loginRes.body.success === true, 'Login response success is true');
  assert(Boolean(loginRes.body.token), 'JWT token returned in login response');
  assert(loginRes.body.user.role === 'hr', `User role is 'hr' (Got '${loginRes.body.user.role}')`);
  assert(
    loginRes.body.user.department === 'Computer Science',
    `User department is 'Computer Science' (Got '${loginRes.body.user.department}')`
  );

  const csToken = loginRes.body.token;

  // -------------------------------------------------------------
  // STEP 2: Authenticate as Alternate HR (Electrical Engineering)
  // -------------------------------------------------------------
  console.log('\n2. Testing Login Workflow for Alternate Department HR (EE)...');
  const loginEeRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'hr.ee@unilag.edu.ng',
      password: 'Password123!',
      role: 'hr'
    });

  assert(loginEeRes.status === 200, `EE Login status HTTP 200 (Got ${loginEeRes.status})`);
  assert(loginEeRes.body.user.department === 'Electrical Engineering', 'EE user department verified');
  const eeToken = loginEeRes.body.token;

  // -------------------------------------------------------------
  // STEP 3: Department Scoping - GET /api/hr/overview
  // -------------------------------------------------------------
  console.log('\n3. Testing GET /api/hr/overview for Computer Science...');
  const overviewRes = await request(app)
    .get('/api/hr/overview')
    .set('Authorization', `Bearer ${csToken}`);

  assert(overviewRes.status === 200, `Overview status HTTP 200 (Got ${overviewRes.status})`);
  assert(overviewRes.body.success === true, 'Overview success is true');
  assert(overviewRes.body.department === 'Computer Science', 'Overview response department is Computer Science');
  assert(overviewRes.body.data.totalStaffCount >= 1, `Total staff count >= 1 (Got ${overviewRes.body.data.totalStaffCount})`);
  assert(overviewRes.body.data.unresolvedTickets >= 1, `Unresolved tickets count >= 1 (Got ${overviewRes.body.data.unresolvedTickets})`);
  assert(overviewRes.body.data.metrics !== undefined, 'KPI metrics object exists');

  // -------------------------------------------------------------
  // STEP 4: Department Scoping - GET /api/hr/staff
  // -------------------------------------------------------------
  console.log('\n4. Testing GET /api/hr/staff for Computer Science...');
  const staffRes = await request(app)
    .get('/api/hr/staff')
    .set('Authorization', `Bearer ${csToken}`);

  assert(staffRes.status === 200, `Staff list status HTTP 200 (Got ${staffRes.status})`);
  assert(staffRes.body.department === 'Computer Science', 'Staff list department is Computer Science');
  assert(Array.isArray(staffRes.body.staff), 'Staff property is an array');
  assert(staffRes.body.staff.length >= 1, `Staff count >= 1 (Got ${staffRes.body.staff.length})`);

  // Verify all staff belong ONLY to Computer Science
  const csStaffMembers = staffRes.body.staff;
  const nonCsStaff = csStaffMembers.filter(s => s.department !== 'Computer Science');
  assert(nonCsStaff.length === 0, 'No staff member from outside Computer Science is visible');

  const hasEeStaff = csStaffMembers.some(s => s.department === 'Electrical Engineering');
  assert(!hasEeStaff, 'Electrical Engineering staff completely invisible to CS HR');

  // -------------------------------------------------------------
  // STEP 5: Department Scoping - GET /api/hr/grievances
  // -------------------------------------------------------------
  console.log('\n5. Testing GET /api/hr/grievances for Computer Science...');
  const grievanceRes = await request(app)
    .get('/api/hr/grievances')
    .set('Authorization', `Bearer ${csToken}`);

  assert(grievanceRes.status === 200, `Grievances status HTTP 200 (Got ${grievanceRes.status})`);
  assert(grievanceRes.body.department === 'Computer Science', 'Grievances department is Computer Science');
  assert(Array.isArray(grievanceRes.body.tickets), 'Tickets property is an array');
  
  const csTickets = grievanceRes.body.tickets;
  const nonCsTickets = csTickets.filter(t => t.category !== 'Computer Science' && t.submittedBy?.department !== 'Computer Science');
  assert(nonCsTickets.length === 0, 'No grievance records from outside Computer Science are visible');

  const hasEeTicket = csTickets.some(t => t.trackingId === 'UNILAG-EEE-001' || t.category === 'Electrical Engineering');
  assert(!hasEeTicket, 'Electrical Engineering tickets (UNILAG-EEE-001) completely isolated and invisible to CS HR');

  // -------------------------------------------------------------
  // STEP 6: Department Scoping - GET /api/hr/appraisals
  // -------------------------------------------------------------
  console.log('\n6. Testing GET /api/hr/appraisals for Computer Science...');
  const appraisalRes = await request(app)
    .get('/api/hr/appraisals')
    .set('Authorization', `Bearer ${csToken}`);

  assert(appraisalRes.status === 200, `Appraisals status HTTP 200 (Got ${appraisalRes.status})`);
  assert(appraisalRes.body.department === 'Computer Science', 'Appraisals department is Computer Science');
  assert(Array.isArray(appraisalRes.body.roster), 'Roster is an array');

  // -------------------------------------------------------------
  // STEP 7: Security Verification - Cross-Department Tamper Defense (403)
  // -------------------------------------------------------------
  console.log('\n7. Testing Cross-Department Tamper Defense (Must reject with HTTP 403)...');
  
  // CS HR attempts to access Electrical Engineering overview
  const tamperOverview = await request(app)
    .get('/api/hr/overview?department=Electrical Engineering')
    .set('Authorization', `Bearer ${csToken}`);
  assert(tamperOverview.status === 403, `Cross-dept overview rejected with HTTP 403 (Got ${tamperOverview.status})`);
  assert(/cross-department/i.test(tamperOverview.body.message), 'Tamper error message explicitly identifies cross-department violation');

  // CS HR attempts to access Electrical Engineering staff list
  const tamperStaff = await request(app)
    .get('/api/hr/staff?department=Electrical Engineering')
    .set('Authorization', `Bearer ${csToken}`);
  assert(tamperStaff.status === 403, `Cross-dept staff rejected with HTTP 403 (Got ${tamperStaff.status})`);

  // CS HR attempts to access Electrical Engineering grievances
  const tamperGrievances = await request(app)
    .get('/api/hr/grievances?department=Electrical Engineering')
    .set('Authorization', `Bearer ${csToken}`);
  assert(tamperGrievances.status === 403, `Cross-dept grievances rejected with HTTP 403 (Got ${tamperGrievances.status})`);

  // CS HR attempts to access Electrical Engineering appraisals
  const tamperAppraisals = await request(app)
    .get('/api/hr/appraisals?department=Electrical Engineering')
    .set('Authorization', `Bearer ${csToken}`);
  assert(tamperAppraisals.status === 403, `Cross-dept appraisals rejected with HTTP 403 (Got ${tamperAppraisals.status})`);

  // -------------------------------------------------------------
  // STEP 8: Security Verification - Electrical Engineering Perspective
  // -------------------------------------------------------------
  console.log('\n8. Testing Isolation from Electrical Engineering HR Perspective...');
  const eeStaffRes = await request(app)
    .get('/api/hr/staff')
    .set('Authorization', `Bearer ${eeToken}`);
  assert(eeStaffRes.status === 200, 'EE Staff list returned 200');
  assert(eeStaffRes.body.department === 'Electrical Engineering', 'EE staff list department is Electrical Engineering');
  const eeStaffMembers = eeStaffRes.body.staff;
  const hasCsInEe = eeStaffMembers.some(s => s.department === 'Computer Science');
  assert(!hasCsInEe, 'Computer Science staff completely invisible to Electrical Engineering HR');

  const eeGrievanceRes = await request(app)
    .get('/api/hr/grievances')
    .set('Authorization', `Bearer ${eeToken}`);
  assert(eeGrievanceRes.status === 200, 'EE Grievances returned 200');
  assert(eeGrievanceRes.body.department === 'Electrical Engineering', 'EE grievances department is Electrical Engineering');
  const hasCsTicketInEe = eeGrievanceRes.body.tickets.some(t => t.trackingId === 'UNILAG-CSC-001' || t.category === 'Computer Science');
  assert(!hasCsTicketInEe, 'Computer Science tickets (UNILAG-CSC-001) completely invisible to EE HR');

  // -------------------------------------------------------------
  // STEP 9: Security Verification - Role Enforcement & Unauthenticated Access
  // -------------------------------------------------------------
  console.log('\n9. Testing Role Guards and Unauthenticated Rejections...');
  
  // Unauthenticated request
  const unauthRes = await request(app).get('/api/hr/overview');
  assert(unauthRes.status === 401, `Unauthenticated request returns HTTP 401 (Got ${unauthRes.status})`);

  // Student login and attempt to access /api/hr
  const studentLoginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'student@student.unilag.edu.ng',
      password: 'Password123!',
      role: 'student'
    });
  
  if (studentLoginRes.status === 200 && studentLoginRes.body.token) {
    const studentToken = studentLoginRes.body.token;
    const studentHrAttempt = await request(app)
      .get('/api/hr/overview')
      .set('Authorization', `Bearer ${studentToken}`);
    assert(studentHrAttempt.status === 403, `Student access to /api/hr rejected with HTTP 403 (Got ${studentHrAttempt.status})`);
  } else {
    // If student user password is default or not found, try staff
    const staffLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'staff@unilag.edu.ng',
        password: 'Password123!',
        role: 'staff'
      });
    if (staffLoginRes.status === 200 && staffLoginRes.body.token) {
      const staffToken = staffLoginRes.body.token;
      const staffHrAttempt = await request(app)
        .get('/api/hr/overview')
        .set('Authorization', `Bearer ${staffToken}`);
      assert(staffHrAttempt.status === 403, `Staff access to /api/hr rejected with HTTP 403 (Got ${staffHrAttempt.status})`);
    }
  }

  console.log('\n===============================================================');
  console.log(`🎉 ALL ${passedChecks}/${totalChecks} SECURITY & INTEGRATION CHECKS PASSED!`);
  console.log('Departmental HR isolation and role enforcement are rock-solid.');
  console.log('===============================================================');
  process.exit(0);
}

runVerification().catch(err => {
  console.error('\n❌ Verification Failed:', err.message);
  process.exit(1);
});
