"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Button,
  Typography,
  CardMedia,
  CardContent,
  Card,
  CardActionArea,
  CardActions,
} from "@mui/material";
import ABI from "./../../../Asserts/ABI.json";
export default function page() {

  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");
  const contractAddress = "0xDCe6C52Ad8FCDCFe32830Fe66074f645B3d260c4";

  const getloggedInUser = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
    const result = await writeFunction.loggedInUserName();
    setLoggedInUser(result);
  };
  const handleLikeProfile = async frnd =>{
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.HandleLike(frnd);
    } catch (error) {
      console.log(error)
    }
  }
  const setCommited = async()=>{
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.setCommited();
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
  const getUser = async () => {
    const use = JSON.parse(localStorage.getItem("friend"));
    console.log(use.user || use.loggedInUser)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.users(use.user || use.loggedInUser, 0);
      var User = {
        name: result[0],
        age: parseInt(result[1]),
        gender: result[2],
        profilePic: result[3],
        relationShipStatus: result[5],
        likes: parseInt(result[6]),
      };
      console.log(User)
      setUser(User);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
    getloggedInUser();
  }, []);
  return (
    <div>
      <>
        {user ? (
          <Card sx={{ width: "100%" }}>
            <CardActionArea
              style={{
                display: "grid",
                gap: "50px",
                gridTemplateColumns: "3fr 3fr",
              }}
            >
              {user.profilePic !== "" ? (
                <CardMedia
                  component="img"
                  style={{ margin: "0 auto" }}
                  height="550px"
                  width="30%"
                  image={user.profilePic}
                  alt="green iguana"
                />
              ) : (
                <Typography gutterBottom variant="h3" component="div">
                  This is a test account
                </Typography>
              )}
              <CardContent style={{ marginTop: "-20px" }}>
                <Typography gutterBottom variant="h3" component="div">
                  Profile Details
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  Name : {user.name}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  Age : {user.age}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  Gender : {user.gender}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  relationship status :{" "}
                  {user.relationShipStatus ? "Committed" : "Single"}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  Profile Likes : {user.likes}
                </Typography>
                {loggedInUser === user.name ? (
                  <Button onClick={setCommited} style={{ marginRight: "20px" }} variant="outlined">
                    change relationship status
                  </Button>
                ) : (
                  ""
                )}
                {loggedInUser !== user.name ? (
                  <Button onClick={()=>handleLikeProfile(user.name)} variant="contained">Like Profile</Button>
                ) : (
                  ""
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ) : (
          <div style={{ margin: "0 auto" }}>
            <Typography gutterBottom variant="h1" component="div">
              Loading...
            </Typography>
          </div>
        )}
      </>
    </div>
  );
}
