export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';

export type DepartmentType = 'CS' | 'Mech' | 'Commerce' | 'Arts' | 'IT' | 'Civil';

export interface RiskBreakdown {
  attendance: number;
  academics: number;
  engagement: number;
  fees: number;
}

export interface Intervention {
  id: string;
  studentId: string;
  type: 'counseling' | 'parent_contact' | 'tutoring' | 'fee_extension' | 'medical_leave' | 'academic_probation';
  title: string;
  notes: string;
  date: string;
  counselor: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  outcome?: string;
}

export interface StudentContact {
  studentPhone: string;
  studentEmail: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
}

export interface PrimaryIssue {
  title: string;
  description: string;
  icon: string;
  category: 'attendance' | 'fees' | 'exams' | 'counseling' | 'health';
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: DepartmentType;
  degree: string;
  semester: number;
  year: number;
  riskScore: number; // 0 - 100
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  avatarUrl?: string;
  tags: string[];
  primaryIssue: PrimaryIssue;
  riskBreakdown: RiskBreakdown;
  interventions: Intervention[];
  contact: StudentContact;
  attendanceRate: number; // e.g. 48%
  cgpa: number; // e.g. 5.8
  feeDueDays?: number;
  mentorName: string;
}

export interface SystemAlert {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  degree: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timeAgo: string;
  timestamp: string;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved';
  assignedTo?: string;
}

export type MainTab = 'dashboard' | 'students' | 'alerts' | 'reports' | 'settings';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'critical' | 'alert' | 'intervention' | 'system';
  studentId?: string;
}

export interface RiskSettings {
  attendanceWeight: number;
  academicWeight: number;
  feeWeight: number;
  engagementWeight: number;
  highRiskThreshold: number;
  mediumRiskThreshold: number;
  emailAlertsEnabled: boolean;
  smsAlertsEnabled: boolean;
  autoAssignCounselor: boolean;
}
