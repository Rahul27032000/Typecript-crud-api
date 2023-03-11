import express from "express";
import controller from "../controllers/Book";
import { ValidateSchema, Schema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post(
  "/create",
  ValidateSchema(Schema.book.create),
  controller.createBook
);
router.get("/get/:bookId", controller.readBook);
router.get("/get/", controller.readAll);
router.patch(
  "/update/:bookId",
  ValidateSchema(Schema.book.update),
  controller.updateBook
);
router.delete("/delete/:bookId", controller.deleteBook);

export = router;
