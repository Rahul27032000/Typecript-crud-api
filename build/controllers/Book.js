"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Logging_1 = __importDefault(require("../library/Logging"));
const Book_1 = __importDefault(require("../models/Book"));
// creating Book
const createBook = (req, res, next) => {
    const { title, author } = req.body;
    const book = new Book_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        title,
        author,
    });
    return book
        .save()
        .then((book) => res.status(201).json({ book }))
        .catch((error) => res.status(500).json({ error }));
};
// getting book
const readBook = (req, res, next) => {
    const bookId = req.params.bookId;
    return Book_1.default.findById(bookId)
        .populate("author")
        .select("-_v")
        .then((book) => book
        ? res.status(200).json({ book })
        : res.status(404).json({ message: "Not found" }))
        .catch((error) => res.status(500).json({ error }));
};
// get all book
const readAll = (req, res, next) => {
    return Book_1.default.find()
        .populate("author")
        .select("-__v")
        .then((books) => res.status(200).json({ books }))
        .catch((error) => res.status(500).json({ error }));
};
// update book
const updateBook = (req, res, next) => {
    const bookId = req.params.bookId;
    return Book_1.default.findById(bookId)
        .then((book) => {
        Logging_1.default.warn(book);
        if (book) {
            book.set(req.body);
            return book
                .save()
                .then((book) => res.status(201).json({ book }))
                .catch((error) => res.status(500).json({ error }));
        }
        else {
            res.status(404).json({ message: "User Not found" });
        }
    })
        .catch((error) => res.status(500).json({ error }));
};
// delete book
const deleteBook = (req, res, next) => {
    const bookId = req.params.bookId;
    return Book_1.default.findByIdAndDelete(bookId)
        .then((book) => book
        ? res.status(201).json({ message: "deleted" })
        : res.status(404).json({ message: "Not found" }))
        .catch((error) => res.status(500).json({ error }));
};
exports.default = {
    createBook,
    readAll,
    deleteBook,
    updateBook,
    readBook,
};
