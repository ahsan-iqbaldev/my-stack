"use client";
import Answer from "@/components/shared/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
// import { getQuestionById } from '@/lib/actions/question.action';
// import { getUserById } from '@/lib/actions/user.action';
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
// import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAnswer, getSingleQuestion } from "@/store/slices/homeSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import moment from "moment";
import { redirect } from "next/navigation";
import Loader from "@/components/shared/Loader";

const Page = ({ params, searchParams }: any) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { user } = useSelector((state: any) => state.authentication);
  const { sinleQuestion, loading, answers } = useSelector(
    (state: any) => state.home
  );

  // console.log(answers,"'answersanswersanswers");
  const userId = user?.userId;
  const docId = params?.id;

  console.log(userId, docId, "params");

  const result = {
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
    isNextAnswer: true,
    views: 23,
    answers: [],
    id: "89789748973",
    createdAt: new Date(),
    hasSaved: false,
    upvotes: [],
    downvotes: [],
    hasupVoted: true,
    hasdownVoted: false,
    content:
      "<p>I'm working on a Next.js project and want to implement Server-Side Rendering (SSR) for efficient data fetching. What are the best practices for data fetching in a Next.js application with SSR? How can I ensure that my data is pre-fetched on the server and passed to the client for improved performance and SEO?</p>\n<pre class=\"language-markup\"><code>// pages/index.js\n\nimport React from 'react';\n\nfunction HomePage({ data }) {\n  return (\n    &lt;div&gt;\n      {/* Render data here */}\n    &lt;/div&gt;\n  );\n}\n\nexport function getServerSideProps() {\n  const res = fetch('https://api.example.com/data');\n  const data = res.json();\n\n  return {\n    props: {\n      data,\n    },\n  };\n}\n\nexport default HomePage;</code></pre>",
    author: {
      id: "49820948290",
      name: "Ahsan Author",
      picture: "/assets/images/logo.png",
      clerkId: "8094892374824",
    },
    tags: [
      {
        id: "9823049823",
        name: "Ahsan",
        questions: [],
      },
      {
        id: "9823049823",
        name: "Ahsan",
        questions: [],
      },

      {
        id: "9823049823",
        name: "Ahsan",
        questions: [],
      },
      {
        id: "9823049823",
        name: "Ahsan",
        questions: [],
      },
    ],
  };

  if (!user) redirect("/sign-in");
  useEffect(() => {
    dispatch(getSingleQuestion({ docId, userId }));
    dispatch(getAnswer({ docId }));
  }, []);

  return (
    <>
      <div className="flex-start w-full flex-col">
        {loading && <Loader />}
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${sinleQuestion?.author?.id}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={sinleQuestion?.author?.profileImage}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {sinleQuestion?.author?.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={sinleQuestion?.id}
              userId={userId}
              upvotes={sinleQuestion?.upvotes}
              hasupVoted={
                sinleQuestion?.stats == null
                  ? false
                  : sinleQuestion?.stats[0]?.hasupVoted
              }
              downvotes={sinleQuestion?.downvotes}
              hasdownVoted={
                sinleQuestion?.stats == null
                  ? false
                  : sinleQuestion?.stats[0]?.hasdownVoted
              }
              hasSaved={result?.hasSaved}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {sinleQuestion?.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${moment
            .unix(sinleQuestion?.createdAt?.seconds)
            .format("DD-MMM-YYYY")}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={sinleQuestion?.content || ""} />

      <div className="mt-8 flex flex-wrap gap-2">
        {sinleQuestion?.tags?.map((tag: any) => (
          <RenderTag key={tag} id={tag} name={tag} showCount={false} />
        ))}
      </div>

      <AllAnswers
        questionId={sinleQuestion?.id}
        userId={userId}
        totalAnswers={answers?.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <Answer
        question={sinleQuestion?.content}
        questionId={JSON.stringify(sinleQuestion?.id)}
        authorId={JSON.stringify(userId)}
      />
    </>
  );
};

export default Page;
