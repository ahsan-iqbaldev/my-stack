import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import Metric from "../Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
// import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";
import moment from "moment";

interface QuestionProps {
  id: string;
  title: string;
  tags: {
    id: string;
    name: string;
  }[];
  author: {
    id: string;
    name: string;
    profileImage: any;
    clerkId: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: any;
  clerkId?: string | null;
}

const QuestionCard = ({
  clerkId,
  id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  console.log(author, "authorauthor");

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {moment.unix(createdAt?.seconds).format("DD-MMM-YYYY")}
          </span>
          <Link href={`/question/${id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        {showActionButtons && (
          <EditDeleteAction type="Question" itemId={JSON.stringify(id)} />
        )}
        {/* <SignedIn>
        </SignedIn> */}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag: any) => (
          <RenderTag key={tag} id={tag} name={tag} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author?.profileImage}
          alt="user"
          value={author.name}
          title={` - asked  ${moment
            .unix(createdAt?.seconds)
            .format("DD-MMM-YYYY")}`}
          href={`/profile/${author.id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(upvotes || 0)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(answers?.length || 0)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
