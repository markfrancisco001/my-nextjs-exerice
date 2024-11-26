import { getUser } from "../../../utils/supabase/server";
import LoginButton from "../components/LoginButton";
import SignOutButton from "../components/SignOutButton";

async function LoginPage() {
  const user = await getUser();
  
  
  return <>{user ? <SignOutButton /> : <LoginButton />}</>
}

export default LoginPage;