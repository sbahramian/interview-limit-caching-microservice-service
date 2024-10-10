import { GetUserDataByIdQuery } from './get-user-profile-by-id.query'; 

describe('GetUserDataByIdQuery', () => {
  it('should create an instance of GetUserDataByIdQuery', () => {
    const userId = '123';
    const lang = 'ENGLISH';
    
    const query = new GetUserDataByIdQuery(userId, lang);
    
    expect(query).toBeInstanceOf(GetUserDataByIdQuery);
    expect(query.userId).toEqual(userId);
    expect(query.lang).toEqual(lang);
  });
});
