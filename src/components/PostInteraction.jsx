import { useState, useCallback } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dislikePostAPI, getSinglePostAPI, likePostAPI } from '../services/postServices';
import { useSelector } from 'react-redux';

const PostInteraction = ({ post }) => {
    const userId = useSelector((state) => state.auth?.id || null);
    const queryClient = useQueryClient();
    const [error, setError] = useState(null);
  
    // Fetch post data with useQuery
    const { data: postData, isLoading: isQueryLoading, error: queryError } = useQuery({
      queryKey: ['post', post._id],
      queryFn: () => getSinglePostAPI(post._id),
      enabled: !!post._id,
    });
    console.log("hi",postData);
    console.log(userId);
  
    // Derive liked and likeCount from postData
    const liked = postData?.likes?.includes(userId) || false;
    const likeCount = postData?.likes?.length || 0;
    
    
    // Like mutation
    const likeMutation = useMutation({
      mutationFn: likePostAPI,
      onSuccess: () => {
        queryClient.invalidateQueries(['post', post._id]);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  
    // Unlike mutation
    const unlikeMutation = useMutation({
      mutationFn: dislikePostAPI,
      onSuccess: () => {
        queryClient.invalidateQueries(['post', post._id]);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  
    const handleLike = useCallback(async() => {
      setError(null);
      if (liked) {
        await unlikeMutation.mutateAsync(post._id);
      } else {
        await likeMutation.mutateAsync(post._id);
      }
    }, [liked, likeMutation, unlikeMutation, post._id]);
  
    const isLoading = isQueryLoading || likeMutation.isLoading || unlikeMutation.isLoading;
  
    return (
        <div className="p-4">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 ${
                liked ? 'text-red-500' : 'text-gray-600 hover:text-gray-700'
              } transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={liked ? 'Unlike post' : 'Like post'}
              aria-pressed={liked}
              disabled={isLoading}
            >
              {liked ? (
                <FaHeart className="w-5 h-5" />
              ) : (
                <FaRegHeart className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
          </div>
          {(error || queryError) && (
            <div className="text-red-500 text-sm font-medium" role="alert">
              {error || queryError?.message}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default PostInteraction;