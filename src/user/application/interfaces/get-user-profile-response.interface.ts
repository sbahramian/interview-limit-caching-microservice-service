import { MetaInterface } from 'src/common';

export interface GetUserDataResponseInterface {
  userId: string;
  firstName: string;
  lastName: string;
  gender: string;
  bio: string;
  jobTitle: string;
  avatar: string;
  phone: string;
  streetAddress: string;
}

export interface UserInterface extends GetUserDataResponseInterface {}

export interface GetUserDataResponse {
  data: GetUserDataResponseInterface;
  meta: MetaInterface;
}
