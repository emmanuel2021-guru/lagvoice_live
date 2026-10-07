/**
 * Integration Tests for Departmental HR Persona (/api/hr)
 * Framework: Jest & Supertest
 *
 * Verifies:
 * 1. Unauthenticated requests receive HTTP 401.
 * 2. Non-HR roles receive HTTP 403 Forbidden.
 * 3. HR users without assigned departments receive HTTP 403 Forbidden.
 * 4. Multi-tenant department isolation:
 *    - An HR officer in "Department A" attempting to access "Department B"
 *      receives a 403 Forbidden error upon cross-department tamper attempts.
 *    - Legitimate queries return data strictly scoped to the officer's department,
 *      and an HR officer in an empty "Department B" receives empty lists ([]).
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Test JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_for_lagvoice_dev';
process.env.JWT_SECRET = JWT_SECRET;

// Mock test users
const mockUsers = {
  hrDeptA: {
    id: 101,
    name: 'HR Officer Dept A',
    email: 'hr.deptA@unilag.edu.ng',
    role: 'hr',
    department: 'Department A',
    faculty: 'Faculty of Science'
  },
  hrDeptB: {
    id: 102,
    name: 'HR Officer Dept B',
    email: 'hr.deptB@unilag.edu.ng',
    role: 'hr',
    department: 'Department B',
    faculty: 'Faculty of Arts'
  },
  hrNoDept: {
    id: 103,
    name: 'HR Officer No Dept',
    email: 'hr.nodept@unilag.edu.ng',
    role: 'hr',
    department: null,
    faculty: 'Administration'
  },
  student: {
    id: 104,
    name: 'Student User',
    email: 'student@student.unilag.edu.ng',
    role: 'student',
    department: 'Department A',
    faculty: 'Faculty of Science'
  }
};

// Mock data strictly segmented by department
const mockStaffMembersDeptA = [
  {
    id: 201,
    name: 'Dr. Alice DeptA',
    email: 'alice@unilag.edu.ng',
    role: 'faculty',
    staffId: 'UNILAG/STF/201',
    department: 'Department A',
    faculty: 'Faculty of Science',
    createdAt: new Date('2026-01-10')
  },
  {
    id: 202,
    name: 'Mr. Bob DeptA',
    email: 'bob@unilag.edu.ng',
    role: 'staff',
    staffId: 'UNILAG/STF/202',
    department: 'Department A',
    faculty: 'Faculty of Science',
    createdAt: new Date('2026-02-15')
  }
];

const mockTicketsDeptA = [
  {
    id: 301,
    trackingId: 'UNILAG-11111',
    title: 'AC fault in Room 101',
    description: 'AC unit leaking water.',
    category: 'Department A',
    subcategory: 'Facilities',
    urgency: 'high',
    status: 'under_review',
    pipelineStep: 'submitted',
    location: 'Building A, Room 101',
    isAnonymous: false,
    slaDeadline: new Date('2026-10-10'),
    images: null,
    submittedBy: {
      id: 201,
      name: 'Dr. Alice DeptA',
      email: 'alice@unilag.edu.ng',
      role: 'faculty',
      staffId: 'UNILAG/STF/201',
      studentId: null,
      department: 'Department A'
    },
    comments: [],
    timeline: [],
    createdAt: new Date('2026-10-01'),
    updatedAt: new Date('2026-10-02')
  }
];

// Helper to generate auth tokens
const createToken = (user) => jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

// Mock @prisma/client
jest.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      findUnique: jest.fn(({ where }) => {
        const found = Object.values(mockUsers).find(u => u.id === where.id);
        if (!found) return Promise.resolve(null);
        return Promise.resolve({
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
          department: found.department
        });
      }),
      findMany: jest.fn(({ where }) => {
        const dept = where?.department?.equals || where?.department;
        if (dept && dept.toLowerCase() === 'department a') {
          return Promise.resolve(mockStaffMembersDeptA);
        }
        return Promise.resolve([]);
      }),
      count: jest.fn(({ where }) => {
        const dept = where?.department?.equals || where?.department;
        if (dept && dept.toLowerCase() === 'department a') {
          return Promise.resolve(mockStaffMembersDeptA.length);
        }
        return Promise.resolve(0);
      }),
      groupBy: jest.fn(({ where }) => {
        const dept = where?.department?.equals || where?.department;
        if (dept && dept.toLowerCase() === 'department a') {
          return Promise.resolve([
            { role: 'faculty', _count: { id: 1 } },
            { role: 'staff', _count: { id: 1 } }
          ]);
        }
        return Promise.resolve([]);
      })
    },
    ticket: {
      count: jest.fn(({ where }) => {
        const deptFilter = where?.OR?.[0]?.category?.equals;
        if (deptFilter && deptFilter.toLowerCase() === 'department a') {
          if (where?.status?.in) return Promise.resolve(1); // unresolved
          if (where?.status === 'resolved') return Promise.resolve(0);
          return Promise.resolve(1); // total
        }
        return Promise.resolve(0);
      }),
      findMany: jest.fn(({ where }) => {
        // Multi-tenant check: extract department queried
        const orClauses = where?.OR || where?.AND?.[0]?.OR || [];
        const matchesDeptA = orClauses.some(clause =>
          clause.category?.equals?.toLowerCase() === 'department a' ||
          clause.submittedBy?.department?.equals?.toLowerCase() === 'department a'
        );
        if (matchesDeptA) {
          return Promise.resolve(mockTicketsDeptA);
        }
        return Promise.resolve([]);
      })
    },
    peerReview: {
      findMany: jest.fn(({ where }) => {
        const revieweeIds = where?.revieweeId?.in || [];
        if (revieweeIds.includes(201)) {
          return Promise.resolve([
            {
              id: 401,
              revieweeId: 201,
              reviewerId: 202,
              scores: { clarity: 5, engagement: 4 },
              comments: 'Great lecture',
              createdAt: new Date('2026-09-15'),
              reviewer: { id: 202, name: 'Mr. Bob DeptA', role: 'staff', department: 'Department A' },
              reviewee: { id: 201, name: 'Dr. Alice DeptA' }
            }
          ]);
        }
        return Promise.resolve([]);
      })
    },
    supervisoryAssessment: {
      findMany: jest.fn(({ where }) => {
        const staffIds = where?.staffId?.in || [];
        if (staffIds.includes(201)) {
          return Promise.resolve([
            {
              id: 501,
              staffId: 201,
              supervisorId: 101,
              scores: { teaching: 4.5, administration: 5.0 },
              remarks: 'Consistently high performer',
              createdAt: new Date('2026-09-20'),
              supervisor: { id: 101, name: 'HR Officer Dept A', role: 'hr' },
              staff: { id: 201, name: 'Dr. Alice DeptA' }
            }
          ]);
        }
        return Promise.resolve([]);
      })
    },
    evaluation: {
      aggregate: jest.fn(() => Promise.resolve({
        _avg: { overallRating: 4.5 },
        _count: { id: 10 }
      }))
    }
  };

  return { PrismaClient: jest.fn(() => mPrisma) };
});

// Import app after mocking @prisma/client
const app = require('../index');

describe('Departmental HR API Integration Tests (/api/hr)', () => {
  let tokenDeptA;
  let tokenDeptB;
  let tokenNoDept;
  let tokenStudent;

  beforeAll(() => {
    tokenDeptA = createToken(mockUsers.hrDeptA);
    tokenDeptB = createToken(mockUsers.hrDeptB);
    tokenNoDept = createToken(mockUsers.hrNoDept);
    tokenStudent = createToken(mockUsers.student);
  });

  // =========================================================================
  // 1. Authentication & Role Authorization
  // =========================================================================
  describe('Authentication & Role Verification', () => {
    it('should return 401 Unauthorized when no Authorization header is provided', async () => {
      const res = await request(app).get('/api/hr/overview');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it('should return 401 Unauthorized when an invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/hr/overview')
        .set('Authorization', 'Bearer invalid.jwt.token');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 403 Forbidden when a student accesses HR routes', async () => {
      const res = await request(app)
        .get('/api/hr/overview')
        .set('Authorization', `Bearer ${tokenStudent}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/hr role required/i);
    });

    it('should return 403 Forbidden when an HR user has no department assigned', async () => {
      const res = await request(app)
        .get('/api/hr/overview')
        .set('Authorization', `Bearer ${tokenNoDept}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not assigned to any department/i);
    });
  });

  // =========================================================================
  // 2. Cross-Department Tamper Defense (403 Forbidden)
  // =========================================================================
  describe('Multi-Tenant Department Isolation: Tamper Defense', () => {
    it('should return 403 Forbidden when HR in Department A attempts overview for Department B', async () => {
      const res = await request(app)
        .get('/api/hr/overview?department=Department B')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cross-department data access attempt/i);
    });

    it('should return 403 Forbidden when HR in Department A attempts to query staff for Department B', async () => {
      const res = await request(app)
        .get('/api/hr/staff?department=Department B')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cross-department/i);
    });

    it('should return 403 Forbidden when HR in Department A attempts to query grievances for Department B', async () => {
      const res = await request(app)
        .get('/api/hr/grievances?department=Department B')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cross-department/i);
    });

    it('should return 403 Forbidden when HR in Department A attempts to query appraisals for Department B', async () => {
      const res = await request(app)
        .get('/api/hr/appraisals?department=Department B')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cross-department/i);
    });
  });

  // =========================================================================
  // 3. Department Data Scoping & Empty List Verification
  // =========================================================================
  describe('GET /api/hr/staff - Department Scoping', () => {
    it('should return staff members belonging strictly to Department A for HR in Department A', async () => {
      const res = await request(app)
        .get('/api/hr/staff')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department A');
      expect(res.body.count).toBe(2);
      expect(res.body.staff).toHaveLength(2);

      // Verify all returned staff belong exclusively to Department A
      res.body.staff.forEach(member => {
        expect(member.department).toBe('Department A');
        expect(member.status).toBe('active');
        expect(member).toHaveProperty('appraisalSummary');
      });
    });

    it('should return an empty list [] for HR in Department B when no staff belong to Department B', async () => {
      const res = await request(app)
        .get('/api/hr/staff')
        .set('Authorization', `Bearer ${tokenDeptB}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department B');
      expect(res.body.count).toBe(0);
      expect(res.body.staff).toEqual([]);
    });
  });

  describe('GET /api/hr/overview - Department Scoping', () => {
    it('should return metrics strictly scoped to Department A', async () => {
      const res = await request(app)
        .get('/api/hr/overview')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department A');
      expect(res.body.data.totalStaffCount).toBe(2);
      expect(res.body.data.unresolvedTickets).toBe(1);
      expect(res.body.data.supervisoryRatingsAverage).toBeGreaterThan(0);
    });

    it('should return zeroed summary stats for HR in Department B with no data', async () => {
      const res = await request(app)
        .get('/api/hr/overview')
        .set('Authorization', `Bearer ${tokenDeptB}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department B');
      expect(res.body.data.totalStaffCount).toBe(0);
      expect(res.body.data.unresolvedTickets).toBe(0);
      expect(res.body.data.pendingPeerReviews).toBe(0);
    });
  });

  describe('GET /api/hr/grievances - Department Scoping', () => {
    it('should return grievance tickets scoped strictly to Department A', async () => {
      const res = await request(app)
        .get('/api/hr/grievances')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department A');
      expect(res.body.count).toBe(1);
      expect(res.body.tickets).toHaveLength(1);
      expect(res.body.tickets[0].category).toBe('Department A');
    });

    it('should return empty list [] for HR in Department B when no tickets exist in Department B', async () => {
      const res = await request(app)
        .get('/api/hr/grievances')
        .set('Authorization', `Bearer ${tokenDeptB}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department B');
      expect(res.body.count).toBe(0);
      expect(res.body.tickets).toEqual([]);
    });
  });

  describe('GET /api/hr/appraisals - Department Scoping', () => {
    it('should return aggregated appraisal data scoped to Department A', async () => {
      const res = await request(app)
        .get('/api/hr/appraisals')
        .set('Authorization', `Bearer ${tokenDeptA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department A');
      expect(res.body.summary.totalStaff).toBe(2);
      expect(res.body.roster).toHaveLength(2);
    });

    it('should return empty roster [] and 0 totalStaff for Department B', async () => {
      const res = await request(app)
        .get('/api/hr/appraisals')
        .set('Authorization', `Bearer ${tokenDeptB}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.department).toBe('Department B');
      expect(res.body.summary.totalStaff).toBe(0);
      expect(res.body.roster).toEqual([]);
    });
  });
});
