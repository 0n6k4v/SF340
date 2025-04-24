import bcrypt from 'bcryptjs';
import { User } from '../entity/User.js';
import { Role } from '../entity/Role.js';
import { AppDataSource } from '../config/db.js';

// Create new user
export async function createUser(req, res) {
  const { title, firstname, lastname, email, password, role_id, department } = req.body; // ลบ user_code ออก

  try {
    const userRepository = AppDataSource.getRepository(User);
    
    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // สร้าง user_code
    const latestUser = await userRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    let user_code = 'USER001';
    if (latestUser.length > 0) {
      const latestCode = latestUser[0].user_code;
      const num = parseInt(latestCode.substring(4)) + 1;
      user_code = `USER${num.toString().padStart(3, '0')}`;
    }

    // ทำการแฮชรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้าง user ใหม่
    const newUser = userRepository.create({
      user_code,
      title,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      department,
      role_id,
    });

    await userRepository.save(newUser);
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        user_code: newUser.user_code,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: error.message,
    });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      relations: ['role'],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Edit user
export async function editUser(req, res) {
  const { id } = req.params;
  const { title, firstname, lastname, email, password, role_id, department, is_active, profile_image_url } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (title) user.title = title;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email && email !== user.email) {
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Email already in use by another user' });
      }
      user.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (role_id) user.role_id = role_id;
    if (department) user.department = department;
    if (is_active !== undefined) user.is_active = is_active;
    if (profile_image_url) user.profile_image_url = profile_image_url;

    await userRepository.save(user);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Failed to update user',
      details: error.message,
    });
  }
}

// Delete user
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRepository.remove(user);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      details: error.message,
    });
  }
}