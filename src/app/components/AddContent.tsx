'use client';

import { useState } from 'react';
import { supabase } from '../../../utils/supabase/client';  // Adjust this import according to your setup
import { getUser } from "../../../utils/supabase/server";  // Adjust this according to your implementation
import toast from "react-hot-toast";

const AddContent = () => {
  // Define state variables for post content and image URL
  const [postContent, setPostContent] = useState('');  // Track post content
  const [loading, setLoading] = useState(false);  // Track loading state

  // Function to add the post
const addPost = async (content: string) => {
  setLoading(true);
  try {
    const user = await getUser(); // Assuming getUser() fetches the authenticated user
    if (user) {
      // Step 1: Fetch the current user's ID from the 'users' table based on email
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

      // Step 2: Insert the post with user_id set to the fetched user ID
      const { error: postError } = await supabase
        .from('posts')
        .insert([{ user_id: userId, content }])
        .single(); // Use .single() to get a single object

      if (postError) {
        toast.error("Error inserting post");
      } else {
        toast.success("Post added");
        window.location.reload();
      }
    } else {
      toast.error("Please log in to add a new post");
    }
  } catch (error) {
    console.error("Error adding post:", error);
    toast.error("Error adding post");
  } finally {
    setLoading(false);
  }
};


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();  // Prevent the form from submitting the traditional way
    await addPost(postContent);  // Call addPost with the current state values
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Post Content Section */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Post Content:</label>
          <textarea
            id="postContent"
            name="postContent"
            className="w-full border-2 rounded-md px-4 py-2 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500"
            placeholder="What's on your mind?"
            value={postContent}  // Bind the value to state
            onChange={(e) => setPostContent(e.target.value)}  // Update state on input change
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue text-white py-2 px-4 rounded-md transition duration-300 gap-2"
            disabled={loading}  // Disable the button when loading
          >
            {loading ? 'Posting...' : 'Post'}  {/* Show loading text */}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddContent;
