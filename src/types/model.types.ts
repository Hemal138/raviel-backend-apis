export interface OtpModel {
  _id: string;
  otp: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleModel {
  name: string;
  description: string;
  isActive: boolean;
}

export interface UserModel {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  roleId: string;
  isActive: boolean;
}
