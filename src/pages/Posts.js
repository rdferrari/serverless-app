import React, { useState } from "react";
import PostList from "../features/posts/PostList";
import CreatePost from "../features/posts/PostCreate";
import { UserStatusContext } from "../App";
import Pagination from "../components/Pagination";

// import styled from "styled-components";


function Posts({ posts, setPosts, next, prev, reset }) {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          {showCreatePost ? (
            user !== "no user authenticated" && (
              <>
                <CreatePost posts={posts} setPosts={setPosts} />
              </>
            )
          ) : (
            <>
              <button onClick={prev}>previous</button>
              <button onClick={next}>next</button>
              <button onClick={reset}>reset</button>
              <PostList posts={posts} setPosts={setPosts} user={user} />
              {/* <Pagination next={next} prev={prev} /> */}

            </>
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
