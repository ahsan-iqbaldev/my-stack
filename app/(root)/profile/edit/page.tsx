"use client";
import Profile from "@/components/shared/forms/Profile";
import { getProfile } from "@/store/slices/profileSlice";
// import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from "@/types";
import { ThunkDispatch } from "@reduxjs/toolkit";
// import { auth } from '@clerk/nextjs'
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = ({ params }: ParamsProps) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { user } = useSelector((state: any) => state.authentication);
  const { profile } = useSelector((state: any) => state.profile);
  const userId = user?.userId;

  if (!user) redirect("/sign-in");

  useEffect(() => {
    dispatch(
      getProfile({
        userId,
      })
    );
  }, []);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} profile={profile} />
      </div>
    </>
  );
};

export default Page;
