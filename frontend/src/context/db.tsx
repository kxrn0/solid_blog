import { createContext, createSignal, onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { baseUrl } from "../data";
// import baseUrl from "../"

const DBContext = createContext();

type Props = {
  children: JSX.Element;
};

async function verify_token(token: string, setter: (token: string) => void) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/log_in/verify`);
  } catch (error) {}
}

export function DBContextProvider(props: Props) {
  const [db, setDB] = createSignal<null | IDBDatabase>(null);
  const [error, setError] = createSignal<null | DOMException>(null);
  const [token, setToken] = createSignal("");
  const [upvoted, setUpvoted] = createSignal([]);
  const [downvoted, setDownvoted] = createSignal([]);
  const store = {
    db,
    error,
    setError,
    setDB,
    token,
    setToken,
    upvoted,
    setUpvoted,
    downvoted,
    setDownvoted,
  };

  onMount(() => {
    const request = indexedDB.open("solid_blog_db", 1);

    request.addEventListener("success", () => {
      const db = request.result;

      setDB(db);

      const transaction = db.transaction(
        ["token_store", "upvote_store", "downvote_store"],
        "readonly"
      );
      const tokenStore = transaction.objectStore("token_store");
      const upvoteStore = transaction.objectStore("upvote_store");
      const downvoteStore = transaction.objectStore("downvote_store");
      const tokenRequest = tokenStore.get("token_key");
      const upvoteRequest = upvoteStore.getAll();
      const downvoteRequest = downvoteStore.getAll();

      tokenRequest.addEventListener("success", () => {
        const value = tokenRequest.result?.value;

        if (value) verify_token(token(), setToken);
      });
    });

    request.addEventListener("error", () => setError(request.error));

    request.addEventListener("upgradeneeded", () => {
      const db = request.result;

      db.createObjectStore("token_store", { keyPath: "key" });
      db.createObjectStore("upvote_store", { keyPath: "id" });
      db.createObjectStore("downvote_store", { keyPath: "id" });
    });
  });

  return (
    <DBContext.Provider value={store}>{props.children}</DBContext.Provider>
  );
}
