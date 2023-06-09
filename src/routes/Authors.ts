import express from "express";
import controller from "../controllers/Author";
import { Schema, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post(
  "/create",
  ValidateSchema(Schema.author.create),
  controller.createAuthor
);
router.get("/get/:authorId", controller.readAuthor);
router.get("/get/", controller.readAll);
router.patch(
  "/update/:authorId",
  ValidateSchema(Schema.author.update),
  controller.updateAuthor
);
router.delete("/delete/:authorId", controller.deleteAuthor);

export = router;
