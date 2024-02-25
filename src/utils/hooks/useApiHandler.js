"use client";
import { useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import BackendAxios from "../axios";
import useAuth from "./useAuth";

const useApiHandler = () => {
  const Toast = useToast();
  const [points, setPoints] = useState({
    atpPoints: 0,
    healthPoints: 0,
    adPoints: 0,
  });
  const { fetchMyInfo } = useAuth();

  const handleError = (err, title, duration) => {
    Toast({
      status: "error",
      title: title || "Err occured",
      duration: duration || 5000,
      isClosable: true,
      description:
        err?.response?.data?.message || err?.response?.data || err?.message,
    });
  };

  async function refreshPoints() {
    await fetchMyInfo();

    await BackendAxios.get(`/api/user/points/my-atp`)
      .then(async (res) => {
        await BackendAxios.get(`/api/my-health-points`).then((result) => {
          setPoints({
            ...points,
            atpPoints: res.data,
            adPoints: Cookies.get("adPoints"),
            healthPoints: result.data,
          });
        });
      })
      .catch((err) => {
        handleError(err, "Err while fetching ATP");
      });
  }

  useEffect(() => {
    localStorage.setItem("atpPoints", points.atpPoints);
    localStorage.setItem("healthPoints", points.healthPoints);
    localStorage.setItem("adPoints", points.adPoints);
  }, [points.atpPoints, points.healthPoints, points.adPoints]);

  return {
    handleError,
    refreshPoints,
  };
};

export default useApiHandler;
