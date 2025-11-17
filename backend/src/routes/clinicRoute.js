import express from "express";
import {
  createClinic,
  getAllClinics,
  getClinicById,
  updateClinic,
  deleteClinic,
} from "../controllers/clinicController.js";

const router = express.Router();

// CRUD Routes
router.post("/addclinic", createClinic);     // Create clinic
router.get("/", getAllClinics);          // Get all clinics
router.get("/:id", getClinicById);       // Get single clinic
router.put("/updateclinic/:id", updateClinic);        // Update clinic
router.delete("/deleteclinic/:id", deleteClinic);     // Delete clinic

export default router;
