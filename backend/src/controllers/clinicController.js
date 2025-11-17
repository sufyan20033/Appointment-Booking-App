import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 🟢 CREATE Clinic
 */
export const createClinic = async (req, res) => {
  try {
    const { name, location, doctorId } = req.body;

    const doctor = await prisma.doctor.findUnique({ where: { doctorId } });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const clinic = await prisma.clinic.create({ data: { name, location, doctorId } });

    res.status(201).json({ message: "Clinic created successfully", clinic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating clinic" });
  }
};

/**
 * 🔵 READ All Clinics
 */
export const getAllClinics = async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany({
      include: { doctor: true, appointments: true },
    });
    res.json(clinics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching clinics" });
  }
};

/**
 * 🟣 READ Single Clinic
 */
export const getClinicById = async (req, res) => {
  try {
    const { id } = req.params;
    const clinic = await prisma.clinic.findUnique({
      where: { clinicId: parseInt(id) },
      include: { doctor: true, appointments: true },
    });

    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    res.json(clinic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching clinic" });
  }
};

/**
 * 🟠 UPDATE Clinic
 */
export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, doctorId } = req.body;

    if (doctorId) {
      const doctor = await prisma.doctor.findUnique({ where: { doctorId } });
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    }

    const clinic = await prisma.clinic.update({
      where: { clinicId: parseInt(id) },
      data: { name, location, doctorId },
    });

    res.json({ message: "Clinic updated successfully", clinic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating clinic" });
  }
};

/**
 * 🔴 DELETE Clinic
 */
export const deleteClinic = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.clinic.delete({ where: { clinicId: parseInt(id) } });
    res.json({ message: "Clinic deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting clinic" });
  }
};
