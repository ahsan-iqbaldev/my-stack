"use client";
import Question from "@/components/shared/forms/Question";
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { user } = useSelector((state: any) => state.authentication);

  if (!user) redirect("/sign-in");

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
