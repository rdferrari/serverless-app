import React, { useState, useEffect, createContext } from "react";
import Amplify, { Auth, Hub, API, Storage } from "aws-amplify";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
// import styled from "styled-components";

// import query definition
import { listPosts } from "./graphql/queries";

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

  useEffect(() => {
    fetchPosts();
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

  async function fetchPosts() {
    try {
      const postData = await API.graphql({
        query: listPosts,
        variables: { limit: 100 },
      });
      let postsArray = postData.data.listPosts.items;

      // Fetch media
      postsArray = await Promise.all(
        postsArray.map(async (post) => {
          const mediaKey = await Storage.get(post.media);
          post.media = mediaKey;
          return post;
        })
      );

      setPosts(postsArray);
    } catch (err) {
      console.log({ err });
    }
  }

  return (

    <UserStatusContext.Provider value={user}>
      <Router>

        <Header signOut={signOut} />
        <>
          <Switch>
            <Route
              exact
              path="/"
              component={() => <Home posts={posts} setPosts={setPosts} />}
            />

            <Route
              exact
              path="/posts"
              component={() => <Posts posts={posts} setPosts={setPosts} />}
            />

            <Route
              exact
              path="/post/:id"
              component={() => <PostDetail posts={posts} setPosts={setPosts} />}
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
