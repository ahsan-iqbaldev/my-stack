import { SearchParamsProps } from "@/types";
import AnswerCard from "./cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab =  ({ searchParams, userId, clerkId }: Props) => {
  const result = {
    answers: [
      {
        id: "9183809",
        question: {
          id: "8029384098",
          title: "Questions",
        },
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
    isNextAnswer: false,
  };
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item.id}
          clerkId={clerkId}
          id={item.id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNextAnswer}
        />
      </div>
    </>
  );
};

export default AnswersTab;
