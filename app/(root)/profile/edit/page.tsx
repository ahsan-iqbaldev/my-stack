"use client";
import Profile from "@/components/shared/forms/Profile";
// import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from "@/types";
// import { auth } from '@clerk/nextjs'
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

const Page = ({ params }: ParamsProps) => {
  const { user } = useSelector((state: any) => state.authentication);
  const userId = user?.userId;

  if (!user) redirect("/sign-in");

  //   const mongoUser = await getUserById({ userId })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={user} />
      </div>
    </>
  );
};

export default Page;
