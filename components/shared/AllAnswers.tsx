import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
// import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";
import moment from "moment";

interface Props {
  questionId: string;
  userId: any;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  //   const result = await getAnswers({
  //     questionId,
  //     page: page ? +page : 1,
  //     sortBy: filter,
  //   })
  const { answers } = useSelector((state: any) => state.home);
  const result = {
    isNextAnswer: true,
    answers: [
      {
        id: "89789748973",
        createdAt: new Date(),
        upvotes: [],
        downvotes: [],
        hasupVoted: true,
        hasdownVoted: false,
        content:
          "<p>When implementing Server-Side Rendering (SSR) for efficient data fetching in a Next.js project, there are several best practices to follow. Here's how you can ensure that your data is pre-fetched on the server and passed to the client for improved performance and SEO:<br><br>1. Use the `getServerSideProps()` function: In your page component, define an `async` function called `getServerSideProps()`. This function will be executed on the server side and its return value will be passed as props to your page component.<br><br>2. Fetch the data in `getServerSideProps()`: Use the `fetch()` function or any other suitable method to fetch the required data from the API server inside the `getServerSideProps()` function. In your example, you are using `fetch('https://api.example.com/data')`.<br><br>3. Parse the response: Use the appropriate method, such as `response.json()`, to parse the JSON response received from the API server. In your example, you are parsing the response using `await res.json()`.<br><br>4. Return the data as props: Once you have fetched and parsed the data, return it as an object in the `props` key of the return value from the `getServerSideProps()` function. In your example, you are returning `{ props: { data } }`.</p>",
        author: {
          id: "49820948290",
          name: "Ahsan Author",
          picture: "/assets/images/logo.png",
          clerkId: "8094892374824",
        },
      },
    ],
  };

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {answers?.map((answer: any) => (
          <article key={answer.id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer?.author?.id}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer?.author?.profileImage}
                  width={18}
                  height={18}
                  alt="profile"
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author.name}
                  </p>

                  <p className="small-regular text-light400_light500 ml-2 mt-0.5  line-clamp-1">
                    answered{" "}
                    {moment
                      .unix(answer?.createdAt?.seconds)
                      .format("DD-MMM-YYYY hh:mm A")}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                {/* <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer.id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasupVoted={answer.hasupVoted}
                  downvotes={answer.downvotes.length}
                  hasdownVoted={answer.hasdownVoted}
                /> */}
              </div>
            </div>
            <ParseHTML data={answer.content || ""} />
          </article>
        ))}
      </div>

      <div className="mt-10 w-full">
        <Pagination
          pageNumber={page ? +page : 1}
          isNext={result.isNextAnswer}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
