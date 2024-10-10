import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/entities';
import { BaseMongoFactory } from '../../../../common/factories';

@Injectable()
export class UserMongoFactory extends BaseMongoFactory<UserDocument> {
  constructor(@InjectModel('User', 'sample-db') readonly userModel: Model<UserDocument>) {
    super(userModel);
  }
}
