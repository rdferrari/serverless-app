import React from "react";
import { Link } from "react-router-dom";

import { UserStatusContext } from "../App";

// import styled from "styled-components";

function Home() {
  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          <h1>Home</h1>
        </>
      )}
    </UserStatusContext.Consumer>
  );
}

export default Home;
