import { useDBContext } from "../../context/db.tsx";
import { PostType } from "../../types.ts";
import SCHomePost from "./HomePost.styled.tsx";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-solidjs";

type Props = {
  post: PostType;
};

export default function HomePost(props: Props) {
  const dbStore = useDBContext();

  function upvote() {
    console.log(props.post);
  }

  function downvote() {}

  return (
    <SCHomePost>
      <div class="head">
        <a href={`/solid_blog/posts/${props.post._id}`}>{props.post.title}</a>
        <div class="score">
          <button
            classList={{
              upvote: true,
              active: dbStore
                .upvoted()
                .some((post) => post.id === props.post._id),
            }}
            onclick={upvote}
          >
            <IconArrowUp />
            <p>{props.post.upvotes}</p>
          </button>
          <div class="separator"></div>
          <button
            onClick={downvote}
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
