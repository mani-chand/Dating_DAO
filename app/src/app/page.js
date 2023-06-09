"use client";
import Styles from "./Styles.css";
import React, { useState,useEffect } from "react";
import { create } from "ipfs-http-client";
import { Box, Button, Typography, TextField } from "@mui/material/";
import ABI from './../../Asserts/ABI.json'
import {ethers } from "ethers";
export default function Home() {
  const contractAddress = "0xDCe6C52Ad8FCDCFe32830Fe66074f645B3d260c4";
  const [provider, setProvider] = useState(null);
  const projectId = "2PxAxJftpMxj8bKkl8oDvZ4kII2";
  const projectSecretKey = "0b115116f44285db872c632d0ebd2672";
  const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
  const client = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: { authorization },
  });
  const [isSubmit,setIsSubmit] = useState(false)
  const [data, setData] = useState({});

  const connectToMetaMask = async () => {
    try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", [0]);
    setProvider(provider);
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(()=>{
    const isAuth = JSON.parse(localStorage.getItem("isAuth"))
    console.log(isAuth)
    if(isAuth==true){
      window.location.replace('/friends')
    }else{}
  },[])
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(data.file.type==="image/jpeg" && (data.gender==="male" || data.gender==="female") && (parseInt(data.age)>0)){
      try {
        setIsSubmit(true)
        console.log(provider)
        const signer = await provider.getSigner();
        console.log(signer)
        const added = await client.add(data.file);
        var url = `https://manichand.infura-ipfs.io/ipfs/${added.path}`;
        console.log(url)
        const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
        const result = await writeFunction.createUser(data.username,data.age,data.gender,url,data.password)
        window.location.replace('/login')
        console.log(result,url)
        setIsSubmit(false)
      } catch (error) {}
    }
    else{
      console.log("something went wrong")
    }
  };

  useEffect(() => {
    if (!provider) {
      connectToMetaMask();
    }
  }, [provider]);

  return (
    <>
      <Box m={5}>
        <form onSubmit={handleSubmit}>
          <TextField
            onChange={(e) => {
              setData({ ...data, username: e.target.value });
            }}
            required
            style={{ marginTop: "7px" }}
            type="text"
            label="username"
            variant="filled"
            fullWidth
          />
          <TextField
            onChange={(e) => {
              setData({ ...data, age: e.target.value });
            }}
            required
            style={{ marginTop: "7px" }}
            type="text"
            label="age"
            variant="filled"
            fullWidth
          />
          <TextField
            onChange={(e) => {
              setData({ ...data, gender: e.target.value });
            }}
            required
            style={{ marginTop: "7px" }}
            type="text"
            label="gender"
            variant="filled"
            fullWidth
          />
          <TextField
            onChange={(e) => {
              setData({ ...data, password: e.target.value });
            }}
            required
            style={{ marginTop: "7px" }}
            type="password"
            label="password"
            variant="filled"
            fullWidth
          />
          <div style={{ display: "flex", margin: "7px" }}>
            <Typography
              style={{ marginTop: "7px" }}
              fontSize={20}
              variant="subtitle2"
              gutterBottom
            >
              Profile Picture :
            </Typography>
            <TextField
              onChange={(e) => {
                setData({ ...data, file: e.target.files[0] });
              }}
              required
              accept="image/*"
              type="file"
            />
          </div>
          <Button
            style={{ marginTop: "7px" }}
            type="submit"
            fullWidth
            variant="contained"
            disabled = {isSubmit}
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
}
