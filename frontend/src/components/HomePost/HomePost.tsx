import { useDBContext } from "../../context/db.tsx";
import { PostType, VoteType } from "../../types.ts";
import vote from "../../utilities/vote.ts";
import SCHomePost from "./HomePost.styled.tsx";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-solidjs";

type Props = {
  post: PostType;
  update_score: (
    postId: string,
    type: VoteType,
    isInUpvotes: boolean,
    isInDownvotes: boolean
  ) => void;
};

export default function HomePost(props: Props) {
  const dbStore = useDBContext();

  async function handle_vote(
    event: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) {
    const type = (event.target as HTMLElement).dataset.type;

    if (type !== "upvote" && type !== "downvote") return;

    vote(
      props.post._id,
      type,
      dbStore.upvoted(),
      dbStore.downvoted(),
      [dbStore.vote, props.update_score],
      dbStore.token(),
      dbStore.set_token,
      dbStore.setError
    );
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
            <span>{props.post.upvotes}</span>
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
            <span>{props.post.downvotes}</span>
          </button>
        </div>
      </div>
      <div class="meta"></div>
      <p class="body">{props.post.body}</p>
    </SCHomePost>
  );
}
