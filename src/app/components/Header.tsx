import { getUser } from "../../../utils/supabase/server";
import Link from "next/link";
import LoginButton from "../components/LoginButton";
import SignOutButton from "../components/SignOutButton";
import UserAuthComponent from "../api/addUser";




export async function Header() {
  const user = await getUser();
  return (
    <header className="bg-zinc-900 h-16 flex items-center w-full absolute lg:justify-center">
      <nav className="flex gap-8 items-center text-white">
        <Link href="/" className="hover:text-emerald-600 ml-5 lg:ml-0">
          Home
        </Link>
        {/* <Link href="/login" className="hover:text-emerald-600 ">
          Login
        </Link> */}
      </nav>

      <div className="absolute right-4 text-white">
      {user ? <SignOutButton /> : <LoginButton />}
      {user ? <UserAuthComponent /> : ""}
      </div>
    </header>


  );
}

export default Header;