import { VoteType } from "../types";
import { baseUrl } from "../data";

type PostType = {
  id: string;
};

export default async function vote(
  postId: string,
  type: VoteType,
  upvotes: PostType[],
  downvotes: PostType[],
  updates: ((
    id: string,
    type: VoteType,
    hasUpvoted: boolean,
    hasDownvoted: boolean
  ) => void)[],
  token: string,
  set_token: (token: string) => void,
  set_error: (error: string) => void
) {
  const headers = { Authorization: "", "Content-Type": "application/json" };
  const hasUpvoted = upvotes.some((post) => post.id === postId);
  const hasDownvoted = downvotes.some((post) => post.id === postId);
  let upvote, downvote;

  if (type === "upvote") {
    if (hasUpvoted) upvote = -1;
    else upvote = 1;

    if (hasDownvoted) downvote = -1;
    else downvote = 0;
  } else if (type === "downvote") {
    if (hasDownvoted) downvote = -1;
    else downvote = 1;

    if (hasUpvoted) upvote = -1;
    else upvote = 0;
  } else return;

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${baseUrl}/api/posts/${postId}`, {
      method: "POST",
      body: JSON.stringify({ upvote, downvote }),
      headers,
    });
    const json = await response.json();

    if (json.token) set_token(json.token);

    updates.forEach((update) => update(postId, type, hasUpvoted, hasDownvoted));
  } catch (error) {
    console.log(error);

    set_error("Fuck!");
  }
}
