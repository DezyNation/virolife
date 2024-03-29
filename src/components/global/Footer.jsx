"use client";
import React from "react";
import {
  Box,
  HStack,
  Image,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTelephoneFill,
  BsTwitter,
} from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import Link from "next/link";

const Footer = () => {
  return (
    <Box w={"full"} p={4} bgColor={"blanchedalmond"}>
      <Stack direction={["column", "row"]} gap={8}>
        <Box w={"full"} flex={1}>
          <Image src="/logo.png" width={24} />
        </Box>
        <Spacer />
        <VStack
          w={"full"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          gap={2}
          flex={1}
        >
          <Text fontSize={"lg"} className="serif" fontWeight={"semibold"}>
            Donate Us Here:
          </Text>
          <Text fontWeight={"normal"}>Virolife Foundation</Text>
          <Text fontWeight={"normal"}>Bank: Axis Bank</Text>
          <Text fontWeight={"normal"}>Acc. No. 921010011035436</Text>
          <Text fontWeight={"normal"}>IFSC UTIB0000575</Text>
          <Text fontWeight={"normal"}>Branch: Bhayandar West</Text>
        </VStack>

        <VStack
          w={"full"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          gap={2}
          flex={1}
        >
          <Text fontSize={"lg"} className="serif" fontWeight={"semibold"}>
            Important
          </Text>
          <Link href={"/policy/terms-and-conditions"}>
            <Text fontWeight={"normal"}>Terms & Conditions</Text>
          </Link>
          <Link href={"/policy/privacy-policy"}>
            <Text fontWeight={"normal"}>Privacy Policy</Text>
          </Link>
          <Link href={"/policy/refund-policy"}>
            <Text fontWeight={"normal"}>Refund Policy</Text>
          </Link>
        </VStack>

        <Box flex={1} w={"full"}>
          <HStack w={"full"} p={8} py={2}>
            <GrLocation color="#333" fontSize={36} />
            <Text fontSize={"lg"}>Address</Text>
          </HStack>
          <Box p={8} py={2}>
            <Text fontSize={"sm"}>
              10 sai sneha estate, panchal road, Bhayandar East, Mira Bhayandar,
              Maharashtra 401105
            </Text>
          </Box>
          <HStack p={8} py={2}>
            <BsTelephoneFill color="#333" fontSize={24} />
            <Text fontSize={"lg"}>+91 90228 53554</Text>
          </HStack>
          <HStack p={8} py={8} spacing={8}>
            <BsFacebook color="#333" fontSize={36} cursor={"pointer"} />
            <BsInstagram color="#333" fontSize={36} cursor={"pointer"} />
            <BsTwitter color="#333" fontSize={36} cursor={"pointer"} />
            <BsLinkedin color="#333" fontSize={36} cursor={"pointer"} />
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
