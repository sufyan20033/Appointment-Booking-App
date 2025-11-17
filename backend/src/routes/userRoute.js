import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/adduser", createUser);       // Create
router.get("/users", getAllUsers);       // Read all
router.get("/user/:id", getUserById);    // Read one
router.put("/updateuser/:id", updateUser);     // Update
router.delete("/deleteuser/:id", deleteUser);  // Delete

export default router;
