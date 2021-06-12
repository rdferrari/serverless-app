import React, { useState } from "react";
import PostList from "../features/posts/PostList";
import CreatePost from "../features/posts/PostCreate";
import { UserStatusContext } from "../App";

// import styled from "styled-components";


function Posts({ posts, setPosts }) {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          {showCreatePost ? (
            user !== "no user authenticated" && (
              <>
                <CreatePost posts={posts} />
              </>
            )
          ) : (
            <PostList posts={posts} setPosts={setPosts} user={user} />

          )}
          {user !== "no user authenticated" && (
            <button onClick={() => setShowCreatePost(!showCreatePost)}>
              {showCreatePost ? `Posts List` : "New Post"}
            </button>
          )}
        </>
      )}
    </UserStatusContext.Consumer>
  );
}

export default Posts;
