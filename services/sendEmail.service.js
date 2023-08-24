import nodemailer from 'nodemailer'
import { adminAuth } from '../utils/firebase.js';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });



export const emailVerification = async (data) => {
    try {
      const email = data?.email;
      const name = data?.name;
      if (!email) throw new Error("Email is required");
      if (!name) throw new Error("Name is required");

      const emailLink = await adminAuth.generateEmailVerificationLink(email);
      const uid = (await adminAuth.getUserByEmail(email)).uid;
  
      await transporter.sendMail({
        from: "Shahid Khan <shahidkhan.soboft@gmail.com>",
        to: email,
        subject: "Email Verification",
        html: `Hello ${name}, to verify your email please, <a href="${emailLink}"> click here </a>`,
      });
  
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
