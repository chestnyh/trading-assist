import axios from 'axios';

const users = [
  {
    nickname: 'user1',
    email: 'user1@example.com',
    password: 'password1',
  },
  {
    nickname: 'user2',
    email: 'user2@example.com',
    password: 'password2',
  },
  {
    nickname: 'user3',
    email: 'user3@example.com',
    password: 'password3',
  }
]

describe('Create User', () => {
  it.each(users)('should create a user with $nickname', async (user) => {
    const res = await axios.post(`/api/v1/users`, user);
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject(user);} 
  )
});
