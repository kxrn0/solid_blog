import { useNavigate } from "@solidjs/router";
import { useDBContext } from "../../context/db.tsx";
import { baseUrl } from "../../data.ts";
import SCAuth from "./Auth.styled.tsx";
import { createSignal, Show } from "solid-js";

export default function Auth() {
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const dbStore = useDBContext();

  async function handle_submit(
    event: Event & {
      submitter: HTMLElement;
    } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = (formData.get("name") as string).trim();
    const password = (formData.get("password") as string).trim();

    if (!name || !password) {
      form.reset();

      return setError("prease don't leave any field empty!");
    }

    const body = JSON.stringify({ name, password });

    try {
      const response = await fetch(`${baseUrl}/api/auth/log_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const json = await response.json();

      console.log(json);

      if (json.token) {
        dbStore.set_token(json.token);
        navigate("/solid_blog/?isHome=true&page=1", { replace: true });
      } else setError(json.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SCAuth onSubmit={handle_submit}>
      <Show when={error()}>
        <p class="error">{error()}</p>
      </Show>
      <label>
        <span>Name</span>
        <input type="text" name="name" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="password" />
      </label>
      <button>Submit</button>
    </SCAuth>
  );
}
