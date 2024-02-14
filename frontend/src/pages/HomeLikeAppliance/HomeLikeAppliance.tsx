import { useMatch, useSearchParams } from "@solidjs/router";
import SCHomeLikeAppliance from "./HomeLikeAppliance.styled.tsx";
import { For, Index, createEffect, createSignal } from "solid-js";
import { baseUrl } from "../../data.ts";
import get_indices from "../../utilities/get_indices.ts";
import { PostType } from "../../types.ts";
import HomePost from "../../components/HomePost/HomePost.tsx";
import { useDBContext } from "../../context/db.tsx";
import { VoteType } from "../../types.ts";

export default function HomeLikeAppliance() {
  const isHome = useMatch(() => "/solid_blog/");
  const [params] = useSearchParams();
  const [posts, setPosts] = createSignal<PostType[]>([]);
  const [indices, setIndices] = createSignal<number[]>([]);
  const dbStore = useDBContext();

  function update_score(postId: string, type: VoteType, value: number) {
    const post = posts().find((post) => post._id === postId);

    if (!post) return;

    const newPost = { ...post };

    if (type === "upvote") newPost.upvotes += value;
    else newPost.downvotes += value;

    setPosts((prev) =>
      prev.map((post) => (post._id === postId ? newPost : post))
    );
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
      <button
        onclick={() =>
          console.log({ up: dbStore.upvoted(), down: dbStore.downvoted() })
        }
      >
        stuff
      </button>
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
