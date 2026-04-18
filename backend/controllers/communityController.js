// backend/controllers/communityController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// @desc    Get all community posts
// @route   GET /api/community
// @access  Public (Optional auth for likes)
exports.getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== "Feed") {
      filter.category = category;
    }

    const posts = await prisma.communityPost.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, fullName: true, googleId: true, profilePicture: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
        likes: req.user ? {
          where: { userId: req.user.id }
        } : false
      },
    });

    // Formatting for frontend
    const formattedPosts = posts.map(post => ({
      id: post.id,
      authorId: post.author.id,
      author: post.author.fullName,
      authorImage: post.author.profilePicture || post.author.googleId || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullName)}`,
      time: new Date(post.createdAt).toLocaleString(), 
      category: post.category,
      type: post.type,
      content: post.content,
      image: post.image,
      likes: post._count.likes,
      comments: post._count.comments,
      isLiked: req.user && post.likes && post.likes.length > 0,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/community
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { content, category, type } = req.body;
    const authorId = req.user.id;
    const imageUrl = req.file ? req.file.path : null;

    if (!content && !imageUrl) {
      return res.status(400).json({ message: "Please provide content or an image" });
    }

    const post = await prisma.communityPost.create({
      data: {
        authorId,
        content: content || "",
        category: category || "Feed",
        type: type || "update",
        image: imageUrl,
      },
      include: {
        author: { select: { id: true, fullName: true, googleId: true, profilePicture: true } },
      }
    });

    res.status(201).json({
      id: post.id,
      authorId: post.author.id,
      author: post.author.fullName,
      authorImage: post.author.profilePicture || post.author.googleId || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullName)}`,
      time: new Date(post.createdAt).toLocaleString(),
      category: post.category,
      type: post.type,
      content: post.content,
      image: post.image,
      likes: 0,
      comments: 0,
      isLiked: false,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Toggle like on a post
// @route   POST /api/community/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.communityLike.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: userId
        }
      }
    });

    if (existingLike) {
      await prisma.communityLike.delete({
        where: { id: existingLike.id }
      });
      return res.status(200).json({ message: "Post unliked", isLiked: false });
    } else {
      await prisma.communityLike.create({
        data: {
          postId: id,
          userId: userId
        }
      });
      return res.status(200).json({ message: "Post liked", isLiked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/community/:id/comments
// @access  Public
exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await prisma.communityComment.findMany({
            where: { postId: id },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, fullName: true, googleId: true, profilePicture: true } }
            }
        });

        const formattedComments = comments.map(c => ({
            id: c.id,
            authorId: c.user.id,
            author: c.user.fullName,
            authorImage: c.user.profilePicture || c.user.googleId || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.fullName)}`,
            content: c.content,
            time: new Date(c.createdAt).toLocaleString()
        }));

        res.status(200).json(formattedComments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Add comment to a post
// @route   POST /api/community/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const comment = await prisma.communityComment.create({
            data: {
                postId: id,
                userId: userId,
                content
            },
            include: {
                user: { select: { id: true, fullName: true, googleId: true, profilePicture: true } }
            }
        });

        res.status(201).json({
            id: comment.id,
            authorId: comment.user.id,
            author: comment.user.fullName,
            authorImage: comment.user.profilePicture || comment.user.googleId || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.fullName)}`,
            content: comment.content,
            time: new Date(comment.createdAt).toLocaleString()
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/community/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await prisma.communityPost.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.authorId !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await prisma.communityPost.delete({
            where: { id }
        });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
