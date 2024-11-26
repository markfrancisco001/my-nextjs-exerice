// pages/api/addPost.ts
import { supabase } from '../../../utils/supabase/client'; // Adjust the import as necessary
import { getUser } from "../../../utils/supabase/server";

export default async function handler(req: { method: string; body: { content: any;}; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; post?: never; }): void; new(): any; }; }; }) {
  if (req.method === 'POST') {
    try {
      const { content} = req.body;

      // Get the user from the session
      const user = await getUser();

      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Insert the new post into the database
      const { data, error } = await supabase
        .from('posts')
        .insert([{ user_id: user.user_metadata.github_id, content}])
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ post: data });
      
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
