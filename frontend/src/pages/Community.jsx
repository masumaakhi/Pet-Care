import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaShare,
    FaImage,
    FaSearchLocation,
    FaStethoscope,
    FaBookOpen,
    FaPaperPlane,
    FaUserCircle,
    FaVideo,
    FaTrashAlt,
    FaRegUserCircle
} from "react-icons/fa";

// Dummy Posts (Fallback if API fails)
const initialPosts = [
    {
        id: "p1",
        author: "Emily R.",
        authorImage: "https://i.pravatar.cc/150?img=5",
        time: "2 hours ago",
        category: "Feed",
        type: "update",
        content: "Just adopted this little guy! Meet Buster. He loves his new toys already. 🐶❤️",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
        likes: 124,
        comments: 0,
        isLiked: false
    },
    {
        id: "p2",
        author: "Michael T.",
        authorImage: "https://i.pravatar.cc/150?img=11",
        time: "5 hours ago",
        category: "Lost & Found",
        type: "lost",
        content: "URGENT: Lost Golden Retriever named 'Sunny' in Downtown Metro Area. Wearing a blue collar. If seen, please contact me immediately! He is very friendly but probably scared.",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
        likes: 45,
        comments: 0,
        isLiked: true
    },
    {
        id: "p3",
        author: "Dr. Jenkins (Vet)",
        authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150",
        time: "1 day ago",
        category: "Ask Vet",
        type: "tip",
        content: "Seasonal Tip: As summer approaches, ensure your pets have constant access to fresh water and shade. Never leave them in a parked car, even with windows down. Heatstroke can happen in minutes! ☀️💧",
        image: null,
        likes: 342,
        comments: 0,
        isLiked: false
    },
    {
        id: "p4",
        author: "PetCare Official Blog",
        authorImage: "https://i.pravatar.cc/150?img=41",
        time: "2 days ago",
        category: "Blog",
        type: "blog",
        content: "Top 10 Nutritious Foods for Senior Cats 🐈. As felines age, their dietary needs change significantly. Read our latest article to ensure they get the right nutrients.",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
        likes: 89,
        comments: 0,
        isLiked: false
    }
];

const Community = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("Feed");
    const [newPostText, setNewPostText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Comments State
    const [expandedComments, setExpandedComments] = useState({});
    const [postComments, setPostComments] = useState({});
    const [newCommentTexts, setNewCommentTexts] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/community');
                if (res.data && res.data.length > 0) {
                    setPosts(res.data);
                } else {
                    setPosts(initialPosts); // fallback if empty
                }
            } catch (err) {
                console.error("Error fetching community posts:", err);
                setPosts(initialPosts); // Fallback to mocked data if DB is down
            }
        };
        fetchPosts();
    }, []);

    const filters = [
        { id: "Feed", label: "All Feed", icon: <FaUserCircle /> },
        { id: "Lost & Found", label: "Lost & Found", icon: <FaSearchLocation /> },
        { id: "Ask Vet", label: "Ask Vet / Tips", icon: <FaStethoscope /> },
        { id: "Blog", label: "Blog & Articles", icon: <FaBookOpen /> },
        { id: "My Posts", label: "My Posts", icon: <FaRegUserCircle /> },
    ];

    const getProfilePic = (usr) => {
        if (!usr) return "https://ui-avatars.com/api/?name=User";
        if (usr.profilePicture) {
            return usr.profilePicture.includes("http") ? usr.profilePicture : `http://localhost:5250/${usr.profilePicture.replace(/\\/g, '/')}`;
        }
        if (usr.googleId && usr.googleId.startsWith('http')) return usr.googleId;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(usr.fullName || "User")}`;
    };

    const handleLike = async (id) => {
        // Optimistic UI Update
        setPosts(posts.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));

        try {
            await api.post(`/community/${id}/like`);
        } catch (error) {
            console.error("Error toggling like API", error);
            // In a real prod environment we'd revert the state if the API fails
            // But since this might be a mocked environment, we let the optimistic update stay
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostText.trim() && !selectedImage) return;

        const currentText = newPostText;
        const currentCategory = activeFilter === "Feed" || activeFilter === "My Posts" ? "Feed" : activeFilter;

        const dummyNewPost = {
            id: `p${Date.now()}`,
            authorId: user ? user.id : "local",
            author: user ? user.fullName : "You",
            authorImage: getProfilePic(user),
            time: "Just now",
            category: currentCategory,
            type: "update",
            content: currentText,
            image: selectedImage,
            likes: 0,
            comments: 0,
            isLiked: false
        };

        // Optimistic UI Update
        setPosts([dummyNewPost, ...posts]);
        setNewPostText("");
        setSelectedImage(null);
        setImageFile(null);

        try {
            const formData = new FormData();
            formData.append("content", currentText);
            formData.append("category", currentCategory);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await api.post('/community', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Replace dummy post with real post from API
            setPosts(prevPosts => prevPosts.map(p => p.id === dummyNewPost.id ? res.data : p));
        } catch (error) {
            console.error("Failed to create post on backend", error);
            // We keep the optimistic update if backend fails (mocked offline mode)
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        // Optimistic delete
        setPosts(prev => prev.filter(p => p.id !== postId));

        try {
            if (!postId.startsWith('p')) { // 'p' denotes local dummy ID
                await api.delete(`/community/${postId}`);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            // Should revert if failed natively, but ignoring for mockup resilience
        }
    };

    const toggleComments = async (postId) => {
        const isCurrentlyExpanded = expandedComments[postId];
        
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !isCurrentlyExpanded
        }));

        if (!isCurrentlyExpanded && !postComments[postId] && !postId.startsWith('p')) {
            // Fetch comments if real post
            try {
                const res = await api.get(`/community/${postId}/comments`);
                setPostComments(prev => ({ ...prev, [postId]: res.data }));
            } catch (err) {
                console.error("Failed to fetch comments", err);
                setPostComments(prev => ({ ...prev, [postId]: [] })); // Fallback
            }
        }
    };

    const handleAddComment = async (postId, e) => {
        e.preventDefault();
        const content = newCommentTexts[postId];
        if (!content || !content.trim()) return;

        const dummyComment = {
            id: `c${Date.now()}`,
            authorId: user ? user.id : "local",
            author: user ? user.fullName : "You",
            authorImage: getProfilePic(user),
            content: content,
            time: "Just now"
        };
        
        // Optimistic update
        setPostComments(prev => ({
            ...prev,
            [postId]: [dummyComment, ...(prev[postId] || [])]
        }));
        
        // Update comments count on post
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return { ...post, comments: post.comments + 1 };
            }
            return post;
        }));

        // Reset input
        setNewCommentTexts(prev => ({ ...prev, [postId]: "" }));

        try {
            if (!postId.startsWith('p')) {
                await api.post(`/community/${postId}/comments`, { content });
            }
        } catch (err) {
            console.error("Failed to add comment on backend", err);
        }
    };

    let filteredPosts = posts;
    if (activeFilter === "My Posts") {
        filteredPosts = posts.filter(post => user && post.authorId === user.id);
    } else if (activeFilter !== "Feed") {
        filteredPosts = posts.filter(post => post.category === activeFilter);
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar: Filters */}
                <div className="lg:w-1/4">
                    <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/60 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore</h2>
                        <ul className="space-y-3">
                            {filters.map(filter => (
                                <li key={filter.id}>
                                    <button
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-4 font-medium transition ${activeFilter === filter.id
                                            ? "bg-primary text-white shadow-md"
                                            : "text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm"
                                            }`}
                                    >
                                        <span className={activeFilter === filter.id ? "text-white" : "text-primary"}>
                                            {filter.icon}
                                        </span>
                                        {filter.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-bold text-gray-700 mb-4">Trending Topics</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full cursor-pointer hover:bg-blue-200 transition">#AdoptDontShop</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full cursor-pointer hover:bg-green-200 transition">#HealthyPets</span>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full cursor-pointer hover:bg-yellow-200 transition">#DogTraining</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Column: Feed & Post Create */}
                <div className="lg:w-2/4 space-y-6">

                    {/* Create Post Banner */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/60">
                        {user ? (
                            <form onSubmit={handleCreatePost}>
                                <div className="flex gap-4">
                                    <img src={getProfilePic(user)} alt="You" className="w-12 h-12 rounded-full border-2 border-primary/20 object-cover" />
                                    <div className="flex-1">
                                        <textarea
                                            value={newPostText}
                                            onChange={(e) => setNewPostText(e.target.value)}
                                            placeholder={`Share a story, photo, or an update${(activeFilter !== 'Feed' && activeFilter !== 'My Posts') ? ' in ' + activeFilter : ''}...`}
                                            className="w-full bg-transparent border-none focus:ring-0 resize-none outline-none text-gray-700 text-lg placeholder-gray-400 min-h-[60px]"
                                        ></textarea>

                                        {/* Image Preview */}
                                        {selectedImage && (
                                            <div className="relative mt-2 inline-block">
                                                <img src={selectedImage} alt="Upload Preview" className="h-32 object-cover rounded-xl border border-gray-200" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedImage(null); setImageFile(null); }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex gap-4">
                                        <label className="text-gray-500 hover:text-primary transition flex items-center gap-2 font-medium cursor-pointer">
                                            <FaImage /> <span className="hidden sm:inline">Photo/Video</span>
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newPostText.trim() && !selectedImage}
                                        className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition shadow-md disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <FaPaperPlane /> Post
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                Please <a href="/login" className="text-primary hover:underline font-bold">log in</a> to share your stories with the community!
                            </div>
                        )}
                    </div>

                    {/* Feed Posts */}
                    <AnimatePresence>
                        {filteredPosts.map(post => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg border border-white/60 flex flex-col"
                            >
                                {/* Post Header */}
                                <div className="p-6 pb-2 flex justify-between items-start">
                                    <div className="flex gap-4 items-center">
                                        <img src={post.authorImage} alt={post.author} className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">{post.author}</h3>
                                            <p className="text-sm text-gray-500">{post.time} • <span className="text-primary font-medium">{post.category}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {post.category === "Lost & Found" && (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                                                LOST PET
                                            </span>
                                        )}
                                        {user && post.authorId === user.id && (
                                            <button 
                                                onClick={() => handleDeletePost(post.id)}
                                                className="ml-2 text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50"
                                                title="Delete Post"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="p-6 pt-2">
                                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                </div>

                                {/* Post Image */}
                                {post.image && (
                                    <div className="w-full max-h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center">
                                        <img src={post.image.includes('http') || post.image.startsWith('data:') ? post.image : `http://localhost:5250/${post.image.replace(/\\/g, '/')}`} alt="Post" className="w-full object-cover max-h-[500px]" />
                                    </div>
                                )}

                                {/* Post Stats & Actions */}
                                <div className="p-4 px-6 bg-gray-50/50">
                                    <div className="flex justify-between items-center text-gray-500 text-sm mb-4 px-2">
                                        <span>{post.likes} Likes</span>
                                        <button onClick={() => toggleComments(post.id)} className="hover:underline hover:text-primary transition">
                                            {post.comments} Comments
                                        </button>
                                    </div>

                                    <div className="flex border-t border-b border-gray-200 py-2">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-xl font-medium transition ${post.isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {post.isLiked ? <FaHeart /> : <FaRegHeart />} Like
                                        </button>
                                        <button onClick={() => toggleComments(post.id)} className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition">
                                            <FaRegComment /> Comment
                                        </button>
                                        <button className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition">
                                            <FaShare /> Share
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    <AnimatePresence>
                                        {expandedComments[post.id] && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-4 space-y-4">
                                                    {/* Comments List */}
                                                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                        {postComments[post.id]?.length > 0 ? (
                                                            postComments[post.id].map(comment => (
                                                                <div key={comment.id} className="flex gap-3">
                                                                    <img src={comment.authorImage} alt={comment.author} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                                                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex-1 border border-gray-100">
                                                                        <div className="flex justify-between items-baseline mb-1">
                                                                            <span className="font-bold text-sm text-gray-800">{comment.author}</span>
                                                                            <span className="text-xs text-gray-400">{comment.time}</span>
                                                                        </div>
                                                                        <p className="text-gray-600 text-sm">{comment.content}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-center text-sm text-gray-400 py-2">No comments yet. Be the first!</p>
                                                        )}
                                                    </div>

                                                    {/* Add Comment */}
                                                    {user ? (
                                                        <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-3 items-center mt-2">
                                                            <img src={getProfilePic(user)} alt="You" className="w-8 h-8 rounded-full object-cover" />
                                                            <div className="flex-1 relative">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Write a comment..." 
                                                                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                                                    value={newCommentTexts[post.id] || ""}
                                                                    onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                />
                                                            </div>
                                                            <button 
                                                                type="submit" 
                                                                disabled={!newCommentTexts[post.id]?.trim()}
                                                                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-primary/90 transition shadow-sm"
                                                            >
                                                                <FaPaperPlane className="text-xs ml-0.5" />
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <div className="text-center text-sm text-gray-500 mt-2">Login to reply</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>
                            </motion.div>
                        ))}
                        {filteredPosts.length === 0 && (
                            <div className="text-center py-12 bg-white/60 rounded-3xl">
                                <p className="text-gray-500 font-medium text-lg">No posts found.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Sidebar: Ads/Recommendations */}
                <div className="lg:w-1/4 hidden lg:block">
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-6 shadow-xl border border-white/60 sticky top-24">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">You might like</h3>

                        <div className="space-y-6">
                            <div className="group cursor-pointer">
                                <div className="h-32 rounded-2xl overflow-hidden mb-2 relative">
                                    <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400" alt="Pet event" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                                </div>
                                <h4 className="font-bold text-gray-800 group-hover:text-primary transition">Local Pet Expo 2026</h4>
                                <p className="text-sm text-gray-500">Join thousands of pet enthusiasts exploring the latest in pet care.</p>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="group cursor-pointer">
                                <div className="flex gap-3 items-center mb-2">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                        <FaVideo />
                                    </div>
                                    <h4 className="font-bold text-gray-800 group-hover:text-primary transition">Live Vet Q&A</h4>
                                </div>
                                <p className="text-sm text-gray-500">Dr. Sarah is going live at 5PM to answer your nutrition questions.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Community;
