import axios from 'axios';

const users = [
  {
    "nickname": "user1",
    "email": "user1@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "tradingExperienceLevel": "Intermediate",
    "primaryTradingStrategy": "DayTrading",
    "riskTolerance": "Moderate",
    "preferredTradingPlatforms": [
      "Binance",
      "Bybit"
    ]
  },
  {
    "nickname": "user2",
    "email": "user2@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "tradingExperienceLevel": "Intermediate",
    "primaryTradingStrategy": "DayTrading",
    "riskTolerance": "Moderate",
    "preferredTradingPlatforms": [
      "Binance",
      "Bybit"
    ]
  },
  {
    "nickname": "user3",
    "email": "user3@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "tradingExperienceLevel": "Intermediate",
    "primaryTradingStrategy": "DayTrading",
    "riskTolerance": "Moderate",
    "preferredTradingPlatforms": [
      "Binance",
      "Bybit"
    ]
  },
]

describe('Create User', () => {
  it.each(users)('should create a user with $nickname', async (user) => {
    const res = await axios.post(`/api/v1/users`, user);
    expect(res.status).toBe(201);
    
    // Check only specific fields that should match
    const expectedFields = {
      nickname: user.nickname,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tradingExperienceLevel: user.tradingExperienceLevel,
      primaryTradingStrategy: user.primaryTradingStrategy,
      riskTolerance: user.riskTolerance,
      preferredTradingPlatforms: user.preferredTradingPlatforms,
    };
    
    expect(res.data).toMatchObject(expectedFields);
    // Ensure password is not returned
    expect(res.data).not.toHaveProperty('password');
  });
});
