"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogCategory = exports.updateBlogCategory = exports.createBlogCategory = exports.getBlogCategoryById = exports.getAllBlogCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    // check if the blog category already exists
    try {
        const blogCategory = yield prisma.blogCategory.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
        });
        if (blogCategory) {
            res.status(400).json({ message: "Blog category already exists" });
            return;
        }
    }
    catch (error) {
        console.error("Error checking if blog category already exists:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
    // create the blog category
    try {
        const blogCategory = yield prisma.blogCategory.create({ data: { name } });
        res.status(200).json({ createdBlogCategory: blogCategory });
    }
    catch (error) {
        console.error("Error creating blog category:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createBlogCategory = createBlogCategory;
const getAllBlogCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogCategories = yield prisma.blogCategory.findMany();
        res.status(200).json({ foundBlogCategories: blogCategories });
    }
    catch (error) {
        console.error("Error getting all blog categories:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllBlogCategories = getAllBlogCategories;
const getBlogCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogCategoryId } = req.params;
        const blogCategory = yield prisma.blogCategory.findUnique({
            where: { id: blogCategoryId },
        });
        res.status(200).json({ foundBlogCategory: blogCategory });
    }
    catch (error) {
        if (error.code === "P2023") {
            res.status(400).json({ message: "Invalid blog category id" });
            return;
        }
        console.error("Error getting blog category by id:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getBlogCategoryById = getBlogCategoryById;
const updateBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userType = req.user.type;
    // check if the user is admin
    if (userType !== "ADMIN") {
        res.status(403).json({ message: "You are not authorized to update this blog category" });
        return;
    }
    // update the blog category
    try {
        const { blogCategoryId } = req.params;
        const { name } = req.body;
        const blogCategory = yield prisma.blogCategory.update({
            where: { id: blogCategoryId },
            data: { name },
        });
        res.status(200).json({ updatedBlogCategory: blogCategory });
    }
    catch (error) {
        console.error("Error updating blog category:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateBlogCategory = updateBlogCategory;
const deleteBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userType = req.user.type;
    // check if the user is admin
    if (userType !== "ADMIN") {
        res.status(403).json({ message: "You are not authorized to delete this blog category" });
        return;
    }
    // delete the blog category
    try {
        const { blogCategoryId } = req.params;
        const blogCategory = yield prisma.blogCategory.delete({
            where: { id: blogCategoryId },
        });
        res.status(200).json({ deletedBlogCategory: blogCategory });
    }
    catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ message: "No record was found" });
            return;
        }
        console.error("Error deleting blog category:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteBlogCategory = deleteBlogCategory;
//# sourceMappingURL=blogCategory.controller.js.map