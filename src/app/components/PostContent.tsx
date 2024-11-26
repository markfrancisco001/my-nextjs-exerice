"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { getUser } from "../../../utils/supabase/server";  
import toast from "react-hot-toast";
import { CommentIcon } from "./ui/social-icons";

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  username: string;
  avatar_url: string;
  comment_avatar_url: string; // Include comment avatar URL for the current user
}

interface Comment {
  users: any;
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  avatar_url: string; // Add avatar_url to the comment
  content: string;
  created_at: string;
}

export default function PostContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(''); // State to store current user avatar URL

  // Fetch all posts with user details
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            users: user_id ( username, avatar_url )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          setError('Failed to load posts');
          toast.error("Error fetching posts");
        } else {
          // Get the current user data (including avatar_url)
          const user = await getUser();
          const currentUserAvatarUrl = user?.user_metadata?.avatar_url || '/default_profile_icon.png'; // Get current user's avatar

          setCurrentUserAvatar(currentUserAvatarUrl); // Set current user avatar URL

          // Map posts to include user data and set comment_avatar_url to current user's avatar
          const postsWithUserData = data.map((post) => ({
            ...post,
            username: post.users?.username,
            avatar_url: post.users?.avatar_url || '/default_profile_icon.png',
            comment_avatar_url: currentUserAvatarUrl || '/default_profile_icon.png', // Use current user's avatar for comments
          }));

          setPosts(postsWithUserData);
          data && data.forEach((post: Post) => fetchComments(post.id));
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Fetch comments for a specific post, join with users table to get username and avatar_url
  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users: user_id ( username, avatar_url )
      `)
      .eq('post_id', postId);

    if (error) {
     
      toast.error("Error fetching comments");
      
    } else {
      const commentsWithUserData = data.map((comment: Comment) => ({
        ...comment,
        username: comment.users?.username || 'Anonymous',
        avatar_url: comment.users?.avatar_url || '/default_profile_icon.png',
      }));

      setComments((prev) => ({ ...prev, [postId]: commentsWithUserData }));
    }
  };

  // Add a new comment to a specific post
  const addComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentContent[postId]?.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const user = await getUser();  // Assuming getUser() fetches the authenticated user
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id') // Only select the user ID
    .eq('email', user.user_metadata?.email) // Match based on email
    .single(); // We expect only one record

    if (userError || !userData) {
      toast.error("Error fetching user ID");
      return;
    }

    const userId = userData.id; // Get the ID from the user's record

    const { error } = await supabase.from('comments').insert([{
      post_id: postId,
      user_id: userId,
      content: commentContent[postId],
    }]);

    if (error) {
      // console.error('Error adding comment:', error);
      toast.error("Error adding comment");
      // alert('Failed to add comment');
    } else {
      setCommentContent((prev) => ({ ...prev, [postId]: '' })); // Clear input for this specific post after posting
      fetchComments(postId); // Refresh comments for the specific post
    }
  };

  // Handle comment input change for a specific post
  const handleCommentChange = (postId: string, value: string) => {
    setCommentContent((prev) => ({ ...prev, [postId]: value }));
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="">
      {posts.map((post) => (
        <div key={post.id} className="bg-white text-black rounded-lg p-4 mb-6 shadow-md">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img src={post.avatar_url} alt="User's profile" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-semibold">{post.username}</h3>
              <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Post Content */}
          <p className="mb-4">{post.content}</p>

          {/* Post Actions */}
          <div className="flex justify-between items-center text-gray-500 text-sm mb-4 border-b border-gray-300">
            <span>{comments[post.id]?.length || 0} comments</span>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Comments</h4>
            {(comments[post.id] || []).map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 mb-3">
                <img src={comment.avatar_url} alt="Commenter's profile" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-semibold">{comment.username}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form onSubmit={(e) => addComment(e, post.id)} className="flex items-center space-x-2 mt-4">
            <img src={currentUserAvatar} alt="Your profile" className="w-8 h-8 rounded-full" />
            <input
              type="text"
              value={commentContent[post.id] || ''}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
              placeholder="Write a comment..."
              className="bg-gray-100 text-sm text-black placeholder-gray-500 rounded-full py-2 px-4 flex-1"
            />
            <button type="submit" className=" text-white py-1 px-3"><CommentIcon /></button>
          </form>
        </div>
      ))}
    </div>
  );
}
