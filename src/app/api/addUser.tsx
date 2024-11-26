"use client";
import { supabase } from '../../../utils/supabase/client';
import { getUser } from "../../../utils/supabase/server";
import { useEffect } from 'react';

export async function insertOrUpdateUserInDatabase() {
    // toast.success("Attempting to insert or update user...");

    // Retrieve the current authenticated user
    const user = await getUser();
    // toast.success(`Authenticated user: ${user?.user_metadata.user_name} (${user?.user_metadata.email})`);
    if (user) {
        const { error } = await supabase
            .from('users')
            .upsert([{
                email: user?.user_metadata?.email,
                username: user?.user_metadata?.user_name,
                avatar_url: user?.user_metadata?.avatar_url,
            }], { onConflict: 'email' });

        if (error) {
            // toast.error("Error inserting or updating user");
            // console.error(error);
        } else {
            // toast.success("User inserted/updated successfully");
        }
    } else {
        // console.error("No user found after login.");
    }
}

export default function UserAuthComponent() {
    useEffect(() => {
        // Call the function when component mounts
        insertOrUpdateUserInDatabase();
    }, []);

    return (
        <div>
            
        </div>
    );
}
