// =========================
// Account
// =========================
export const ACCOUNT_TYPE = {
  Private: 'Private',
  Company: 'Company'
} as const;

export type AccountType = typeof ACCOUNT_TYPE[keyof typeof ACCOUNT_TYPE];


// =========================
// Business
// =========================
export const BUSINESS_MODEL = {
  Online: 'Online',
  Offline: 'Offline',
  Hybrid: 'Hybrid'
} as const;

export type BusinessModel = typeof BUSINESS_MODEL[keyof typeof BUSINESS_MODEL];


export const COMPANY_SIZE = {
  Solo: 'Solo',
  TwoToTen: 'TwoToTen',
  ElevenToFifty: 'ElevenToFifty',
  FiftyOneToTwoHundred: 'FiftyOneToTwoHundred',
  TwoHundredPlus: 'TwoHundredPlus'
} as const;

export type CompanySize = typeof COMPANY_SIZE[keyof typeof COMPANY_SIZE];


export const INDUSTRY_TYPE = {
  HealthcareMedical: 'HealthcareMedical',
  Dental: 'Dental',
  Aesthetics: 'Aesthetics',
  RealEstate: 'RealEstate',
  Hospitality: 'Hospitality',
  Retail: 'Retail',
  ECommerce: 'ECommerce',
  ProfessionalServices: 'ProfessionalServices',
  Construction: 'Construction',
  Automotive: 'Automotive',
  Education: 'Education',
  Logistics: 'Logistics',
  Beauty: 'Beauty',
  Wellness: 'Wellness',
  Manufacturing: 'Manufacturing',
  ItSoftware: 'ItSoftware',
  Other: 'Other'
} as const;

export type IndustryType = typeof INDUSTRY_TYPE[keyof typeof INDUSTRY_TYPE];


export const MAIN_GOAL = {
  GetMoreLeads: 'GetMoreLeads',
  RespondFasterToInquiries: 'RespondFasterToInquiries',
  AutomateSupport: 'AutomateSupport',
  AutomateBookings: 'AutomateBookings',
  ImproveReporting: 'ImproveReporting',
  ReduceWorkload: 'ReduceWorkload',
  Other: 'Other'
} as const;

export type MainGoal = typeof MAIN_GOAL[keyof typeof MAIN_GOAL];


export const CRM_TYPE = {
  None: 'None',
  HubSpot: 'HubSpot',
  Salesforce: 'Salesforce',
  Zoho: 'Zoho',
  Odoo: 'Odoo',
  Pipedrive: 'Pipedrive',
  Other: 'Other'
} as const;

export type CrmType = typeof CRM_TYPE[keyof typeof CRM_TYPE];


// =========================
// Onboarding
// =========================
export const ONBOARDING_STATUS = {
  NotStarted: 'NotStarted',
  InProgress: 'InProgress',
  Completed: 'Completed',
  Skipped: 'Skipped'
} as const;

export type OnboardingStatus = typeof ONBOARDING_STATUS[keyof typeof ONBOARDING_STATUS];


export const ONBOARDING_STEP = {
  First: 'First',
  Second: 'Second'
} as const;

export type OnboardingStep = typeof ONBOARDING_STEP[keyof typeof ONBOARDING_STEP];


// =========================
// User / Workspace
// =========================
export const USER_ROLE = {
  Default: 'Default',
  Admin: 'Admin'
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];


export const WORKSPACE_MEMBER_ROLE = {
  Owner: 'Owner',
  Member: 'Member'
} as const;

export type WorkspaceMemberRole = typeof WORKSPACE_MEMBER_ROLE[keyof typeof WORKSPACE_MEMBER_ROLE];
