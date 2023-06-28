"use client";
import { ethers } from "ethers";
import ABI from "./../../../Asserts/ABI.json";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material/";
export default function page(props) {
  const contractAddress = "0xDCe6C52Ad8FCDCFe32830Fe66074f645B3d260c4";
  const [provider, setProvider] = useState(null);
  const [Signer, setSigner] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const getAllUsers = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      //(provider)?console.log("connected"):console.log("connecting")
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.getAllUsers();
      //console.log(result)
      setUsers(result);
    } catch (err) {
      console.log(err);
    }
  };
  const sendFriendReq = async (name) => {
    //console.log(name)
    try {
      setIsSubmit(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.sendFriendRequest(name);
      console.log(result);
      setIsSubmit(false);
      setNotifications(result);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (frnd) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.acceptFriendRequest(frnd);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenProfile = (user, index) => {
    localStorage.setItem("friend", JSON.stringify({ user, index }));
  };
  const getAllNotifications = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.getAllNotifications();
      //console.log(result[0])
      setNotifications(result);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllUsers();
    getAllNotifications();
  });
  useEffect(() => {
    const isAuth = JSON.parse(localStorage.getItem("isAuth"));
    //console.log(isAuth)
    if (isAuth == false) {
      window.location.replace("/login");
    } else {
    }
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignContent: "center",
      }}
    >
      <div>
        <div>
          <Typography gutterBottom variant="h5" component="div">
            Find friends
          </Typography>
        </div>
        {users.map((user, index) => {
          return (
            <Card key={user} sx={{ maxWidth: 345, margin: "2px" }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {user}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleOpenProfile(user, index)}
                  href="/profile"
                  size="medium"
                >
                  Open profile
                </Button>
                <Button
                  disabled={isSubmit}
                  onClick={() => sendFriendReq(user)}
                  size="medium"
                >
                  send friend request
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
      <div>
        <div>
          <Typography gutterBottom variant="h5" component="div">
            Friend Requests
          </Typography>
          <div>
            {notifications.map((notification) => {
              return (
                <>
                  {notification[2] !== "" ? (
                    <Card
                      key={notification[0]}
                      sx={{ minWidth: "600px", margin: "2px" }}
                    >
                      <CardContent>
                        <Typography
                          gutterBottom
                          style={{
                            width: "100%",
                            fontSize: "15px",
                            fontWeight: "bold",
                          }}
                          variant="h6"
                          component="p"
                        >
                          <p>
                            {notification[2]} from {notification[0]}
                          </p>
                        </Typography>
                        <Button
                          onClick={() => acceptFriendRequest(notification[0])}
                          size="small"
                          variant="contained"
                        >
                          Accept
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
