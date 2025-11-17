import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  bookAppointment,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";

import { authenticate,isPatient, isAdmin } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// Doctor creates slots
router.post("/createappointment", authenticate, allowRoles("DOCTOR"), createAppointment);

// Admin/Doctor see all appointments
router.get("/", authenticate, getAllAppointments);

// Get single
router.get("/:id", authenticate, getAppointmentById);

// Update (Doctor only)
router.put("/:id", authenticate, allowRoles("DOCTOR"), updateAppointment);

// Delete
router.delete("/:id", authenticate, allowRoles("DOCTOR"), deleteAppointment);


// Patient books appointment
router.patch(
  "/book/:appId",
  authenticate,
  isPatient,
  bookAppointment
);

// Admin updates appointment status
router.patch(
  "/appointment/status/:appId",
  authenticate,
  isAdmin,
  updateAppointmentStatus
);



export default router;
