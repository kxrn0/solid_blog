import { useDBContext } from "../../context/db.tsx";
import { baseUrl } from "../../data.ts";
import { PostType, VoteType } from "../../types.ts";
import SCHomePost from "./HomePost.styled.tsx";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-solidjs";

type Props = {
  post: PostType;
  update_score: (postId: string, upvote: number, downvote: number) => void;
};

export default function HomePost(props: Props) {
  const dbStore = useDBContext();

  async function handle_vote(
    event: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) {
    const headers = { Authorization: "", "Content-Type": "application/json" };
    const type = (event.target as HTMLElement).dataset.type as VoteType;
    const hasUpvoted = dbStore
      .upvoted()
      .some((post) => post.id === props.post._id);
    const hasDownvoted = dbStore
      .downvoted()
      .some((post) => post.id === props.post._id);
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

    if (dbStore.token()) headers.Authorization = `Bearer ${dbStore.token()}`;

    try {
      const response = await fetch(`${baseUrl}/api/posts/${props.post._id}`, {
        method: "POST",
        body: JSON.stringify({ upvote, downvote }),
        headers,
      });
      const json = await response.json();

      if (json.token) dbStore.set_token(json.newToken);

      dbStore.vote(props.post._id, type, hasUpvoted, hasDownvoted);
      //update the parent's state here
    } catch (error) {
      console.log(error);

      dbStore.setError("Fuck!");
    }
  }

  return (
    <SCHomePost>
      <div class="head">
        <a href={`/solid_blog/posts/${props.post._id}`}>{props.post.title}</a>
        <div class="score">
          <button
            data-type="upvote"
            classList={{
              upvote: true,
              active: dbStore
                .upvoted()
                .some((post) => post.id === props.post._id),
            }}
            onClick={handle_vote}
          >
            <IconArrowUp />
            <p>{props.post.upvotes}</p>
          </button>
          <div class="separator"></div>
          <button
            data-type="downvote"
            onClick={handle_vote}
            classList={{
              downvote: true,
              active: dbStore
                .downvoted()
                .some((post) => post.id === props.post._id),
            }}
          >
            <IconArrowDown />
            <p>{props.post.downvotes}</p>
          </button>
        </div>
      </div>
      <div class="meta"></div>
      <p class="body">{props.post.body}</p>
    </SCHomePost>
  );
}
