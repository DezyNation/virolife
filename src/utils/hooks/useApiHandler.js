"use client";
import { useToast } from "@chakra-ui/react";
import React from "react";

const useApiHandler = () => {
  const Toast = useToast();
  const handleError = (err, title) => {
    Toast({
      status: "error",
      title: title || "Err occured",
      description:
        err?.response?.data?.message || err?.response?.data || err?.message,
    });
  };

  return {
    handleError
  }
};

export default useApiHandler;
