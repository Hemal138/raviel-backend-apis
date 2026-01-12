export interface User {
  _id: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  isActive: boolean;
}

export interface FetchUser {
  page?: number;
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: number;
  search?: string;
  [key: string]: any;
}
