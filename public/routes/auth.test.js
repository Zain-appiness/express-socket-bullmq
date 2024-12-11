const request= require('supertest');
const express= require('express');
const router= require('./auth');
const {User}= require('../../models');
const bcrypt = require('bcrypt');

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

  it('should return a 500 status', async () => {
        User.create.mockRejectedValue(new Error('Database Error'));
        
        const res= await request(app)
        .post('/api/auth/create')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
  });

})

describe('tests for user login', () => {

  afterEach(()=>{
    jest.clearAllMocks();
  });

  it('should return 200 for User Login', async () => {

    const mockUser={
      id:1,
      username:'testuser@example.com',
      password: await bcrypt.hash('password123',10)
    };

    User.findOne.mockResolvedValue(mockUser);

    const res=await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged in successfully');
    expect(res.body.token).toBeDefined();
  });

  it('should give wrong login', async () => {
    
    User.findOne.mockResolvedValue(null);

    const res= await request(app)
    .post('/api/auth/login')
    .send({
      email: 'wrong@example.com',
      password: 'wrong123',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email or password')
  });
})

describe('tests for get all users', () => {

  afterEach(()=>{
    jest.clearAllMocks();
  });

  
  it('should get all users', async () => {
    const mockUsers = [
      { id: 1, username: 'user1', email: 'user1@example.com' },
      { id: 2, username: 'user2', email: 'user2@example.com' },
    ];

    User.findAll.mockResolvedValue(mockUsers);

    const res= await request(app)
    .get('/api/auth/user')

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('ALL THE USERS');
    expect(res.body.users).toStrictEqual(mockUsers)
  });

  it('should give 400 status for no users', async () => {
    User.findAll.mockResolvedValue([]);

    const res=  await request(app)
    .get('/api/auth/user')
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('NO USERS EXIST');
  });

  it('should return 500 for get all users', async () => {
    User.findAll.mockRejectedValue(new Error('Database Error'));

    const res=await request(app)
    .get('/api/auth/user')

    expect(res.status).toBe(500)
    expect(res.body.error).toBe('Database Error')
  });

})

describe('test foe get user by id', () => {

  afterEach(()=>{
    jest.clearAllMocks();
  });

  it('should return user by id', async () => {
    const mockUser={
      id:1,
      username:'testuser',
      email:'testuser@gmail.com'
    };

    User.findOne.mockResolvedValue(mockUser);

    const res=await request(app)
    .get('/api/auth/user/1')

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'ALL THE USERS',
      user: mockUser,
    })
  });

  it('should return 400 for user by id ', async () => {
    User.findOne.mockResolvedValue([]);

    const res= await request(app)
    .get('/api/auth/user/1')
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message:  'NO USERS EXIST',
    })
  
  });

  it('should return 500 for user getbyId ', async () => {
    User.findOne.mockRejectedValue(new Error('Database Error'));


    const res= await request(app)
    .get('/api/auth/user/1');

    expect(res.status).toBe(500);
    expect(res.body.error).toEqual('Database Error');
  });

})

describe('tests for get user by email', () => {
  
  afterEach(()=>{
    jest.clearAllMocks();
  });

  
  it('should return user by email', async () => {
    const mockUser={
      id:1,
      username:'testuser',
      email:'testuser@gmail.com',
    };

    User.findOne.mockResolvedValue(mockUser);

    const res= await request(app)
    .get("/api/auth/user/email/testuser@gmail.com")

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      message:'USER FOUND:',
      user: mockUser
    })
  });

  it('should return 400 for getbyemail', async () => {
    User.findOne.mockResolvedValue([]);

    const res= await request(app)
    .get('/api/auth/user/email/testuser@gmail.com')

    expect(res.status).toBe(400)
    expect(res.body.message).toEqual('NO SUCH USER')
  });

it('should return 500 for getbyemail', async () => {
  User.findOne.mockRejectedValue(new Error('Database Error'));

  const res= await request(app)
  .get('/api/auth/user/email/testuser@gmail.com')

  expect(res.status).toBe(500)
  expect(res.body).toEqual({
    error:'Database Error'
  });
  
});
})

describe('tests for updating user by id', () => {
  
  afterEach(()=>{
    jest.clearAllMocks();
  });

  it('should test update api ', async () => {
    const mockser={
      id:1,
      username:'testuser',
      email:'testuser@gmail.com',
      password:'password123',
      update: jest.fn().mockResolvedValue()
    }
  
    User.findByPk.mockResolvedValue(mockser);
  
    const res= await request(app)
    .put('/api/auth/update/1')
    .send({
      username:'updateduser'
    })
  
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User updated successfully');
    expect(mockser.update).toHaveBeenCalledWith({
      username:'updateduser'
    })
  });
  
  it('should get 400 by update ', async () => {
    User.findByPk.mockResolvedValue(null);
  
    const res= await request(app)
    .put('/api/auth/update/1')
    .send({
      username:'testuser',
      email:'testuser@gmail.com',
      password:'password123',
    })
  
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('NO SUCH USER')
  
  
  });
  
  it('should return 500 for server error on update', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'testuser@gmail.com',
      update: jest.fn().mockRejectedValue(new Error('Database Error')), 
    };
  
    
    User.findByPk.mockResolvedValue(mockUser);
    const res = await request(app)
      .put('/api/auth/update/1')
      .send({
        username: 'updateduser',
        email: 'updateduser@gmail.com',
        password: 'newpassword123',
      });
  
    expect(res.status).toBe(500); 
    expect(res.body.error).toBe('Database Error'); 
  });

})

describe('tests for deleting user by id and email', () => {

  afterEach(()=>{
    jest.clearAllMocks();
  });

  
it('should delete an user', async () => {
  const mockuser={
    id:1,
    email:'test@gmail.com',
  }

  User.findOne.mockResolvedValue(mockuser);

  User.destroy.mockResolvedValue(1);

  const res= await request(app)
  .delete('/api/auth/delete/1');

  expect(res.status).toBe(200);
  expect(res.body.message).toBe('User delted successfully');
  expect(User.findOne).toHaveBeenCalledWith({where:{
    id:'1'
  }});
  expect(User.destroy).toHaveBeenCalledWith({
    where:{
      email:mockuser.email,
    }
  })
});

it('should return 500 for delete', async () => {
  const mockuser={
    id:1,
    email:'test@gmail.com',
  }

  User.findOne.mockRejectedValue(new Error('DATABASE ERROR'));

  const res=await request(app)
  .delete('/api/auth/delete/1');

  expect(res.status).toBe(500);
  expect(res.body.error).toEqual('DATABASE ERROR');
  expect(User.findOne).toHaveBeenCalledWith({where:{
    id:'1'
  }});
});

it('should return 400 if user does not exist', async () => {

  User.findOne.mockResolvedValue(null);

  const res = await request(app).delete('/api/auth/delete/1');

  expect(res.status).toBe(400);
  expect(res.body.message).toBe('NO SUCH USER');
  expect(User.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  expect(User.destroy).not.toHaveBeenCalled();
});
  
  
})

