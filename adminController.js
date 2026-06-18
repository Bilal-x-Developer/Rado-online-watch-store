import { sendMail } from './mail.js';


const ADMIN_USERS = [
  { id: '1', name: 'Admin', email: 'admin@watchstore.com', password: 'admin123' },
];

const OTP_STORAGE = {}; 

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function signupInitiate(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const exists = ADMIN_USERS.some((u) => u.email === email);
    if (exists) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Generate OTP
    const otp = generateOTP();
    OTP_STORAGE[email] = { otp, password, name, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 min

    const messageText = `Your verification code is ${otp}. It expires in 10 minutes.`;
    const messageHtml = `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`;

    let previewUrl;
    try {
      const emailResult = await sendMail({
        to: email,
        subject: 'Your Watch Store OTP code',
        text: messageText,
        html: messageHtml,
      });
      previewUrl = emailResult.previewUrl;
      console.log(`[OTP for ${email}]: ${otp}`);
      if (previewUrl) {
        console.log(`OTP preview URL: ${previewUrl}`);
      }
    } catch (mailError) {
      console.error('Email delivery failed:', mailError);
      console.log(`[OTP for ${email}]: ${otp}`);
    }

    return res.status(200).json({
      message: `OTP sent to ${email}. Check your email or terminal logs.`,
      previewUrl,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup.' });
  }
}

// Signup Verify - Verify OTP and create user
export async function signupVerify(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const otpData = OTP_STORAGE[email];
    if (!otpData) {
      return res.status(400).json({ message: 'OTP not found or expired. Please sign up again.' });
    }

    if (Date.now() > otpData.expiresAt) {
      delete OTP_STORAGE[email];
      return res.status(400).json({ message: 'OTP expired. Please sign up again.' });
    }

    if (otpData.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    // Create new admin user
    const newAdmin = {
      id: Date.now().toString(),
      name: otpData.name,
      email,
      password: otpData.password,
    };

    ADMIN_USERS.push(newAdmin);
    delete OTP_STORAGE[email];

    return res.status(201).json({
      message: 'User registered successfully!',
      admin: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email },
    });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ message: 'Server error during verification.' });
  }
}

// Sign In - Login
export async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = ADMIN_USERS.find((u) => u.email === email);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
}
