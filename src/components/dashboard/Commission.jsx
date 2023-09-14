"use client";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsCurrencyRupee } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";

const Commission = ({onClick, commission}) => {

  return (
    <>
      <HStack gap={6} alignItems={"center"} w={'full'} justifyContent={'flex-end'}>
        <IconButton
          icon={<FiRefreshCw size={20} />}
          rounded={"full"}
          onClick={onClick}
        />
        <HStack rounded={"full"} gap={0} bgColor={"gray.50"}>
          <IconButton
            bgColor={"yellow.500"}
            color={"#FFF"}
            icon={<BsCurrencyRupee size={20} />}
            rounded={"full"}
          />
          <Box p={2}>
            <Text fontSize={"8"}>Commission</Text>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              {commission}
            </Text>
          </Box>
        </HStack>
      </HStack>
    </>
  );
};

export default Commission;
