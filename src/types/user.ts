export interface UserI {
  id?: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  role: "admin" | "recruiter" | "user";
}

export interface UserDataI {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}
