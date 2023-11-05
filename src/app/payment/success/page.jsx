"use client";
import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <HStack p={4} alignItems={"center"} justifyContent={"center"} w={"full"}>
        <Text fontSize={"2xl"} fontWeight={"semibold"} color={"whatsapp.500"}>
          Payment Successful!
        </Text>
      </HStack>
      <br />
      <VStack w={"full"} justifyContent={"center"} alignItems={"center"} p={4}>
        <Image src="/success.png" w={"2xl"} objectFit={"contain"} />
      </VStack>
      <br />
      <Text textAlign={"center"}>
        Your payment was successful. You can now go back to homepage.
      </Text>
      <HStack justifyContent={'center'} p={4}>
        <Link href={"/"}>
          <Button rounded={"full"}>Return Back</Button>
        </Link>
      </HStack>
    </>
  );
};

export default page;
