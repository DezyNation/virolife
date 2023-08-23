"use client";
import { CircularProgress, Text, VStack } from "@chakra-ui/react";
import React from "react";

const FullPageLoader = () => {
  return (
    <>
      <VStack
        position={"fixed"}
        top={0}
        left={0}
        w={"full"}
        height={"100vh"}
        alignItems={'center'}
        justifyContent={'center'}
        bgColor={'blackAlpha.700'}
        zIndex={9999}
      >
            <CircularProgress isIndeterminate color={"yellow.500"} />
            <Text color={'#FFF'} textAlign={'center'}>Please Wait</Text>
      </VStack>
    </>
  );
};

export default FullPageLoader;
