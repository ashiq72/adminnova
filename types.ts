
export enum UserRoleEnum {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export type TBloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: UserRoleEnum;
  isDeleted: boolean;
  image?: string;
  gender?: GenderEnum;
  bloodGroup?: TBloodGroup;
  dateOfBirth?: string;
  about?: string;
  bio?: string;
  website?: string;
  location?: string;
  permanentAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponseData {
  accessToken: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
