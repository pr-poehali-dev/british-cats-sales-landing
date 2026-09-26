import func2url from '../../backend/func2url.json';

const TOKEN_KEY = 'cabinet_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string | null;
  industry: string;
  profession: string | null;
  employment_type: string;
  consent_accepted_at: string | null;
}

export interface Me {
  role: 'student' | 'admin';
  has_profile: boolean;
  profile: Profile | null;
  group_name: string | null;
  course_name: string | null;
  period: string | null;
}

export interface Question {
  id: number;
  position: number;
  question_code: string;
  text: string;
  hint: string | null;
  type: string;
  options_json: string[] | { min: number; max: number } | null;
  is_required: boolean;
  max_choices: number | null;
  conditional_logic_json: { depends_on: string; not_equals?: string; in?: string[] } | null;
}

export interface Assignment {
  assignment_id: number;
  questionnaire_id: number;
  title: string;
  type: 'entrance' | 'checkpoint' | 'final';
  period: string | null;
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  completed_at: string | null;
  current_question: number | null;
  score: string | null;
  test_correct: number | null;
  test_total: number | null;
  total_questions: number;
  answered: number;
}

export type Answers = Record<string, unknown>;

export interface SurveyData {
  assignment: { id: number; status: string; questionnaire_id: number; title: string; type: string; period: string | null };
  questions: Question[];
  response: {
    answers: Answers;
    current_question: number;
    status: string;
    score: string | null;
    test_correct: number | null;
    test_total: number | null;
  };
}

export interface StudentDashboard {
  profile: Profile;
  group_name: string | null;
  course_name: string | null;
  period: string | null;
  assignments: Assignment[];
}

export interface ProgressItem {
  type: 'entrance' | 'checkpoint' | 'final';
  title: string;
  period: string | null;
  completed_at: string;
  score: number | null;
  self_score: number | null;
  satisfaction: number | null;
  ai_frequency: string | null;
  applied: string | null;
  comprehension: string | null;
  activity: string | null;
}

export interface ReportRow {
  label: string;
  before: string;
  after: string;
  delta: string | null;
  positive: boolean;
}

export interface ReportData {
  ready: boolean;
  has_entrance?: boolean;
  has_final?: boolean;
  rows?: ReportRow[];
  goal?: { text: string | null; task: string | null; reached: string | null; task_solved: string | null };
  main_result?: string | null;
  changes?: string | null;
  next_plans?: string | null;
  satisfaction?: number | null;
  new_tasks?: string[];
  dynamics?: { period: string; satisfaction: number | null; self_score: number | null; applied: string | null }[];
  completed_at?: string;
}

export interface AdminStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string | null;
  industry: string;
  profession: string | null;
  employment_type: string;
  created_at: string;
  pin_hint: string | null;
  group_name: string | null;
  course_name: string | null;
  completed_count: number;
  entrance_score: string | null;
  final_score: string | null;
  last_csat: number | null;
  last_continue: string | null;
  attention: boolean;
}

export interface AdminSurvey {
  id: number;
  title: string;
  type: 'entrance' | 'checkpoint' | 'final';
  period: string | null;
  status: 'draft' | 'available' | 'closed';
  questions_count: number;
  assigned: number;
  completed: number;
}

export interface AccessCode {
  id: number;
  code_hint: string;
  group_name: string | null;
  course_name: string | null;
  period: string | null;
  role: string;
  status: 'new' | 'activated' | 'disabled';
  note: string | null;
  activated_at: string | null;
  created_at: string;
  is_group: boolean;
  max_students: number | null;
  students_count: number;
}

export interface CheckCodeResult {
  step: 'pin' | 'done';
  token?: string;
  role?: 'student' | 'admin';
  ticket?: string;
  group_name?: string | null;
  course_name?: string | null;
  period?: string | null;
  students_count?: number;
  group_full?: boolean;
}

const call = async <T>(url: string, action: string, init?: RequestInit): Promise<T> => {
  const token = getToken();
  const res = await fetch(`${url}?action=${action}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-Cabinet-Token': token } : {}),
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Ошибка запроса');
  return data as T;
};

const AUTH = func2url['cabinet-auth'];
const CODES = func2url['cabinet-admin-codes'];
const STUDENT = func2url['cabinet-student'];
const SURVEYS = func2url['cabinet-admin-surveys'];

export const api = {
  checkCode: (code: string) =>
    call<CheckCodeResult>(AUTH, 'check-code', { method: 'POST', body: JSON.stringify({ code }) }),
  loginPin: (ticket: string, pin: string) =>
    call<{ token: string; role: 'student'; first_name: string }>(AUTH, 'login-pin', {
      method: 'POST',
      body: JSON.stringify({ ticket, pin }),
    }),
  me: () => call<Me>(AUTH, 'me'),
  logout: () => call<{ ok: boolean }>(AUTH, 'logout', { method: 'POST' }),

  listCodes: () =>
    call<{ codes: AccessCode[]; stats: Record<string, number> }>(CODES, 'list'),
  createCodes: (payload: {
    group_name: string;
    course_name?: string;
    period?: string;
    custom_code?: string;
    max_students?: number | null;
  }) =>
    call<{ created: { id: number; code: string; group_name: string }[] }>(CODES, 'create', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  disableCode: (id: number) =>
    call<{ ok: boolean }>(CODES, 'disable', { method: 'POST', body: JSON.stringify({ id }) }),
  enableCode: (id: number) =>
    call<{ ok: boolean }>(CODES, 'enable', { method: 'POST', body: JSON.stringify({ id }) }),
  regenerateCode: (id: number, customCode?: string) =>
    call<{ id: number; code: string }>(CODES, 'regenerate', {
      method: 'POST',
      body: JSON.stringify({ id, custom_code: customCode }),
    }),
  disableAllCodes: () => call<{ affected: number }>(CODES, 'disable-all', { method: 'POST', body: '{}' }),
  enableAllCodes: () => call<{ affected: number }>(CODES, 'enable-all', { method: 'POST', body: '{}' }),

  createProfile: (payload: Record<string, unknown>) =>
    call<{ profile_id: number; token: string }>(STUDENT, 'profile-create', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  changePin: (currentPin: string, newPin: string) =>
    call<{ ok: boolean }>(STUDENT, 'pin-change', {
      method: 'POST',
      body: JSON.stringify({ current_pin: currentPin, new_pin: newPin }),
    }),
  updateProfile: (payload: Record<string, unknown>) =>
    call<{ ok: boolean }>(STUDENT, 'profile-update', { method: 'POST', body: JSON.stringify(payload) }),
  dashboard: () => call<StudentDashboard>(STUDENT, 'dashboard'),
  getSurvey: (assignmentId: number) =>
    call<SurveyData>(STUDENT, `survey-get&assignment_id=${assignmentId}`),
  saveAnswer: (payload: { assignment_id: number; question_code: string; value: unknown; current_question: number }) =>
    call<{ ok: boolean }>(STUDENT, 'answer-save', { method: 'POST', body: JSON.stringify(payload) }),
  completeSurvey: (assignmentId: number) =>
    call<{ test_correct: number | null; test_total: number | null; score: number | null; already?: boolean }>(
      STUDENT, 'survey-complete', { method: 'POST', body: JSON.stringify({ assignment_id: assignmentId }) },
    ),
  progress: () => call<{ items: ProgressItem[]; has_enough: boolean }>(STUDENT, 'progress'),
  report: () => call<ReportData>(STUDENT, 'report'),

  adminSurveys: () => call<{ surveys: AdminSurvey[] }>(SURVEYS, 'list'),
  setSurveyStatus: (id: number, status: 'draft' | 'available' | 'closed') =>
    call<{ ok: boolean }>(SURVEYS, 'set-status', { method: 'POST', body: JSON.stringify({ id, status }) }),
  adminStudents: () => call<{ students: AdminStudent[] }>(SURVEYS, 'students'),
  adminStudent: (id: number) =>
    call<{ profile: Record<string, unknown>; responses: Record<string, unknown>[]; questions: Record<string, unknown>[] }>(
      SURVEYS, `student&id=${id}`,
    ),
  adminAnalytics: () => call<Record<string, unknown>>(SURVEYS, 'analytics'),
  deleteStudent: (id: number) =>
    call<{ ok: boolean }>(SURVEYS, 'student-delete', { method: 'POST', body: JSON.stringify({ id }) }),
  resetStudentPin: (id: number, pin: string) =>
    call<{ ok: boolean }>(SURVEYS, 'student-pin-reset', { method: 'POST', body: JSON.stringify({ id, pin }) }),
};