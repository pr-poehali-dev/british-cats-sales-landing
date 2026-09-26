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
  profile_id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
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

export const api = {
  login: (code: string) =>
    call<{ token: string; role: 'student' | 'admin'; has_profile: boolean }>(AUTH, 'login', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
  me: () => call<Me>(AUTH, 'me'),
  logout: () => call<{ ok: boolean }>(AUTH, 'logout', { method: 'POST' }),

  listCodes: () =>
    call<{ codes: AccessCode[]; stats: Record<string, number> }>(CODES, 'list'),
  createCodes: (payload: { count: number; group_name?: string; course_name?: string; period?: string; note?: string }) =>
    call<{ created: { id: number; code: string }[] }>(CODES, 'create', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  disableCode: (id: number) =>
    call<{ ok: boolean }>(CODES, 'disable', { method: 'POST', body: JSON.stringify({ id }) }),
  enableCode: (id: number) =>
    call<{ ok: boolean }>(CODES, 'enable', { method: 'POST', body: JSON.stringify({ id }) }),
  regenerateCode: (id: number) =>
    call<{ id: number; code: string }>(CODES, 'regenerate', { method: 'POST', body: JSON.stringify({ id }) }),
};
