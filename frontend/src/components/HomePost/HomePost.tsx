import { useDBContext } from "../../context/db.tsx";
import { baseUrl } from "../../data.ts";
import { PostType } from "../../types.ts";
import SCHomePost from "./HomePost.styled.tsx";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-solidjs";

type Props = {
  post: PostType;
};

export default function HomePost(props: Props) {
  const dbStore = useDBContext();

  async function vote(event: { target: HTMLElement }) {
    const value = Number(event.target.dataset.value);
    let upvote, downvote;

    if (value === 1) {
      const hasUpvoted = dbStore
        .upvoted()
        .some((post) => post.id === props.post._id);

      if (hasUpvoted) upvote = -1;
      else upvote = 1;

      downvote = 0;
    } else {
      const hasDownvoted = dbStore
        .downvoted()
        .some((post) => post.id === props.post._id);

      if (hasDownvoted) downvote = -1;
      else downvote = 1;

      upvote = 0;
    }

    try {
      const response = await fetch(`${baseUrl}/api/posts/${props.post._id}`, {
        method: "POST",
        body: JSON.stringify({ upvote, downvote }),
      });
      const json = await response.json();

      if (json.newToken) dbStore.setToken(json.newToken);
      
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SCHomePost>
      <div class="head">
        <a href={`/solid_blog/posts/${props.post._id}`}>{props.post.title}</a>
        <div class="score">
          <button
            data-value="1"
            classList={{
              upvote: true,
              active: dbStore
                .upvoted()
                .some((post) => post.id === props.post._id),
            }}
            onclick={vote}
          >
            <IconArrowUp />
            <p>{props.post.upvotes}</p>
          </button>
          <div class="separator"></div>
          <button
            data-value="-1"
            onClick={vote}
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
