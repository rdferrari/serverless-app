import React, { useState, useEffect, createContext } from "react";
import Amplify, { Auth, Hub, Storage } from "aws-amplify";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Post } from "./models";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
// import styled from "styled-components";

// import query definition
// import { listPosts } from "./graphql/queries";

// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import PostDetail from "./pages/Post";
import Posts from "./pages/Posts";

// AWS Amplify config
import config from "./aws-exports";
Amplify.configure(config);

// User context
export const UserStatusContext = createContext("");

function App() {
  const [user, setUser] = useState("no user authenticated");
  const [posts, setPosts] = useState([]);
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    getUserData();
    Hub.listen("auth", (data) => {
      const event = data.payload.event;
      switch (event) {
        case "signIn":
          console.log(`user signed in`);
          getUserData();
          break;
        case "signUp":
          console.log(`user signed up`);
          break;
        case "signOut":
          console.log(`user signed out`);
          setUser("no user authenticated");
          break;
        case "signIn_failure":
          console.log(
            "Sign in failed. Please, cheack your username and password."
          );
          break;
        case "configured":
          console.log("the Auth module is configured");
          break;
        default:
          console.log("Users state");
      }
    });
  }, []);



  const getUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      user ? setUser(user.username) : setUser("no user authenticated");
    } catch (err) {
      console.log({ err });
    }
  };

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  // Datastore

  async function query() {
    try {
      const data = await DataStore.query(Post);
      let dataArr = []

      for (let i = 0; i < data.length; i++) {
        dataArr.push({
          id: data[i].id,
          title: data[i].title,
          text: data[i].text,
          media: ""
        })
      }

      // Fetch media
      if (dataArr) {
        dataArr = await Promise.all(
          dataArr.map(async (post) => {
            const mediaURL = await Storage.get(post.media);
            post.media = mediaURL;
            return post;
          })
        );
      }

      console.log(dataArr)

      setPosts(dataArr);
      // setMedias(dataMedia)
    } catch (err) {
      console.log({ err });
    }
  }

  useEffect(() => {
    query()
  }, []);

  useEffect(() => {
    const subscription = DataStore.observe(Post).subscribe(() => query());

    return () => subscription.unsubscribe();
  }, [posts]);

  return (

    <UserStatusContext.Provider value={user}>
      <Router>

        <Header signOut={signOut} />
        <>
          <Switch>
            <Route
              exact
              path="/"
              component={() => <Home medias={medias} posts={posts} setPosts={setPosts} />}
            />

            <Route
              exact
              path="/posts"
              component={() => <Posts medias={medias} posts={posts} setPosts={setPosts} />}
            />

            <Route
              exact
              path="/post/:id"
              component={() => <PostDetail medias={medias} posts={posts} setPosts={setPosts} />}
            />

            {user === "no user authenticated" ? (
              <>
                <Route path="/auth" component={AuthPage} />
              </>
            ) : (
              <>
                <Route path="/auth" render={() => <Redirect to="/" />} />
              </>
            )}
          </Switch>
        </>
      </Router>
    </UserStatusContext.Provider>

  );
}

export default App;
