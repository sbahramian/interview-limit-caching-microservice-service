import { GetUserDataResponseInterface, UserInterface } from '../interfaces';

export class GetUserDataMap {
  static async item(user: UserInterface): Promise<GetUserDataResponseInterface> {
    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      bio: user.bio,
      jobTitle: user.jobTitle,
      avatar: user.avatar,
      phone: user.phone,
      streetAddress: user.streetAddress,
    };
  }
}
