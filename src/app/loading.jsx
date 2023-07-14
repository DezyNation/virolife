"use client";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import React from "react";

const loading = () => {
  return (
    <>
      <VStack
        w={"full"}
        h={"90vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text fontSize={'lg'} fontWeight={'semibold'} pb={4}>Loading...</Text>
        <Spinner size={'lg'} />
      </VStack>
    </>
  );
};

export default loading;
