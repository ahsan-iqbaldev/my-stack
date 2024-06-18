import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";
// import { getHotQuestions } from "@/lib/actions/question.action";
// import { getTopPopularTags } from "@/lib/actions/tag.actions";

const RightSidebar =  () => {
  const hotQuestions = [
    {
      title:
        "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
      id: "9480298432",
    },
    {
      title: "Is it only me or the font is bolder than necessary?",
      id: "9823984909",
    },
    {
      title: "Redux Toolkit Not Updating State as Expected",
      id: "9809809139",
    },
    {
      title: "Can I get the course for free?",
      id: "0989809809",
    },
  ];
  const popularTags = [
    {
      id: "8942098432",
      name: "react",
      numberOfQuestions: 10,
    },
    {
      id: "98234892834",
      name: "nextjs",
      numberOfQuestions: 20,
    },
    {
      id: "8942098432",
      name: "Vuew JS",
      numberOfQuestions: 30,
    },
    {
      id: "8942098432",
      name: "NodeJS",
      numberOfQuestions: 50,
    },
  ];

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions?.map((question) => (
            <Link
              href={`/question/${question.id}`}
              key={question.id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag.id}
              id={tag.id}
              name={tag.name}
              totalQuestions={tag.numberOfQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
