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
exports.archiveBlogPost = exports.dislikeBlogPost = exports.likeBlogPost = exports.getFeaturedBlogPosts = exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostsBySearch = exports.getBlogPostsByCategoryAndAuthorId = exports.getBlogPostsByAuthorId = exports.createBlogPost = exports.getBlogPostsByCategoryId = exports.getBlogPostById = exports.getAllBlogPosts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { title, excerpt, content, readTimeMin, imageUrl, imageAlt, tags, categoryId, isPublished, isFeatured } = req.body;
    try {
        const blogPost = yield prisma.blogPost.create({
            data: {
                title,
                excerpt,
                content,
                readTimeMin,
                imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
                imageAlt,
                tags,
                categoryId,
                authorId: userId,
                isPublished: isPublished || false,
                isFeatured: isFeatured || false,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });
        res.status(201).json({ createdBlogPost: blogPost });
    }
    catch (error) {
        console.error("Error creating blog post:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createBlogPost = createBlogPost;
const getAllBlogPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("requesting all blogs\n", req.query);
    const { published, featured, archived, limit, offset, sortBy, sortOrder } = req.query;
    try {
        // Build where clause for filtering
        const where = {
            isDeleted: false, // Always exclude deleted posts
        };
        if (published !== undefined) {
            where.isPublished = published === 'true';
        }
        if (featured !== undefined) {
            console.log("requesting featured blogs\n", featured);
            where.isFeatured = featured === 'true';
        }
        if (archived !== undefined) {
            where.isArchived = archived === 'true';
        }
        // Build orderBy clause
        const orderBy = {};
        const validSortFields = ['createdAt', 'updatedAt', 'title', 'likes', 'readTimeMin'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const order = sortOrder === 'asc' ? 'asc' : 'desc';
        orderBy[sortField] = order;
        const blogPosts = yield prisma.blogPost.findMany({
            where,
            orderBy,
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });
        res.status(200).json({ blogPosts });
    }
    catch (error) {
        console.error("Error getting all blog posts:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllBlogPosts = getAllBlogPosts;
const getBlogPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogPostId } = req.params;
        const blogPost = yield prisma.blogPost.findFirst({
            where: {
                id: blogPostId,
                isDeleted: false,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                comments: {
                    where: {
                    // You might want to add filtering for comments too
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });
        if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.status(200).json({ blogPost });
    }
    catch (error) {
        console.error("Error getting blog post by id:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getBlogPostById = getBlogPostById;
const getBlogPostsByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const { published, featured, limit, offset } = req.query;
    try {
        const where = {
            categoryId,
            isDeleted: false,
        };
        if (published !== undefined) {
            where.isPublished = published === 'true';
        }
        if (featured !== undefined) {
            where.isFeatured = featured === 'true';
        }
        const blogPosts = yield prisma.blogPost.findMany({
            where,
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({ blogPosts });
    }
    catch (error) {
        console.error("Error getting blog posts by category id:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getBlogPostsByCategoryId = getBlogPostsByCategoryId;
const getBlogPostsByAuthorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId } = req.params;
    const { published, featured, limit, offset } = req.query;
    try {
        const where = {
            authorId,
            isDeleted: false,
        };
        if (published !== undefined) {
            where.isPublished = published === 'true';
        }
        if (featured !== undefined) {
            where.isFeatured = featured === 'true';
        }
        const blogPosts = yield prisma.blogPost.findMany({
            where,
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({ blogPosts });
    }
    catch (error) {
        console.error("Error getting blog posts by author id:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getBlogPostsByAuthorId = getBlogPostsByAuthorId;
const getBlogPostsByCategoryAndAuthorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, authorId } = req.params;
    const { published, featured, limit, offset } = req.query;
    try {
        const where = {
            categoryId,
            authorId,
            isDeleted: false,
        };
        if (published !== undefined) {
            where.isPublished = published === 'true';
        }
        if (featured !== undefined) {
            where.isFeatured = featured === 'true';
        }
        const blogPosts = yield prisma.blogPost.findMany({
            where,
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({ blogPosts });
    }
    catch (error) {
        console.error("Error getting blog posts by category and author id:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getBlogPostsByCategoryAndAuthorId = getBlogPostsByCategoryAndAuthorId;
const getBlogPostsBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, published, featured, limit, offset } = req.query;
    if (!search || typeof search !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
    }
    try {
        const where = {
            isDeleted: false,
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
                { tags: { has: search } }, // Exact match for tags
                {
                    tags: {
                        hasSome: search.split(' ').filter(tag => tag.length > 0)
                    }
                }, // Match any word in tags
            ]
        };
        if (published !== undefined) {
            where.isPublished = published === 'true';
        }
        if (featured !== undefined) {
            where.isFeatured = featured === 'true';
        }
        const blogPosts = yield prisma.blogPost.findMany({
            where,
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({ blogPosts });
    }
    catch (error) {
        console.error("Error getting blog posts by search:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getBlogPostsBySearch = getBlogPostsBySearch;
const updateBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    try {
        // First check if the blog post exists and user is authorized
        const existingPost = yield prisma.blogPost.findFirst({
            where: {
                id: blogPostId,
                isDeleted: false,
            }
        });
        if (!existingPost) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        // Check if the user is the author of the blog post
        if (userId !== existingPost.authorId) {
            return res.status(403).json({
                message: "You are not authorized to update this blog post"
            });
        }
        // Remove undefined values and authorId from update data
        const cleanUpdateData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));
        // Don't allow updating authorId through this endpoint
        delete cleanUpdateData.authorId;
        const blogPost = yield prisma.blogPost.update({
            where: { id: blogPostId },
            data: cleanUpdateData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });
        res.status(200).json({ updatedBlogPost: blogPost });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({ message: "Blog post not found" });
            }
        }
        console.error("Error updating blog post:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateBlogPost = updateBlogPost;
const deleteBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    const userId = req.user.id;
    try {
        // First check if the blog post exists and user is authorized
        const existingPost = yield prisma.blogPost.findFirst({
            where: {
                id: blogPostId,
                isDeleted: false,
            }
        });
        if (!existingPost) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        // Check if the user is the author of the blog post
        if (userId !== existingPost.authorId) {
            return res.status(403).json({
                message: "You are not authorized to delete this blog post"
            });
        }
        // Soft delete - set isDeleted to true
        const deletedBlogPost = yield prisma.blogPost.update({
            where: { id: blogPostId },
            data: { isDeleted: true },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        res.status(200).json({
            message: "Blog post deleted successfully",
            deletedBlogPost
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({ message: "Blog post not found" });
            }
        }
        console.error("Error deleting blog post:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteBlogPost = deleteBlogPost;
const getFeaturedBlogPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, offset } = req.query;
    try {
        const blogPosts = yield prisma.blogPost.findMany({
            where: {
                isFeatured: true,
                isPublished: true,
                isDeleted: false,
                isArchived: false,
            },
            take: limit ? parseInt(limit) : 10,
            skip: offset ? parseInt(offset) : undefined,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({ featuredBlogPosts: blogPosts });
    }
    catch (error) {
        console.error("Error getting featured blog posts:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getFeaturedBlogPosts = getFeaturedBlogPosts;
const likeBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    try {
        const blogPost = yield prisma.blogPost.update({
            where: {
                id: blogPostId,
                isDeleted: false,
            },
            data: {
                likes: {
                    increment: 1
                }
            },
            select: {
                id: true,
                likes: true,
                dislikes: true,
            }
        });
        res.status(200).json({
            message: "Blog post liked successfully",
            likes: blogPost.likes,
            dislikes: blogPost.dislikes
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({ message: "Blog post not found" });
            }
        }
        console.error("Error liking blog post:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.likeBlogPost = likeBlogPost;
const dislikeBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    try {
        const blogPost = yield prisma.blogPost.update({
            where: {
                id: blogPostId,
                isDeleted: false,
            },
            data: {
                dislikes: {
                    increment: 1
                }
            },
            select: {
                id: true,
                likes: true,
                dislikes: true,
            }
        });
        res.status(200).json({
            message: "Blog post disliked successfully",
            likes: blogPost.likes,
            dislikes: blogPost.dislikes
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({ message: "Blog post not found" });
            }
        }
        console.error("Error disliking blog post:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.dislikeBlogPost = dislikeBlogPost;
const archiveBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    const userId = req.user.id;
    try {
        // Check if user is authorized
        const existingPost = yield prisma.blogPost.findFirst({
            where: {
                id: blogPostId,
                isDeleted: false,
            }
        });
        if (!existingPost) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        if (userId !== existingPost.authorId) {
            return res.status(403).json({
                message: "You are not authorized to archive this blog post"
            });
        }
        const archivedPost = yield prisma.blogPost.update({
            where: { id: blogPostId },
            data: {
                isArchived: true,
                isPublished: false, // Archived posts should not be published
            }
        });
        res.status(200).json({
            message: "Blog post archived successfully",
            archivedBlogPost: archivedPost
        });
    }
    catch (error) {
        console.error("Error archiving blog post:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.archiveBlogPost = archiveBlogPost;
//# sourceMappingURL=blogPost.controller.js.map