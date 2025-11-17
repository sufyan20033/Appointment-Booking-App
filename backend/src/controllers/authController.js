import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * 🟢 Local Signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, speciality, address, phone, age } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        provider: "LOCAL",
      },
    });

    let doctor = null;
    let patient = null;

    if (role === "DOCTOR") {
      doctor = await prisma.doctor.create({
        data: {
          speciality: speciality || "General",
          userId: user.userId,
        },
      });
    }

    if (role === "PATIENT") {
      patient = await prisma.patient.create({
        data: {
          userId: user.userId,
          address: address || "",
          phone: phone || "",
          age: age || 0,
        },
      });
    }

    res.json({
      message: "Signup successful",
      user,
      doctor,
      patient,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔵 LOGIN (Local)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.provider !== "LOCAL")
      return res.status(400).json({ message: "Please login with Google" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔴 GOOGLE LOGIN/SIGNUP
 */
export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body; // Expect idToken from frontend or Thunder Client

    if (!idToken) {
      return res.status(400).json({ error: "idToken is required" });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name} = payload;

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user if not exists
      user = await prisma.user.create({
        data: {
          name,
          email,
          provider: "GOOGLE",
          role: "PATIENT", // default role
        //  picture, // optional: save profile picture
        },
      });

      await prisma.patient.create({
        data: { userId: user.userId, address: "", phone: "", age: 0 },
      });
    } else {
      // Optional: update name/picture if user exists
      user = await prisma.user.update({
        where: { email },
        data: { name},
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google Auth success",
      token,
      user,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: error.message });
  }
};
