import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import multiavatar from "@multiavatar/multiavatar";
import { setAvatarRoute } from "../utils/APIRoutes";

const SetAvatar = () => {
  const navigate = useNavigate();

  // States for avatar list, loading status, and selected avatar index
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  // Toast configuration
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const user = localStorage.getItem("chat-app-user");
    if (!user) {
      navigate("/login"); // ✅ redirect to login if not authenticated
    }
  }, [navigate]);

  // Generate and load 4 random avatars using multiavatar library
  useEffect(() => {
    const fetchAvatars = async () => {
      setIsLoading(true);
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const randomId = Math.floor(Math.random() * 1000);
          const svg = multiavatar(randomId.toString());
          const base64 = Buffer.from(svg).toString("base64");
          data.push(base64);
        }
        setAvatars(data); // Update state with generated avatars
      } catch (error) {
        console.error("Error fetching avatars:", error);
        toast.error("Failed to load avatars", toastOptions);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvatars();
  }, []);

  // Handles setting the selected avatar as the user's profile picture
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-user"));

      try {
        // Send avatar to backend for setting as profile image
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar], // ✅ Corrected: use selectedAvatar, not setSelectedAvatar
        });

        if (data.isSet) {
          // Update localStorage with new user avatar info
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));

          // Redirect to main chat page
          navigate("/");
        } else {
          toast.error("Error setting Avatar. Please try again", toastOptions);
        }
      } catch (error) {
        console.error("Avatar set error:", error);
        toast.error("Server error while setting avatar", toastOptions);
      }
    }
  };

  // Render loading animation or avatar selection UI
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
};

export default SetAvatar;

// Styled components for layout and design
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      cursor: pointer;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }

      &:hover {
        transform: scale(1.1);
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;

    &:hover {
      background-color: #4e0eff;
    }
  }
`;
