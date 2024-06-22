"use client";

import QuestionCard from "@/components/shared/cards/QuestionCard";
import Loader from "@/components/shared/Loader";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getSingleTag, getTagQuestions } from "@/store/slices/tagsSlice";
import { URLProps } from "@/types";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = ({ params, searchParams }: URLProps) => {
  console.log(params, "byahsanparams");
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { singleTag, questions, loading } = useSelector(
    (state: any) => state.tags
  );
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
        upvotes: [],
        views: 4,
        answers: [],
        createdAt: new Date(),
      },
    ],
    isNext: false,
    tagTitle: "Tag Title",
  };

  useEffect(() => {
    dispatch(
      getSingleTag({
        tagId: params.id,
        onSuccess: (res: any) => {
          dispatch(getTagQuestions({ questionIds: res?.questions }));
        },
      })
    );
  }, []);

  // useEffect(() => {}, [singleTag]);

  return (
    <>
      {loading && <Loader />}
      <h1 className="h1-bold text-dark100_light900">{singleTag?.name}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions?.length > 0 ? (
          questions?.map((question: any) => (
            <QuestionCard
              key={question?.id}
              id={question?.id}
              title={question?.title}
              tags={question?.tags}
              author={question?.author}
              upvotes={(question?.downvotes || 0) + (question?.upvotes || 0)}
              views={50}
              answers={[
                { id: "1", author: "ali" },
                { id: "2", author: "Ahsan" },
              ]}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no tag question saved to show"
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
};

export default Page;
