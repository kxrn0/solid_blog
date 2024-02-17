import { useParams } from "@solidjs/router";
import SCPost from "./Post.styled.tsx";
import { Show, createSignal, onMount } from "solid-js";
import { PostType, VoteType } from "../../types.ts";
import { useDBContext } from "../../context/db.tsx";
import { baseUrl } from "../../data.ts";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-solidjs";
import vote from "../../utilities/vote.ts";

type PostDataType = {
  post: PostType;
  commentCount: number;
};

export default function Post() {
  const [postData, setPostData] = createSignal<null | PostDataType>(null);
  const createdAt = () => {
    if (!postData()) return "";

    return new Date(postData()!.post.createdAt).toDateString();
  };
  const params = useParams;
  const dbStore = useDBContext();

  function update_score(
    _: any,
    type: VoteType,
    hasUpvoted: boolean,
    hasDownvoted: boolean
  ) {
    function update_post(
      post: PostType,
      type: VoteType,
      fun: (a: number, b: number) => number
    ) {
      const value = Number(post[`${type}s`]);
      const updated = { [`${type}s`]: fun(value, 1) };

      return { ...post, ...updated };
    }

    if (hasUpvoted || hasDownvoted) {
      const isOfSameType =
        (type === "upvote" && hasUpvoted) ||
        (type === "downvote" && hasDownvoted);

      if (isOfSameType)
        setPostData((prev) => ({
          ...prev!,
          post: update_post(prev!.post, type, (a, b) => a - b),
        }));
      else {
        const add: keyof PostType = `${type}s`;
        const remove: keyof PostType = `${
          type === "upvote" ? "downvote" : "upvote"
        }s`;
        const update = {
          [add]: Number(postData()!.post[add]) + 1,
          [remove]: Number(postData()!.post[remove]) - 1,
        };

        setPostData((prev) => ({
          ...prev!,
          post: { ...prev!.post, ...update },
        }));
      }
    } else
      setPostData((prev) => ({
        ...prev!,
        post: update_post(prev!.post, type, (a, b) => a + b),
      }));
  }

  function handle_vote(
    event: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) {
    const type = (event.target as HTMLElement).dataset.type;

    if ((type !== "upvote" && type !== "downvote") || !postData()) return;

    vote(
      postData()!.post._id,
      type,
      dbStore.upvoted(),
      dbStore.downvoted(),
      [dbStore.vote, update_score],
      dbStore.token(),
      dbStore.set_token,
      dbStore.setError
    );
  }

  onMount(async () => {
    const postId = params().postId;

    try {
      const response = await fetch(`${baseUrl}/api/posts/${postId}`);
      const json = await response.json();

      setPostData(json);
    } catch (error) {
      console.log(error);

      dbStore.setError("Fuck!");
    }
  });

  return (
    <SCPost>
      <Show when={!!postData()} fallback={<p>loading...</p>}>
        <div class="head">
          <p class="title">{postData()?.post.title}</p>
          <div class="score">
            <button
              classList={{
                upvote: true,
                active: dbStore
                  .upvoted()
                  .some((post) => post.id === postData()?.post._id),
              }}
              data-type="upvote"
              onClick={handle_vote}
            >
              <IconArrowUp />
              <span>{postData()?.post.upvotes}</span>
            </button>
            <div class="separator"></div>
            <button
              classList={{
                downvote: true,
                active: dbStore
                  .downvoted()
                  .some((post) => post.id === postData()?.post._id),
              }}
              data-type="downvote"
              onClick={handle_vote}
            >
              <span>{postData()?.post.downvotes}</span>
              <IconArrowDown />
            </button>
          </div>
        </div>
        <div class="details">
          <p class="date">{createdAt()}</p>
          <p class="separator">-</p>
          <p class="comment-count">{postData()?.commentCount} comments</p>
        </div>
        <p class="body">{postData()?.post.body}</p>
      </Show>
    </SCPost>
  );
}
