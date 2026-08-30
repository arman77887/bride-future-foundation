export interface User {
  id: string;
  name?: string;
  email: string;
  status: string;
  two_factor_enabled: boolean;
  roles?: string[];
}

export interface Department {
  id: string;
  name_bn: string;
  name_en: string;
  slug: string;
}

export interface Position {
  id: string;
  title_bn: string;
  title_en: string;
  slug: string;
}

export interface OfficerProfile {
  id: string;
  official_id: string;
  name: string;
  status: string;
  is_public: boolean;
  department?: Department;
  position?: Position;
  email_personal: string;
  phone: string;
}

export interface Vacancy {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  deadline: string;
  department?: Department;
}
