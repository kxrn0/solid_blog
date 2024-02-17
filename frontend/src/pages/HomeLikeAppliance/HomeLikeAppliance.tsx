import { useMatch, useSearchParams } from "@solidjs/router";
import SCHomeLikeAppliance from "./HomeLikeAppliance.styled.tsx";
import { For, Index, createEffect, createSignal } from "solid-js";
import { baseUrl } from "../../data.ts";
import get_indices from "../../utilities/get_indices.ts";
import { PostType, VoteType } from "../../types.ts";
import HomePost from "../../components/HomePost/HomePost.tsx";

export default function HomeLikeAppliance() {
  const isHome = useMatch(() => "/solid_blog/");
  const [params] = useSearchParams();
  const [posts, setPosts] = createSignal<PostType[]>([]);
  const [indices, setIndices] = createSignal<number[]>([]);

  function update_score(
    postId: string,
    type: VoteType,
    isInUpvotes: boolean,
    isInDownvotes: boolean
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

    if (isInUpvotes || isInDownvotes) {
      const isOfSameType =
        (isInUpvotes && type === "upvote") ||
        (isInDownvotes && type === "downvote");

      if (isOfSameType) {
        setPosts((posts) =>
          posts.map((post) =>
            post._id === postId
              ? update_post(post, type, (a, b) => a - b)
              : post
          )
        );
      } else {
        setPosts((posts) =>
          posts.map((post) =>
            post._id === postId
              ? (() => {
                  const add: keyof PostType = `${type}s`;
                  const remove: keyof PostType = `${
                    type === "upvote" ? "downvote" : "upvote"
                  }s`;
                  const update = {
                    [add]: Number(post[add]) + 1,
                    [remove]: Number(post[remove]) - 1,
                  };

                  return { ...post, ...update };
                })()
              : post
          )
        );
      }
    } else {
      setPosts((posts) =>
        posts.map((post) =>
          post._id === postId ? update_post(post, type, (a, b) => a + b) : post
        )
      );
    }
  }

  createEffect(async () => {
    try {
      const page = Number(params.page) || 1;
      const response = await fetch(
        `${baseUrl}/api/posts?isHome=${params.isHome ?? 1}&page=${page}`,
        {}
      );
      const json = await response.json();

      setIndices(get_indices(json.totalPages, 3, page));
      setPosts(json.posts);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <SCHomeLikeAppliance>
      <div class="posts">
        <For each={posts()}>
          {(post) => <HomePost post={post} update_score={update_score} />}
        </For>
      </div>
      <div class="indices">
        <Index each={indices()}>
          {(index) => (
            <a href={`/solid_blog/?isHome=${!!isHome()}&page=${index()}`}>
              {index()}
            </a>
          )}
        </Index>
      </div>
    </SCHomeLikeAppliance>
  );
}
