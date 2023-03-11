import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Logging from "../library/Logging";
import Author from "../models/Author";

// creating Author
const createAuthor = (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name;
  Logging.warn(req.body);
  const author = new Author({
    _id: new mongoose.Types.ObjectId(),
    name,
  });
  return author
    .save()
    .then((author) => res.status(201).json({ author }))
    .catch((error) => res.status(500).json({ error }));
};

// getting author
const readAuthor = (req: Request, res: Response, next: NextFunction) => {
  const authorId = req.params.authorId;
  return Author.findById(authorId)
    .then((author) =>
      author
        ? res.status(200).json({ author })
        : res.status(404).json({ message: "Not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

// get all author
const readAll = (req: Request, res: Response, next: NextFunction) => {
  return Author.find()
    .then((authors) => res.status(200).json({ authors }))
    .catch((error) => res.status(500).json({ error }));
};

// update author
const updateAuthor = (req: Request, res: Response, next: NextFunction) => {
  const authorId = req.params.authorId;
  return Author.findById(authorId)
    .then((author) => {
      Logging.warn(author);
      if (author) {
        author.set(req.body);
        return author
          .save()
          .then((author) => res.status(201).json({ author }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ message: "User Not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// delete author
const deleteAuthor = (req: Request, res: Response, next: NextFunction) => {
  const authorId = req.params.authorId;
  return Author.findByIdAndDelete(authorId)
    .then((author) =>
      author
        ? res.status(201).json({ message: "deleted" })
        : res.status(404).json({ message: "Not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createAuthor,
  readAll,
  deleteAuthor,
  updateAuthor,
  readAuthor,
};
