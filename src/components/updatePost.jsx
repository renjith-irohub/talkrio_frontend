import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaPen } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "./Navbar";
import { getSinglePostAPI, updatePostAPI } from "../services/postServices";

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editContent, setEditContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch post using useQuery
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["singlePost", postId],
    queryFn: () => getSinglePostAPI(postId),
  });
console.log(post)
  // Initialize state with post data when loaded
  useEffect(() => {
    if (post) {
      setEditContent(post.content || "");
      setCharCount(post.content?.length || 0);
    }
  }, [post]);

  // Handle content change
  const handleContentChange = (e) => {
    const value = e.target.value;
    setEditContent(value);
    setCharCount(value.length);
    // Clear error message if user starts typing
    if (errorMessage) setErrorMessage("");
  };

  // Mutation for updating post
  const mutation = useMutation({
    mutationFn: async () => {
      if (!editContent.trim()) {
        throw new Error("Post content cannot be empty");
      }
      await updatePostAPI(postId, { content: editContent });
    },
    onSuccess: () => {
      alert("Post updated successfully ✅");
      queryClient.invalidateQueries(["posts"]); // Refresh posts after update
      navigate(`/postview`); // Navigate to the post's view
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to update the post ❌");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Failed to load post</h2>
          <p className="text-gray-600 mb-4">
            {error.message || "We couldn't retrieve your post. Please try again."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="pt-24 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center gap-3">
              <FaPen className="text-white" />
              <h2 className="text-2xl font-bold">Edit Your Post</h2>
            </div>
            <p className="text-blue-100 mt-1">Make your changes below and save when you're ready</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Display additional post details (read-only) */}
            {post && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Post Details</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                {post.author && (
                  <p className="text-gray-600">
                    <span className="font-medium">Author:</span> {post.author}
                  </p>
                )}
              </div>
            )}

            {/* Editable content */}
            <div className="relative mb-6">
              <textarea
                id="post-content"
                aria-label="Edit post content"
                className="w-full p-4 border border-gray-300 rounded-lg min-h-64 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                value={editContent}
                onChange={handleContentChange}
                placeholder="Write your thoughts here..."
                disabled={mutation.isPending}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {charCount} characters
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => mutation.mutate()}
                className={`
                  flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg
                  flex items-center justify-center gap-2 transition-all
                  ${mutation.isPending ? "opacity-80 cursor-wait" : "hover:shadow-lg hover:translate-y-px"}
                `}
                disabled={mutation.isPending}
              >
                <FaSave className="text-lg" />
                <span className="font-medium">
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </span>
              </button>

              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-all border border-gray-300"
                disabled={mutation.isPending}
              >
                <FaTimes className="text-lg" />
                <span className="font-medium">Cancel</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t border-gray-200">
            All changes will be visible immediately after saving
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;