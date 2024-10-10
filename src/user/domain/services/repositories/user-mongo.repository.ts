import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../../models/entities';
import { BaseMongoRepository } from '../../../../common/repositories';

@Injectable()
export class UserMongoRepository extends BaseMongoRepository<UserDocument> {
  constructor(@InjectModel('User', 'sample-db') readonly userModel: Model<UserDocument>) {
    super(userModel);
  }
}
