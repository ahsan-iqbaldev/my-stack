"use client";
import Question from "@/components/shared/forms/Question";
import { getTags } from "@/store/slices/questionSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { user } = useSelector((state: any) => state.authentication);

  if (!user) redirect("/sign-in");

  useEffect(() => {
    dispatch(getTags());
  }, []);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <Question mongoUserId={"9823091809380912839812"} />
      </div>
    </div>
  );
};

export default Page;
