"use client";
import { ethers } from "ethers";
import ABI from "./../../../Asserts/ABI.json";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material/";
export default function Login(props) {
  const contractAddress = "0xDCe6C52Ad8FCDCFe32830Fe66074f645B3d260c4";
  const [provider, setProvider] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const connectToMetaMask = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", [0]);
      setProvider(provider);
    } catch (error) {
      console.log(error);
    }
  };
  const [data, setData] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmit(true);
      console.log(provider);
      const signer = await provider.getSigner();
      console.log(signer);
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.logIn(data.username, data.password);
      console.log(result);
      window.location.replace("/friends");
      setIsSubmit(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!provider) {
      connectToMetaMask();
    }
  }, [provider]);

  useEffect(() => {
    const isAuth = JSON.parse(localStorage.getItem("isAuth"));
    console.log(isAuth);
    if (isAuth == true) {
      window.location.replace("/friends");
    } else {
    }
  }, []);

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
              setData({ ...data, password: e.target.value });
            }}
            required
            style={{ marginTop: "7px" }}
            type="password"
            label="password"
            variant="filled"
            fullWidth
          />
          <Button
            style={{ marginTop: "7px" }}
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmit}
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
}
