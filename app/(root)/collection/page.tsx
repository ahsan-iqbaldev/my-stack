"use client";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getMyQuestions } from "@/store/slices/collectionSlice";
// import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { auth } from "@clerk/nextjs/server";

export default function Home({ searchParams }: SearchParamsProps) {
  const { user } = useSelector((state: any) => state.authentication);
  const { questions } = useSelector((state: any) => state.collection);
  const userId = user?.userId;
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  if (!user) redirect("/sign-in");

  const result = {
    questions: [
      {
        id: "9183809",
        title: "Ahsan Iqbal",
        tags: [
          {
            id: "83984",
            name: "Ahsaniqbal",
          },
        ],
        author: {
          id: "49820948290",
          name: "Ahsan Author",
          picture: "/assets/images/logo.png",
          clerkId: "8094892374824",
        },
        upvotes: 4,
        views: 4,
        answers: [],
        createdAt: new Date(),
      },
    ],
    isNext: false,
  };

  useEffect(() => {
    dispatch(getMyQuestions({ userId }));
  }, []);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions?.length > 0 ? (
          questions?.map((question: any) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />

          ))
        ) : (
          <NoResult
            title="There’s no question saved to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}
