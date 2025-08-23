import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const createBlogPost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload).id;
  const { 
    title, 
    excerpt, 
    content, 
    readTimeMin, 
    imageUrl, 
    imageAlt, 
    tags, 
    categoryId, 
    isPublished, 
    isFeatured 
  } = req.body;
  
  try {
    const blogPost = await prisma.blogPost.create({
      data: { 
        title, 
        excerpt, 
        content, 
        readTimeMin, 
        imageUrl, 
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
  } catch (error: any) {
    console.error("Error creating blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBlogPosts = async (req: Request, res: Response) => {
  const { 
    published, 
    featured, 
    archived, 
    limit, 
    offset, 
    sortBy, 
    sortOrder 
  } = req.query;

  try {
    // Build where clause for filtering
    const where: any = {
      isDeleted: false, // Always exclude deleted posts
    };

    if (published !== undefined) {
      where.isPublished = published === 'true';
    }
    if (featured !== undefined) {
      where.isFeatured = featured === 'true';
    }
    if (archived !== undefined) {
      where.isArchived = archived === 'true';
    }

    // Build orderBy clause
    const orderBy: any = {};
    const validSortFields = ['createdAt', 'updatedAt', 'title', 'likes', 'readTimeMin'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';
    orderBy[sortField] = order;

    const blogPosts = await prisma.blogPost.findMany({
      where,
      orderBy,
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
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
  } catch (error: any) {
    console.error("Error getting all blog posts:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostById = async (req: Request, res: Response) => {
  try {
    const { blogPostId } = req.params;
    const blogPost = await prisma.blogPost.findFirst({
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
  } catch (error: any) {
    console.error("Error getting blog post by id:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostsByCategoryId = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { published, featured, limit, offset } = req.query;

  try {
    const where: any = { 
      categoryId,
      isDeleted: false,
    };

    if (published !== undefined) {
      where.isPublished = published === 'true';
    }
    if (featured !== undefined) {
      where.isFeatured = featured === 'true';
    }

    const blogPosts = await prisma.blogPost.findMany({ 
      where,
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
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
  } catch (error: any) {
    console.error("Error getting blog posts by category id:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostsByAuthorId = async (req: Request, res: Response) => {
  const { authorId } = req.params;
  const { published, featured, limit, offset } = req.query;

  try {
    const where: any = { 
      authorId,
      isDeleted: false,
    };

    if (published !== undefined) {
      where.isPublished = published === 'true';
    }
    if (featured !== undefined) {
      where.isFeatured = featured === 'true';
    }

    const blogPosts = await prisma.blogPost.findMany({ 
      where,
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
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
  } catch (error: any) {
    console.error("Error getting blog posts by author id:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostsByCategoryAndAuthorId = async (
  req: Request,
  res: Response
) => {
  const { categoryId, authorId } = req.params;
  const { published, featured, limit, offset } = req.query;

  try {
    const where: any = { 
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

    const blogPosts = await prisma.blogPost.findMany({
      where,
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
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
  } catch (error: any) {
    console.error(
      "Error getting blog posts by category and author id:\n",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostsBySearch = async (req: Request, res: Response) => {
  const { search, published, featured, limit, offset } = req.query;
  
  if (!search || typeof search !== 'string') {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const where: any = {
      isDeleted: false,
      OR: [
        { title: { contains: search as string, mode: "insensitive" } },
        { excerpt: { contains: search as string, mode: "insensitive" } },
        { content: { contains: search as string, mode: "insensitive" } },
        { tags: { has: search as string } }, // Exact match for tags
        { 
          tags: { 
            hasSome: (search as string).split(' ').filter(tag => tag.length > 0) 
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

    const blogPosts = await prisma.blogPost.findMany({
      where,
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
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
  } catch (error: any) {
    console.error("Error getting blog posts by search:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBlogPost = async (req: AuthenticatedRequest, res: Response) => {
  const { blogPostId } = req.params;  
  const updateData = req.body;
  const userId = (req.user as JwtPayload).id;

  try {
    // First check if the blog post exists and user is authorized
    const existingPost = await prisma.blogPost.findFirst({
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
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );
    
    // Don't allow updating authorId through this endpoint
    delete cleanUpdateData.authorId;

    const blogPost = await prisma.blogPost.update({
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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Blog post not found" });
      }
    }
    console.error("Error updating blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBlogPost = async (req: AuthenticatedRequest, res: Response) => {
  const { blogPostId } = req.params;
  const userId = (req.user as JwtPayload).id;

  try {
    // First check if the blog post exists and user is authorized
    const existingPost = await prisma.blogPost.findFirst({
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
    const deletedBlogPost = await prisma.blogPost.update({
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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Blog post not found" });
      }
    }
    console.error("Error deleting blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFeaturedBlogPosts = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;

  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        isFeatured: true,
        isPublished: true,
        isDeleted: false,
        isArchived: false,
      },
      take: limit ? parseInt(limit as string) : 10,
      skip: offset ? parseInt(offset as string) : undefined,
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
  } catch (error: any) {
    console.error("Error getting featured blog posts:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const likeBlogPost = async (req: AuthenticatedRequest, res: Response) => {
  const { blogPostId } = req.params;

  try {
    const blogPost = await prisma.blogPost.update({
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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Blog post not found" });
      }
    }
    console.error("Error liking blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const dislikeBlogPost = async (req: AuthenticatedRequest, res: Response) => {
  const { blogPostId } = req.params;

  try {
    const blogPost = await prisma.blogPost.update({
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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Blog post not found" });
      }
    }
    console.error("Error disliking blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const archiveBlogPost = async (req: AuthenticatedRequest, res: Response) => {
  const { blogPostId } = req.params;
  const userId = (req.user as JwtPayload).id;

  try {
    // Check if user is authorized
    const existingPost = await prisma.blogPost.findFirst({
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

    const archivedPost = await prisma.blogPost.update({
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
  } catch (error: any) {
    console.error("Error archiving blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getAllBlogPosts,
  getBlogPostById,
  getBlogPostsByCategoryId,
  createBlogPost,
  getBlogPostsByAuthorId,
  getBlogPostsByCategoryAndAuthorId,
  getBlogPostsBySearch,
  updateBlogPost,
  deleteBlogPost,
  getFeaturedBlogPosts,
  likeBlogPost,
  dislikeBlogPost,
  archiveBlogPost,
};
