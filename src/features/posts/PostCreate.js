import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Storage, API } from "aws-amplify";
import { createPost } from "../../graphql/mutations";
import { useForm } from "react-hook-form";

// import styled from "styled-components";

export default function CreatePost({ setPosts, posts }) {
  /* 1. Create local state with useState hook */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [mediaName, setMediaName] = useState("");
  const [mediaInfo, setMediaInfo] = useState("");
  // const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [prevImage, setPreviewImage] = useState("");

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
    try {
      const postInfo = { id: uuid(), title, text, media: mediaName };
      await Storage.put(mediaName, mediaInfo, {
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploading(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      const mediaUrl = await Storage.get(mediaName);

      await API.graphql({
        query: createPost,
        variables: { input: postInfo },
        // @ts-ignore
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      console.log(mediaInfo);
      console.log(mediaUrl);
      setPosts([...posts, { ...postInfo, media: mediaUrl }]);
      reset({
        title: "",
        text: "",
      });
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Link to="/posts">
        <button>
          Back to posts list
        </button>
      </Link>
      <div>
        <div>
          <div>
            <p>Title</p>
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
            />

            {errors.code && <p className="error-message">Title is required</p>}
          </div>

          <div>
            <p>Paragraph</p>
            <textarea
              rows={6}
              type="text"
              placeholder="Paragraph"
              {...register("text", { required: true })}
            />

            {errors.code && (
              <p className="error-message">Paragraph is required</p>
            )}
          </div>
          <input type="file" onChange={onChangeFile} />
          {prevImage && <img alt="Uploaded" src={prevImage} />}
          {uploading && <p>{uploading}</p>}
        </div>
        <div>
          {/* <ContentImage alt={post.title} src={post.media} />
           */}
        </div>
      </div>
      <button onClick={handleSubmit(savePost)}>
        Save post
      </button>
    </div>
  );
}
