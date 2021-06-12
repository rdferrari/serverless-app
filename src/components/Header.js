import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserStatusContext } from "../App";
// import styled from "styled-components";


function Header({ signOut }) {
  const [installPromptEvent, setInstallPromptEvent] = useState();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };
    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
  }, []);

  const handleInstallPwa = () => {
    installPromptEvent.prompt();

    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
    });
  };

  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          <>
            <>
              <Link to="/">
                <button onClick={() => setShowMenu(!showMenu)}>Home</button>
              </Link>
              <Link to="/posts">
                <button onClick={() => setShowMenu(!showMenu)}>Posts</button>
              </Link>
              {user === "no user authenticated" ? (
                <Link to="/auth">
                  <button onClick={() => setShowMenu(!showMenu)}>Sign in</button>
                </Link>
              ) : (
                <button onClick={signOut}>Sign out</button>
              )}
              {installPromptEvent && (
                <button onClick={handleInstallPwa}>Install</button>
              )}
            </>
          </>
        </>
      )}
    </UserStatusContext.Consumer>
  );


}

export default Header;
