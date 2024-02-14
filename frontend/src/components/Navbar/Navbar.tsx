import { Show } from "solid-js";
import { useDBContext } from "../../context/db.tsx";
import SCNavbar from "./Navbar.styled.tsx";
import { useMatch, useNavigate } from "@solidjs/router";

export default function Navbar() {
  const dbStore = useDBContext();
  const isHome = useMatch(() => "/solid_blog/");
  const isDrafts = useMatch(() => "/solid_blog/drafts");
  const isNewPost = useMatch(() => "/solid_blog/new");
  const isLogIn = useMatch(() => "/solid_blog/log_in");
  const navigate = useNavigate();

  function handle_log_out(
    event: MouseEvent & {
      currentTarget: HTMLAnchorElement;
      target: Element;
    }
  ) {
    event.preventDefault();

    console.log("logging out!");

    dbStore.set_token("");
    dbStore.setError("");

    navigate("/solid_blog/?isHome=true&page=1&byme=sxarp");
  }

  return (
    <SCNavbar>
      <div class="logo">
        <p>blog</p>
      </div>
      <div class="container">
        <Show when={!isHome()}>
          <a href="/solid_blog?isHome=true&page=1">Home</a>
        </Show>
        <Show
          when={dbStore.token()}
          fallback={
            <Show when={!isLogIn()}>
              <a href="/solid_blog/log_in">Log In</a>
            </Show>
          }
        >
          <Show when={!isDrafts()}>
            <a href="/solid_blog/drafts">Drafts</a>
          </Show>
          <Show when={!isNewPost()}>
            <a href="/solid_blog/new">New Post</a>
          </Show>
          <a href="/log_out" onClick={handle_log_out}>
            Log Out
          </a>
        </Show>
      </div>
    </SCNavbar>
  );
}
