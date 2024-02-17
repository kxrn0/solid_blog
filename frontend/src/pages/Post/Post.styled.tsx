import { styled } from "solid-styled-components";

const SCPost = styled("div")`
  .head {
    .score {
      button {
        &.upvote.active {
          background-color: greenyellow;
        }

        &.downvote.active {
          background-color: pink;
        }

        span,
        svg {
          pointer-events: none;
        }
      }
    }
  }
`;

export default SCPost;
