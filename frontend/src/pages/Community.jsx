import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    FaVideo
} from "react-icons/fa";

// Dummy Posts
const initialPosts = [
    {
        id: "p1",
        author: "Emily R.",
        authorImage: "https://i.pravatar.cc/150?img=5",
        time: "2 hours ago",
        category: "Feed", // generic update
        type: "update",
        content: "Just adopted this little guy! Meet Buster. He loves his new toys already. 🐶❤️",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
        likes: 124,
        comments: 12,
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
        comments: 8,
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
        comments: 29,
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
        comments: 5,
        isLiked: false
    }
];

const Community = () => {
    const [posts, setPosts] = useState(initialPosts);
    const [activeFilter, setActiveFilter] = useState("Feed");
    const [newPostText, setNewPostText] = useState("");

    const filters = [
        { id: "Feed", label: "All Feed", icon: <FaUserCircle /> },
        { id: "Lost & Found", label: "Lost & Found", icon: <FaSearchLocation /> },
        { id: "Ask Vet", label: "Ask Vet / Tips", icon: <FaStethoscope /> },
        { id: "Blog", label: "Blog & Articles", icon: <FaBookOpen /> },
    ];

    const handleLike = (id) => {
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
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!newPostText.trim()) return;

        const newPost = {
            id: `p${Date.now()}`,
            author: "You",
            authorImage: "https://i.pravatar.cc/150?img=1",
            time: "Just now",
            category: activeFilter === "Feed" ? "Feed" : activeFilter,
            type: "update",
            content: newPostText,
            image: null,
            likes: 0,
            comments: 0,
            isLiked: false
        };

        setPosts([newPost, ...posts]);
        setNewPostText("");
    };

    const filteredPosts = activeFilter === "Feed"
        ? posts
        : posts.filter(post => post.category === activeFilter || post.category === "Feed" && activeFilter === "Feed");

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
                        <form onSubmit={handleCreatePost}>
                            <div className="flex gap-4">
                                <img src="https://i.pravatar.cc/150?img=1" alt="You" className="w-12 h-12 rounded-full border-2 border-primary/20" />
                                <div className="flex-1">
                                    <textarea
                                        value={newPostText}
                                        onChange={(e) => setNewPostText(e.target.value)}
                                        placeholder={`Share a story, photo, or an update${activeFilter !== 'Feed' ? ' in ' + activeFilter : ''}...`}
                                        className="w-full bg-transparent border-none focus:ring-0 resize-none outline-none text-gray-700 text-lg placeholder-gray-400 min-h-[60px]"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <div className="flex gap-4">
                                    <button type="button" className="text-gray-500 hover:text-primary transition flex items-center gap-2 font-medium">
                                        <FaImage /> <span className="hidden sm:inline">Photo/Video</span>
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newPostText.trim()}
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition shadow-md disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FaPaperPlane /> Post
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Feed Posts */}
                    <AnimatePresence>
                        {filteredPosts.map(post => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg border border-white/60"
                            >
                                {/* Post Header */}
                                <div className="p-6 pb-2 flex justify-between items-start">
                                    <div className="flex gap-4 items-center">
                                        <img src={post.authorImage} alt={post.author} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">{post.author}</h3>
                                            <p className="text-sm text-gray-500">{post.time} • <span className="text-primary font-medium">{post.category}</span></p>
                                        </div>
                                    </div>
                                    {post.category === "Lost & Found" && (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                                            LOST PET
                                        </span>
                                    )}
                                </div>

                                {/* Post Content */}
                                <div className="p-6 pt-2">
                                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                </div>

                                {/* Post Image */}
                                {post.image && (
                                    <div className="w-full h-80 overflow-hidden bg-gray-100">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* Post Stats & Actions */}
                                <div className="p-4 px-6 bg-gray-50/50">
                                    <div className="flex justify-between items-center text-gray-500 text-sm mb-4 px-2">
                                        <span>{post.likes} Likes</span>
                                        <span>{post.comments} Comments</span>
                                    </div>

                                    <div className="flex border-t border-gray-200 pt-2">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-xl font-medium transition ${post.isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {post.isLiked ? <FaHeart /> : <FaRegHeart />} Like
                                        </button>
                                        <button className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition">
                                            <FaRegComment /> Comment
                                        </button>
                                        <button className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition">
                                            <FaShare /> Share
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {filteredPosts.length === 0 && (
                            <div className="text-center py-12 bg-white/60 rounded-3xl">
                                <p className="text-gray-500 font-medium text-lg">No posts found in this category.</p>
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
