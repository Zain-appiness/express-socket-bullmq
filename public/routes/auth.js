const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models'); // Import User from db

const router = express.Router();

// Registration Route
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user', async(req,res)=>{
    try{
      const users = await User.findAll();

      if (!users || users.length === 0) {
        return res.status(400).json({ message: 'NO USERS EXIST' });
      }
  
      res.status(200).json({
        message: 'ALL THE USERS',
        users,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

});

router.get('/user/:id',async (req,res)=>{
  const userId=req.params.id;
  try {
    const user= await User.findOne({
      where:{id: userId},
    });
    
 
    if (!user || user.length === 0) {
      return res.status(400).json({ message: 'NO USERS EXIST' });
    }

    res.status(200).json({
      message: 'ALL THE USERS',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

router.get('/user/email/:email',async(req,res)=>{
  const userEmail= req.params.email;
  try {
    const user= await User.findOne({
      where:{
        email: userEmail,
      }
    });
    if(!user|| user.length==0){
      return res.status(400).json({
        message:'NO SUCH USER'
      });
    }

    res.status(200).json({
      message:'USER FOUND:',
      user
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:id',async(req,res)=>{
  const userId= req.params.id;
  const userData= req.body;
  try {
    if(!userData|| userData.length==0){
      return res.status(400).json({
        message:'NO UPDATE DATA PROVIDED'
      });
    }

    const user= await User.findByPk(userId);

      if(!user){
        return res.status(400).json({
          message:'NO SUCH USER'
        });
      }

    await user.update(userData);

    res.status(200).json({
      message: 'User updated successfully',
      user, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/delete/:id',async(req,res)=>{
  const userID= req.params.id;
  try {
      const user= await User.findOne({
        where:{
          id: userID,
        }
      });

        if(!user|| user.length==0){
          return res.status(400).json({
            message:'NO SUCH USER'
          });
        }

      const{email}= user;

      await User.destroy({
        where:{
          email: email,
        }
      })
      res.status(200).json({
        message: 'User delted successfully',
        user, 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router;
