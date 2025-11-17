import { PrismaClient } from "@prisma/client";
import { isValidTimeRange } from "../utils/timeValidation.js";
import { sendEmail } from "../services/emailService.js";

const prisma = new PrismaClient();

/**
 * CREATE Appointment Slot (Doctor)
 */
export const createAppointment = async (req, res) => {
  try {
    const { date, startTime, endTime, doctorId, clinicId } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Validate time
    if (!isValidTimeRange(startTime, endTime)) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    // Check doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { doctorId } });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check clinic belongs to doctor
    const clinic = await prisma.clinic.findFirst({
      where: { clinicId, doctorId }
    });
    if (!clinic) {
      return res.status(400).json({
        message: "Clinic does not belong to this doctor"
      });
    }

    // Prevent overlapping appointments (same date)
    const overlap = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) }
          }
        ]
      }
    });

    if (overlap) {
      return res.status(400).json({
        message: "Slot overlaps with an existing appointment on same date"
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        doctorId,
        clinicId
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

/**
 * GET all appointments
 */
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
        clinic: true
      }
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

/**
 * GET single appointment
 */
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { appId: parseInt(id) },
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
        clinic: true
      }
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

/**
 * UPDATE appointment slot
 */
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, clinicId } = req.body;

    // If updating both times, validate them
    if (startTime && endTime && !isValidTimeRange(startTime, endTime)) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    // Prevent overlap when updating – if start/end provided
    if (startTime && endTime) {
      const old = await prisma.appointment.findUnique({
        where: { appId: parseInt(id) }
      });

      const overlap = await prisma.appointment.findFirst({
        where: {
          doctorId: old.doctorId,
          date: date ? new Date(date) : old.date,
          appId: { not: old.appId },
          OR: [
            {
              startTime: { lt: new Date(endTime) },
              endTime: { gt: new Date(startTime) }
            }
          ]
        }
      });

      if (overlap) {
        return res.status(400).json({
          message: "Updated time overlaps with another appointment"
        });
      }
    }

    const appointment = await prisma.appointment.update({
      where: { appId: parseInt(id) },
      data: {
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(clinicId && { clinicId }),
        updatedAt: new Date()
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

/**
 * DELETE appointment
 */
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { appId: parseInt(id) }
    });

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { appId } = req.params;      // Appointment ID from URL
    const userId = req.user.userId;    // Logged-in patient’s userId

    // Step 1: Get the patient record
    const patient = await prisma.patient.findUnique({
      where: { userId }   // Find the Patient record for this user
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient record not found" });
    }

    // Step 2: Get the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { appId: Number(appId) }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId !== null) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    // Step 3: Update appointment with patientId
    const updated = await prisma.appointment.update({
      where: { appId: Number(appId) },
      data: { patientId: patient.patientId } // use patientId from Patient table
    });

    res.json({
      message: "Appointment booked successfully",
      appointment: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body; // CONFIRMED / CANCELLED

    const appointment = await prisma.appointment.update({
      where: { appId: Number(appId) },
      data: { status },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    // Preparing emails
    const patientEmail = appointment.patient.user.email;
    const doctorEmail = appointment.doctor.user.email;

    const message = `
Your appointment:
Date: ${appointment.date}
Time: ${appointment.time}
Status: ${status}

Thank you.
    `;

    // Send to both
    await sendEmail(patientEmail, `Appointment ${status}`, message);
    await sendEmail(doctorEmail, `Appointment ${status}`, message);

    res.json({
      message: "Status updated & emails sent",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

