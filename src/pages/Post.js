import React from "react";
import { useParams } from "react-router-dom";
import { UserStatusContext } from "../App";
import EditPost from "../features/posts//PostEdit";

// import styled from "styled-components";


function Post({ posts, setPosts }) {
  let { id } = useParams();

  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          {user !== "no user authenticated" && (
            <EditPost posts={posts} setPosts={setPosts} postId={id} />
          )}
        </>
      )}
    </UserStatusContext.Consumer>
  );
}

export default Post;
