
export enum AppTab {
  DASHBOARD = 'Dashboard',
  REPORTS = 'Reports',
  DOMAIN = 'Domain Details',
  HOSTING = 'Hosting Details',
  PAYMENTS = 'Payments',
  WEBSITE_PAYMENT = 'Website Payment',
  SEO = 'SEO',
  WORKTIME = 'Work Time',
  MAINTENANCE = 'Maintenance',
  HELP = 'Help',
  CLIENTS = 'Manage Clients',
  SOURCE_CODE = 'System Source'
}

export type UserRole = 'ADMIN' | 'CLIENT';

export interface ActivityLog {
  id: string;
  task: string;
  date: string;
  icon: 'ShieldCheck' | 'Download' | 'Zap' | 'CheckCircle2';
  color: 'emerald' | 'blue' | 'orange' | 'purple';
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  type: string;
}

export interface WebsitePayment {
  id: string;
  title: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
}

export interface MaintenanceTask {
  id: string;
  name: string;
  status: 'Completed' | 'Active' | 'Scheduled';
  date: string;
  icon: 'Zap' | 'ShieldCheck' | 'Database' | 'RefreshCw' | 'Settings';
}

export interface KeywordRanking {
  id: string;
  term: string;
  rank: number;
  change: string; // e.g., "+2", "-1", "NEW"
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  clientData?: ClientData;
  email: string;
}

export interface ClientData {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  domain: string;
  // SEO Specs
  seoScore: number;
  seoImpressions: number;
  seoCTR: number;
  seoTotalKeywords: number;
  seoRankings: KeywordRanking[]; 
  trafficData: number[]; // Trend chart values
  organicPercent: number;
  directPercent: number;
  referralPercent: number;
  // Performance Audit
  speedIndex: string;
  mobileUX: string;
  // Hosting & Domain Specs
  domainExpiry: string;
  serverExpiry: string;
  registrar: string;
  serverIP: string;
  serverLocation: string;
  phpVersion: string;
  osVersion: string;
  dbVersion: string;
  // Activity & Maintenance
  maintenanceStatus: 'Up to Date' | 'Pending' | 'Action Required';
  maintenancePlanName: string;
  maintenanceNextCharge: string;
  maintenanceSecurityScore: number;
  maintenanceBackupStatus: string;
  maintenancePerformanceResponse: string;
  maintenanceTasks: MaintenanceTask[];
  activityLog: ActivityLog[];
  // Financials
  monthlyPrice: number;
  maintenancePrice: number;
  invoices: Invoice[];
  websitePayments: WebsitePayment[];
  workTime: WorkTime;
}
export interface WorkTimeActivity {
  activity_title: string;
  activity_status: string;
  activity_hours: number;
}

export interface WorkTime {
  total: number;
  used: number;
  design: number;
  development: number;
  seo: number;
  activity: WorkTimeActivity[];
}
