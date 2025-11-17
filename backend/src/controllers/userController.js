import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 🟢 CREATE User (Doctor or Patient)
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, provider, speciality, address, phone, age } = req.body;

    // 1️⃣ Create base user
    const user = await prisma.user.create({
      data: { name, email, password, role, provider },
    });

    // 2️⃣ If DOCTOR, create doctor record
    let doctor = null;
    if (role === "DOCTOR") {
      doctor = await prisma.doctor.create({
        data: {
          speciality: speciality || "General",
          userId: user.userId,
        },
      });
    }

    // 3️⃣ If PATIENT, create patient record
    let patient = null;
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

    res.status(201).json({
      message: `${role} created successfully`,
      user,
      doctor,
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};

/**
 * 🔵 READ All Users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        doctor: true,
        patient: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

/**
 * 🟣 READ Single User by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(id) },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

/**
 * 🟠 UPDATE User (and linked Doctor/Patient if applicable)
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, speciality, address, phone, age } = req.body;

    // 1️⃣ Update user
    const user = await prisma.user.update({
      where: { userId: parseInt(id) },
      data: { name, email, password, role },
    });

    // 2️⃣ Update doctor info if role is DOCTOR
    let doctor = null;
    if (role === "DOCTOR") {
      doctor = await prisma.doctor.upsert({
        where: { userId: user.userId },
        update: { speciality: speciality || "General" },
        create: { speciality: speciality || "General", userId: user.userId },
      });
    }

    // 3️⃣ Update patient info if role is PATIENT
    let patient = null;
    if (role === "PATIENT") {
      patient = await prisma.patient.upsert({
        where: { userId: user.userId },
        update: {
          address: address || "",
          phone: phone || "",
          age: age || 0,
        },
        create: {
          userId: user.userId,
          address: address || "",
          phone: phone || "",
          age: age || 0,
        },
      });
    }

    res.json({
      message: "User updated successfully",
      user,
      doctor,
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating user" });
  }
};

/**
 * 🔴 DELETE User (Cascade Doctor/Patient)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete doctor/patient first to avoid foreign key constraint issues
    await prisma.doctor.deleteMany({ where: { userId: parseInt(id) } });
    await prisma.patient.deleteMany({ where: { userId: parseInt(id) } });

    // Delete user
    await prisma.user.delete({
      where: { userId: parseInt(id) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting user" });
  }
};
