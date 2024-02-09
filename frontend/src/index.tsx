/* @refresh reload */
import { render } from "solid-js/web";
import "reset-css";
import "./index.css";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import HomeLikeAppliance from "./pages/HomeLikeAppliance/HomeLikeAppliance";
import Post from "./pages/Post/Post";
import Auth from "./pages/Auth/Auth";
import NewPost from "./pages/NewPost/NewPost";

const root = document.getElementById("root");

render(
  () => (
    <Router root={App}>
      <Route path="/solid_blog" component={HomeLikeAppliance} />
      <Route path="/solid_blog/drafts" component={HomeLikeAppliance} />
      <Route path="/solid_blog/posts/:postId" component={Post} />
      <Route path="/solid_blog/log_in" component={Auth} />
      <Route path="/solid_blog/new" component={NewPost} />
      <Route path="/solid_blog/*" component={() => <p>404</p>} />
    </Router>
  ),
  root!
);
