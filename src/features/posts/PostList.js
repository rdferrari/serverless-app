import React from "react";
import { API, Storage } from "aws-amplify";
import { Link } from "react-router-dom";
import { deletePost } from "../../graphql/mutations";


// import styled from "styled-components";

const List = ({ posts, setPosts, user }) => {

  async function removePost(postId, mediaKey) {
    try {
      // method
      const postToRemove = {
        id: postId,
      };
      await API.graphql({
        query: deletePost,
        variables: { input: postToRemove },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });

      mediaKey = mediaKey.substring(98, mediaKey.indexOf("?"));
      await Storage.remove(mediaKey);

      const updatedPostsState = posts.filter((post) => post.id !== postId);
      setPosts(updatedPostsState);
    } catch (err) {
      console.log({ err });
    }
  }

  return (
    <div>
      {!posts ? (
        <p>loading...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            <>
              <>
                <h2>{post.title}</h2>

                <p>{post.text}</p>
                {user !== "no user authenticated" && (
                  <>
                    <Link to={`/post/${post.id}`}>
                      <button>| Edit |</button>
                    </Link>
                    <button onClick={() => removePost(post.id, post.media)}>
                      | delete |
                    </button>
                  </>
                )}
              </>
              <div>

                <img alt={post.title} src={post.media} />
              </div>
            </>
          </div>
        ))
      )}
    </div>
  );
};

export default List;
