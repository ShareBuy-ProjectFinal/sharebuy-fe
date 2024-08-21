export interface IBaseUser {
  id: string;
  fullName: string;
  avatar: string;
}

export interface IUser extends IBaseUser {
  phoneNumber: null;
  role: string;
  email: string;
  latitude: string;
  longitude: string;
  isWorking: boolean;
  sloc: string;
  departmentName: string;
  departmentCode: null;
  plantCode: string;
  companyId: string;
  companyName: string;
}
