export type PostType = {
  title: string;
  body: string;
  upvotes: number;
  downvotes: string;
  _id: string;
  commentCount: number;
  createdAt: number;
};

export type VoteType = "upvote" | "downvote";
