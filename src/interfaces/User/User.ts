export interface IBaseUser {
  id: string;
  state: string;
  full_name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends IBaseUser {
  user_name: string;
  firebase_id: string;
  phone_number: null;
  email: string;
  role: string;
  shop_id: string;

  latitude: string;
  longitude: string;
}
