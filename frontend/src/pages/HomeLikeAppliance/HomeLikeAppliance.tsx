import { useMatch, useSearchParams } from "@solidjs/router";
import SCHomeLikeAppliance from "./HomeLikeAppliance.styled.tsx";
import { useDBContext } from "../../context/db.tsx";
import { For, Index, createEffect, createSignal } from "solid-js";
import { baseUrl } from "../../data.ts";
import get_indices from "../../utilities/get_indices.ts";

export default function HomeLikeAppliance() {
  const isHome = useMatch(() => "/solid_blog/");
  const dbStore = useDBContext();
  const [params] = useSearchParams();
  const [posts, setPosts] = createSignal();
  const [indices, setIndices] = createSignal<number[]>([]);

  createEffect(async () => {
    try {
      console.log(params.page);
      const page = Number(params.page) || 1;
      const response = await fetch(
        `${baseUrl}/api/posts?isHome=${params.isHome ?? 1}&page=${page}`,
        {}
      );
      const json = await response.json();

      setIndices(get_indices(json.totalPages, 3, page));
      setPosts(json.posts);

      console.log(json);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <SCHomeLikeAppliance>
      <div class="posts">
        <For each={posts()}>
          {(post) => (
            <div>
              <p>{post.title}</p>
              <p>{post.body}</p>
            </div>
          )}
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
