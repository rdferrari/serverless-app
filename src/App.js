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

const tokenTest = "eyJ2ZXJzaW9uIjoyLCJ0b2tlbiI6IkFRSUNBSGcxTUkwMVp2VjlkTHF1STdtTkkvN2Nocm1GbStXSjNMM2NHLzAyamNqMGRRSCtjZUpoWXFTTmtrQnBzdXJweHpMN0FBQUNIakNDQWhvR0NTcUdTSWIzRFFFSEJxQ0NBZ3N3Z2dJSEFnRUFNSUlDQUFZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF4ZHh3enEwUVJpd0Y4THZPZ0NBUkNBZ2dIUmNhSk1pbDBJV1J6U2c2V1ljb0svZm9GS3ZXbVRFZzNmZVpheDB4aTRhY2pBUVVvQ01Bb056UU1rMnpTWEVkOTFWeHhHM0hXSTVZODViTXJYSDBCdVRKZWhHMUhWK0RlS1N4RnZBbjhxMTNlT0JpYjd2WlQ5dmZwRWFoYUlVZnVCdmNHMWtieXlMRWFmRDZFR3BJcjBzVlNNbE45OXIzdWZqS1JoL2cyMURtQ3owZCtDNDI3emxKNVlZcWVmVjVGUEhSUFllVEloY0Qrd25aVVc1djBCVXdUbWFJNFNQMnlnQmtLYklJeXF2bjBHM1VqZWhma1RvTVJoNkNYVHBQMmxQT0ZxTW93bG0wWkhxOHlCV0VFTU9FUTZ4RE8xd2M4dkFHckhFbzlWTXYyN3JmTWpNMk5uNHdXRUk2cWJYRFZ0dDF3MnJCb2dkZUJ2QytUSDltOXVsNzllcFB3ZEhqUCs1ZVFaaGJYU3VnZ2p3WWJLNnFwZXJvN2VRS2ZQdyt4RFVvWU9aNjIxa2E3dldXbzFIYzVkSHpHSEV6SElJbDFVOUtSV0dEZWNabzlEcUJPakJFR1oyL3M4NmZRb0JTdVBUaVRKSncybyt3cktMcXRuVGFRTVpSaTlvWlNJWGh6cEpmeUoyc3BSZk0rTi9FYlhhQ21rWDFXdEROSWRpYTdkczlZalI1Ly84QzV5anZlWjZxdjB3NG13SDJFNHJkSno2dHdiNUl0aFE0MHVsdjVYZ2k5ckp1Qmw4TWdxZXRJVWhQL0FzS1plWUt5UnFlNmhhNVYra2ZnUXJxK1FJMWFZOU5qd0R2TmorTDI2In0="

function App() {
  const [user, setUser] = useState("no user authenticated");
  const [posts, setPosts] = useState([]);

  const [nextToken, setNextToken] = useState(undefined)
  const [nextNextToken, setNextNextToken] = useState()
  const [previousTokens, setPreviousTokens] = useState([])

  const hasNext = !!nextNextToken
  const hasPrev = previousTokens.length
  const limit = 2

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

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  useEffect(() => {
    const fetch = async () => {
      // setIsLoading(true)
      try {
        const variables = {
          nextToken,
          limit,
        }
        const postData = await API.graphql({
          query: listPosts,
          variables
        });
        let postsArray = postData.data.listPosts.items;
        let nextNextToken = postData.data.listPosts.nextToken

        postsArray = await Promise.all(
          postsArray.map(async (post) => {
            const mediaKey = await Storage.get(post.media);
            post.media = mediaKey;
            return post;
          })
        );

        setNextNextToken(nextNextToken)
        setPosts(postsArray);
      } catch (err) {
        console.log(err)
      } finally {
        // setIsLoading(false)
      }
    }

    fetch()
  }, [nextToken])

  const next = () => {
    setPreviousTokens((prev) => [...prev, nextToken])
    setNextToken(nextNextToken)
    setNextNextToken(null)
  }

  const prev = () => {
    setNextToken(previousTokens.pop())
    setPreviousTokens([...previousTokens])
    setNextNextToken(null)
  }

  const reset = () => {
    setNextToken(undefined)
    setPreviousTokens([])
    setNextNextToken(null)
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
              component={() => <Posts posts={posts} setPosts={setPosts} next={next} prev={prev} reset={reset} />}
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
