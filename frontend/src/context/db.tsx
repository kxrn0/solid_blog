import {
  Accessor,
  createContext,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import verify_token from "../utilities/verify_token";

const DBContext = createContext();

type ContextPostType = {
  id: string;
};

type DBStoreType = {
  db: Accessor<IDBDatabase>;
  error: Accessor<string>;
  setError: (message: string) => void;
  token: Accessor<string>;
  setToken: (token: string) => void;
  upvoted: Accessor<ContextPostType[]>;
  setUpvoted: (upvoted: ContextPostType[]) => void;
  downvoted: Accessor<ContextPostType[]>;
  setDownvoted: (downvoted: ContextPostType[]) => void;
};

type Props = {
  children: JSX.Element;
};

export function DBContextProvider(props: Props) {
  const [db, setDB] = createSignal<null | IDBDatabase>(null);
  const [error, setError] = createSignal("");
  const [token, setToken] = createSignal("");
  const [upvoted, setUpvoted] = createSignal<ContextPostType[]>([]);
  const [downvoted, setDownvoted] = createSignal<ContextPostType[]>([]);
  const store = {
    db,
    error,
    setError,
    token,
    setToken,
    upvoted,
    setUpvoted,
    downvoted,
    setDownvoted,
  };

  function set_token(token: string) {
    const transaction = db()?.transaction("token_store", "readwrite");

    if (!transaction) return;
  }

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

        if (value) verify_token(token(), setToken, setError);
      });

      upvoteRequest.addEventListener("success", () =>
        setUpvoted(upvoteRequest.result)
      );

      downvoteRequest.addEventListener("success", () =>
        setDownvoted(downvoteRequest.result)
      );

      transaction.addEventListener("error", () =>
        setError("Transaction failed!")
      );
    });

    request.addEventListener("error", () =>
      setError("Failed to open database!")
    );

    request.addEventListener("upgradeneeded", () => {
      const db = request.result;

      db.createObjectStore("token_store", { keyPath: "id" });
      db.createObjectStore("upvote_store", { keyPath: "id" });
      db.createObjectStore("downvote_store", { keyPath: "id" });
    });
  });

  return (
    <DBContext.Provider value={store}>{props.children}</DBContext.Provider>
  );
}

export function useDBContext() {
  return useContext(DBContext) as DBStoreType;
}
