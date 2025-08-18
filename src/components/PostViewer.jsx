
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash, FaEllipsisV, FaArrowLeft, FaArrowRight, FaFlag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { viewPostAPI, deletePostAPI, reportPostAPI, createCommentAPI, viewCommentAPI } from "../services/postServices";
import PostInteraction from "./PostInteraction";

const PostItem = ({ post, onDelete, onReport }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [newComment, setNewComment] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get the logged-in user's ID from Redux
  const userId = useSelector((state) => state.auth.id);
  console.log(userId)

  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: () => viewCommentAPI(post._id),
    enabled: !!post._id,
  });

  const createCommentMutation = useMutation({
    mutationFn: createCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      setNewComment("");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to post comment");
    },
  });

  const handleLike = () => {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikeCount((prevCount) => prevCount + (newLiked ? 1 : -1));
      return newLiked;
    });
  };

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex((prev) => (prev + direction + post.images.length) % post.images.length);
  };

  const handleCommentClick = () => setShowComments(!showComments);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate(
      { postId: post._id, content: newComment },
      { onSuccess: () => setNewComment("") }
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown && !e.target.closest(".dropdown-container")) {
        setActiveDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Check if the logged-in user is the post's author

  const isPostAuthor = userId && post.userId === userId;
  

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
      {/* Larger Header */}
      <div className="flex items-center p-6 border-b border-gray-100">
        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
          {post.author?.name?.[0] || "U"}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-semibold text-gray-900 text-xl">{post.author?.name || "Anonymous User"}</h3>
          <p className="text-gray-500 text-base">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            {new Date(post.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        <div className="dropdown-container relative">
          <button
            onClick={() => setActiveDropdown(!activeDropdown)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50"
          >
            <FaEllipsisV className="w-5 h-5" />
          </button>
          {activeDropdown && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10">
              {/* Show Edit and Delete only if the user is the post's author */}
              {isPostAuthor && (
                <>
                  <button
                    onClick={() => navigate(`/updatepost/${post._id}`)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-gray-700"
                  >
                    <FaEdit className="mr-2 text-gray-500" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(post._id)}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 flex items-center border-t border-gray-100"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </>
              )}
              {/* Always show Report option */}
              <button
                onClick={() => onReport(post._id)}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 text-orange-600 flex items-center border-t border-gray-100"
              >
                <FaFlag className="mr-2" /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <p className="text-gray-800 text-xl leading-relaxed">{post.content}</p>
      </div>

      {/* Image Gallery */}
      {post.images?.length > 0 && (
        <div className="relative aspect-[4/3] bg-gray-100">
          <img
            src={post.images[currentImageIndex]}
            alt="Post content"
            className="w-full h-full object-cover"
          />
          {post.images.length > 1 && (
            <>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === i ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => handleImageNavigation(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
              >
                <FaArrowLeft className="w-4 h-4 text-gray-900" />
              </button>
              <button
                onClick={() => handleImageNavigation(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
              >
                <FaArrowRight className="w-4 h-4 text-gray-900" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-4">
            <PostInteraction post={post} />
            <button
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
            >
              <FaComment className="w-5 h-5" />
              <span className="text-sm font-medium">{comments?.length || 0}</span>
            </button>
          </div>
          {post.location && (
            <div className="flex items-center text-sm font-medium">
              <span className="mr-1">📍</span>
              {post.location}
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="space-y-5 max-h-96 overflow-y-auto pb-4">
              {comments?.map((comment) => (
                <div key={comment._id} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-medium text-lg">
                    {comment.userId?.name?.[0] || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {comment.userId?.name || "User"}
                      </h4>
                      <p className="text-gray-700 text-base mt-2">{comment.content}</p>
                    </div>
                    <time className="text-sm text-gray-400 mt-2 block">
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              ))}
            </div>

            {/* Larger Comment Input */}
            <div className="mt-6 flex gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
                className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-300 border border-transparent"
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || createCommentMutation.isLoading}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full text-lg font-medium disabled:opacity-50 transition-colors"
              >
                {createCommentMutation.isLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportingPostId, setReportingPostId] = useState(null);

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: viewPostAPI,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      alert("Post deleted successfully");
    },
  });

  const reportMutation = useMutation({
    mutationFn: reportPostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setShowReportModal(false);
      alert("Post reported successfully");
    },
  });

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(postId);
    }
  };

  const handleReportSubmit = () => {
    if (!reportReason) return;
    reportMutation.mutate({ id: reportingPostId, reason: reportReason });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container max-w-2xl mx-auto px-4 py-20">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Feed</h1>
          <p className="text-gray-600">Discover stories from our community</p>
        </header>

        <div className="space-y-6">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-800 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Error loading posts</h3>
              <p>Please try refreshing the page</p>
            </div>
          )}

          {posts?.length > 0 ? (
            posts.map((post) => (
              <PostItem
                key={post._id}
                post={post}
                onDelete={handleDelete}
                onReport={(id) => {
                  setReportingPostId(id);
                  setShowReportModal(true);
                }}
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  No posts yet
                </h3>
                <button
                  onClick={() => navigate("/post-view")}
                  className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white px-8 py-2.5 rounded-full font-medium hover:shadow-md transition-all"
                >
                  Create First Post
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Report Post</h3>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full mb-4 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select a reason</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="false-info">False information</option>
                <option value="other">Other</option>
              </select>
              
              {reportReason === "other" && (
                <textarea
                  placeholder="Please explain..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-teal-500"
                  rows="3"
                />
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportSubmit}
                  disabled={!reportReason}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PostPage;