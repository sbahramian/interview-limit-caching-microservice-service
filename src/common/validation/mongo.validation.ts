import { ObjectId } from 'bson';

export class Validation {
  static AreMongoIds(strArray: string[]): boolean {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return strArray.every((str) => objectIdRegex.test(str));
  }

  static IsMongoIdArray(strArray: string[]): boolean[] {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return strArray.map((str) => objectIdRegex.test(str));
  }

  static IsMongoId(str: string): boolean {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(str);
  }

  static IsObjectId(bytes: Uint8Array): boolean {
    if (bytes.length !== 12) {
      return false;
    }
    try {
      new ObjectId(bytes);
      return true;
    } catch {
      return false;
    }
  }
}
