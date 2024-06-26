import Image from "next/image";
import React from "react";
import Logo from "@/public/assets/svg/randobanner.png";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { BTN_ENUM } from "@/config/constants";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";

const Header = () => {
  const router = useRouter();
  const { auth } = useAuth();
  const supabaseClient = useSupabaseClient();

  const logoutFn = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast.error("An error occured!");
    }
  };

  return (
    <header className="fixed left-0 top-0 z-50 h-20 w-full justify-center bg-[#ffffffb8] backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="m-auto flex h-full w-full max-w-screen-xl justify-between px-16">
        {/* 1280px */}
        <div className="flex">
          <Link className="flex" href="/">
            <Image src={Logo} width={146} height={48} alt="Logo" />
          </Link>
          <ul className="mx-16 flex h-full items-center justify-center">
            {auth?.userInfo && (
              <Link
                className="mr-4 font-semibold text-gray-600 hover:underline"
                href="/dashboard"
              >
                Create
              </Link>
            )}
                        {auth?.userInfo && (
              <Link
                className="mr-4 font-semibold text-gray-600 hover:underline"
                href="/rampbuildtest"
              >
                rampbuildtest
              </Link>
            )}
                        {auth?.userInfo && (
              <Link
                className="mr-4 font-semibold text-gray-600 hover:underline"
                href="/rampbuild"
              >
                rampbuild
              </Link>
            )}
            <Link
              className={`${
                auth ? "ml-4" : ""
              } font-semibold text-gray-600  hover:underline`}
              href="/about"
            >
              About
            </Link>
            {/* <Link
              className={`${
                auth ? "ml-4" : ""
              } font-semibold text-gray-600  hover:underline`}
              href="/rampbuild"
            >
              RampBuild
            </Link>
            <Link
              className={`${
                auth ? "ml-4" : ""
              } font-semibold text-gray-600  hover:underline`}
              href="/rampbuildtest"
            >
              RampBuildTest
            </Link> */}
          </ul>
        </div>
        <div className="flex items-center">
          {auth?.userInfo ? (
            <Button onClickFn={logoutFn}>Log out</Button>
          ) : (
            <>
              <Button
                variation={BTN_ENUM.PRIMARY_EMPTY}
                onClickFn={() => router.push("/login")}
                customClassName="mr-2"
              >
                Log In
              </Button>
              <Button
                onClickFn={() => router.push("/sign-up")}
                customClassName="ml-2"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
