import express from 'express';
import { signin, signupInitiate, signupVerify } from './adminController.js';

const router = express.Router();

console.log('Setting up admin routes...');

router.post('/admin/signin', (req, res) => {
  console.log('Signin endpoint hit');
  signin(req, res);
});
router.post('/admin/signup/initiate', (req, res) => {
  console.log('Signup initiate endpoint hit');
  signupInitiate(req, res);
});
router.post('/admin/signup/verify', (req, res) => {
  console.log('Signup verify endpoint hit');
  signupVerify(req, res);
});

console.log('Admin routes setup complete');

export default router;
