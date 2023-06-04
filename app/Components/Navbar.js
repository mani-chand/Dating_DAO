"use client";
import React,{useState,useEffect} from "react";
import { ethers } from "ethers";
import ABI from './../Asserts/ABI.json'
import { Box, Button, Paper, Typography } from "@mui/material/";
export default function Navbar() {
  const contractAddress = "0xDCe6C52Ad8FCDCFe32830Fe66074f645B3d260c4";
  const [provider, setProvider] = useState(null);
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const connectToMetaMask = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", [0]);
      setProvider(provider);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout=()=>{}
  const checkIsLoggedIn = async() => {
    try {
        const signer = await provider.getSigner();
        const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
        const result = await writeFunction.isLoggedIn()
        setIsLoggedIn(result)
        localStorage.setItem("isAuth",JSON.stringify(result))
        console.log(result)
    } catch (err) {
       // console.log(err)
    }
  };
  
  useEffect(()=>{
    checkIsLoggedIn()
  },[])
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            height: "auto",
          },
        }}
      >
        <Paper
          elevation={3}
          style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr" }}
        >
          <Typography style={{padding:"0px 10px"}} variant="h3" gutterBottom>
            Dating app
          </Typography>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Button href="/login" size="large" variant="text">
              Login
            </Button>
            <Button href="/" size="large" variant="text">
              create an account
            </Button>
            <Button onClick={connectToMetaMask} size="large" variant="text">
              connect to wallet
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
