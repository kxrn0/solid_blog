import { createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import SCApp from "./App.styled";
import Navbar from "./components/Navbar/Navbar";
import { DBContextProvider } from "./context/db";

type Props = {
  children?: JSX.Element;
};

function App(props: Props) {
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
