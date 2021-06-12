import React from "react";
import { API, Storage } from "aws-amplify";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Post } from "../../models";

// import styled from "styled-components";

const List = ({ posts, user }) => {

  async function removePost(postId) {
    try {
      // method
      const todelete = await DataStore.query(Post, postId);
      DataStore.delete(todelete);

    } catch (err) {
      console.log({ err });
    }
  }

  //     mediaKey = mediaKey.substring(98, mediaKey.indexOf("?"));
  //     await Storage.remove(mediaKey);

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
                {console.log(post.media)}
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
