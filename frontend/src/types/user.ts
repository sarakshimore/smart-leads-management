export type AppRole = "admin" | "sales";

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: AppRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
