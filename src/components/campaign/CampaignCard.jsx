"use client";
import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { BsHeartFill } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";

const CampaignCard = (props) => {
  return (
    <>
      <Box w={["full", "sm"]} pos={"relative"}>
        <Link href={props.link || "#"}>
          <Image
            src={props.coverImage}
            h={[40, 56]}
            rounded={16}
            w={"full"}
            mb={4}
            transition={"all .3s ease"}
            _hover={{ boxShadow: "xl" }}
            objectFit={"contain"}
          />
          {props?.category ? (
            <Text
              p={1}
              roundedStart={8}
              bgGradient={"linear(to-br, twitter.700, twitter.500)"}
              color={"#FFF"}
              pos={"absolute"}
              top={4}
              right={0}
              fontSize={"xs"}
            >
              {props.category}
            </Text>
          ) : null}
          <Text
            fontSize={["md", "lg", "xl"]}
            textTransform={"capitalize"}
            fontWeight={"semibold"}
          >
            {props.title}
          </Text>
          {typeof props?.userName == "object" ? (
            <Box
              fontSize={["xs", "sm", "md"]}
              fontWeight={"medium"}
              textTransform={"capitalize"}
            >
              {props.userName}
            </Box>
          ) : (
            <Text
              fontSize={["xs", "sm", "md"]}
              fontWeight={"medium"}
              textTransform={"capitalize"}
            >
              {props.userName}
            </Text>
          )}

          <Text pt={2} fontSize={"12"}>
            {props.description?.slice(0, 60)}...
          </Text>

          {
            <HStack gap={8}>
              {props?.healthPoints ? (
                <Button
                  variant={"ghost"}
                  colorScheme="red"
                  size={"xs"}
                  leftIcon={<BsHeartFill />}
                >
                  {props?.healthPoints} Health Points
                </Button>
              ) : null}
              {props?.withdrawnAmount ? (
                <Button
                  variant={"ghost"}
                  colorScheme="red"
                  size={"xs"}
                  leftIcon={<FaRupeeSign />}
                >
                  {props?.withdrawnAmount} Withdrawn
                </Button>
              ) : null}
            </HStack>
          }
        </Link>
      </Box>
    </>
  );
};

export default CampaignCard;
