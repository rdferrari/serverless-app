import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Storage, API } from "aws-amplify";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Post } from "../../models";
import { updatePost } from "../../graphql/mutations";
import { getPost } from "../../graphql/queries";
import { useForm } from "react-hook-form";

// import styled from "styled-components";

function EditPost({ setPosts, posts, postId }) {
  /* 1. Create local state with useState hook */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [post, setPost] = useState("");
  const [saving, setSaving] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [mediaInfo, setMediaInfo] = useState("");
  const [uploading, setUploading] = useState("");
  const [prevImage, setPreviewImage] = useState("");
  // const [editPost, setEditPost] = useState(false);

  useEffect(() => {
    fetchOnePost();
  }, []);

  function onChangeFile(e) {
    e.persist();
    if (!e.target.files[0]) return;
    const media = {
      fileInfo: e.target.files[0],
      name: `${uuid()}_${e.target.files[0].name}`,
    };
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setMediaName(media.name);
    setMediaInfo(media.fileInfo);
  }

  async function savePost(data) {
    const { title, text } = data;
    setSaving(true);
    try {
      // with media to update
      if (mediaName && mediaInfo) {
        const postInfo = { id: post.id, title, text, media: mediaName };
        await Storage.put(mediaName, mediaInfo, {
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
            setUploading(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        });
        const mediaUrl = await Storage.get(mediaName);

        const updatedPost = await API.graphql({
          query: updatePost,
          variables: { input: postInfo },
          authMode: "AMAZON_COGNITO_USER_POOLS",
        });

        const postUpdated = updatedPost.data.updatePost;

        posts.filter((post) => {
          if (post.id === postId) {
            post.title = postUpdated.title;
            post.text = postUpdated.text;
            post.media = mediaUrl;
            return post;
          }
        });

        setPosts([...posts]);
        setSaving(false);
      }

      // no media to update
      const original = await DataStore.query(Post, postId)
      await DataStore.save(
        Post.copyOf(original, updated => {
          updated.title = title
          updated.text = text
        })
      )


      // const postInfo = { id: post.id, title, text };
      // const updatedPost = await API.graphql({
      //   query: updatePost,
      //   variables: { input: postInfo },
      //   authMode: "AMAZON_COGNITO_USER_POOLS",
      // });

      // const postUpdated = updatedPost.data.updatePost;

      // posts.filter((post) => {
      //   if (post.id === postId) {
      //     post.title = postUpdated.title;
      //     post.text = postUpdated.text;
      //     return post;
      //   }
      // });

      // setPosts([...posts]);
      setSaving(false);
    } catch (err) {
      // error
      console.log(err);
      setSaving(false);
    }
  }

  async function fetchOnePost() {
    try {
      const postFetched = await DataStore.query(Post, postId)
      setPost(postFetched);
    } catch (err) {
      console.log({ err });
    }
  }

  if (!post) return <p>Loading</p>;

  return (
    <div key={post.id}>
      <Link to="/posts">
        <button>
          Back to posts list
        </button>
      </Link>
      <>
        <>
          <div>
            <p>Title</p>
            <input
              type="text"
              placeholder="Title"
              defaultValue={post.title}
              {...register("title", { required: true })}
            />
            {console.log(post)}

            {errors.code && <p className="error-message">Title is required</p>}
          </div>

          <div>
            <p>Post</p>
            <textarea
              rows={6}
              type="text"
              placeholder="Paragraph"
              defaultValue={post.text}
              {...register("text", { required: true })}
            />

            {errors.code && (
              <p className="error-message">Paragraph is required</p>
            )}
          </div>
        </>
        <div>
          <img alt={post.title} src={post.media} />

          <input type="file" onChange={onChangeFile} />
          {prevImage && <img alt="Uploaded" src={prevImage} />}
          {uploading && <p>{uploading}</p>}
        </div>
      </>
      <button onClick={handleSubmit(savePost)}>
        Save post
      </button>
    </div>
  );
}

export default EditPost;
