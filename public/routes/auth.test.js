const request= require('supertest');
const express= require('express');
const router= require('./auth');
const {User}= require('../../models');

jest.mock('../../models');

const app= express();
app.use(express.json());
app.use('/api/auth',router);

describe('USER API ENDPOINTS', () => {
  afterEach(()=>{
    jest.clearAllMocks();
  });

  it('should create an new USER ', async () => {
        const mockUser={
            id: 1,
            username:'testuser',
            email:'testuser@example.com',
            password:'hashed@password123',
        }

        User.create.mockResolvedValue(mockUser);

        const res= await request(app)
        .post('/api/auth/create')
        .send({
            username:'testuser',
            email:'testuser@example.com',
            password:'hashed@password123',
        })

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User registered');
        expect(res.body.user).toEqual(mockUser);
        
  });
})
