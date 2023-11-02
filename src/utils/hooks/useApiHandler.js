"use client";
import { useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useState } from "react";
import BackendAxios from "../axios";

const useApiHandler = () => {
  const Toast = useToast();
  const [points, setPoints] = useState(null);
  const { fetchMyInfo } = useAuth();

  const handleError = (err, title) => {
    Toast({
      status: "error",
      title: title || "Err occured",
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
            atpPoints: res.data,
            adPoints: Cookies.get("adPoints"),
            healthPoints: result.data,
          });
        });
      })
      .catch((err) => {
        handleError(err, "Err while fetching ATP");
      });
    setLoading(false);
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
