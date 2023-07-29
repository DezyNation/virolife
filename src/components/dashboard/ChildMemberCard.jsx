"use client";
import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import React from "react";

const ChildMemberCard = ({name, id, phone_number}) => {
  return (
    <>
      <HStack
        py={4}
        w={["full", "xs"]}
        justifyContent={"space-between"}
      >
        <HStack>
          <Avatar name={name} />
          <Box>
            <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
              {name}
            </Text>
            <Text fontSize={"xs"}>
              ID: {process.env.NEXT_PUBLIC_CODE}
              {id} &nbsp; | &nbsp; Phone: {phone_number}
            </Text>
          </Box>
        </HStack>
      </HStack>
    </>
  );
};

export default ChildMemberCard;
