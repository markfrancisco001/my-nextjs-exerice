
import { getUser } from "../../../utils/supabase/server";


async function BannerProfile() {
    const user = await getUser();
    return (
        <>
            
            {/* <!-- Banner Profile --> */}
                <div className="relative pt-6">
                    <h1>User Profile</h1>
                    
                </div>
                {/* <!-- User Info with Verified Button --> */}
                
                <div className="flex items-center mt-4">
                    {/* {user ? `${user.user_metadata.avatar_url}` : "Not Logged In"}  */}
                    <img 
                        src={user?.user_metadata?.avatar_url || '/default_profile_icon.png'}
                        alt="Profile Picture" 
                        className=" w-24 h-24 rounded-full border-4 border-white mr-5" 
                    />
                    <h2 className="text-xl font-bold text-gray-800">{user ? `${user.user_metadata.user_name}` : "Not Logged In"}</h2>
                </div>
                
        </>

    );

    
}

export default BannerProfile;