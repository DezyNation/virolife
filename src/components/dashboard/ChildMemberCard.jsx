"use client";
import { Avatar, Box, Button, HStack, Text } from "@chakra-ui/react";
import React from "react";

const ChildMemberCard = ({ name, id, phone_number, donation_received }) => {
  return (
    <>
      <HStack py={4} w={["full", "xs"]} justifyContent={"space-between"}>
        <HStack alignItems={'flex-start'}>
          <Avatar name={name} />
          <Box w={"full"}>
            <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
              {name}
            </Text>
            <Text fontSize={"xs"}>
              ID: {process.env.NEXT_PUBLIC_CODE}
              {id} &nbsp; | &nbsp; Phone: {phone_number}
            </Text>
          </Box>
            {donation_received ? (
              <Button size={"xs"} variant={"ghost"} colorScheme="yellow">
                Donated
              </Button>
            ) : null}
        </HStack>
      </HStack>
    </>
  );
};

export default ChildMemberCard;
