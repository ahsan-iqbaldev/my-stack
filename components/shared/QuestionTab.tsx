import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../shared/cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
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
    isNextQuestions: false,
  };

  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question.id}
          id={question.id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNextQuestions}
        />
      </div>
    </>
  );
};

export default QuestionTab;
