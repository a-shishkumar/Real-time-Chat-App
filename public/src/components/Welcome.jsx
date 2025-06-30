import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import Logout from "./Logout";

function Welcome({ currentUser }) {
  const [userName, setUserName] = useState("");

  return (
    <Container>
      <div className="logoutBtn">
        <Logout />
      </div>

      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

export default Welcome;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  .logoutBtn {
    position: relative;
    top: 0;
    right: 0;
    margin: 1rem;
  }
`;
