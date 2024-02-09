import { onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import SCApp from "./App.styled";
import Navbar from "./components/Navbar/Navbar";
import { DBContextProvider } from "./context/db";
import { useMatch, useSearchParams } from "@solidjs/router";

type Props = {
  children?: JSX.Element;
};

function App(props: Props) {
  const isHome = useMatch(() => "/solid_blog/");
  const [params, setParams] = useSearchParams();

  onMount(() => {
    if (!params.page || !params.isHome)
      setParams({ isHome: !!isHome(), page: 1 });
  });

  return (
    <SCApp>
      <DBContextProvider>
        <Navbar></Navbar>
        {props.children}
      </DBContextProvider>
    </SCApp>
  );
}

export default App;
