"use client";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
} from "@chakra-ui/react";
import React from "react";

const MyParents = () => {
  const parentUsers = [
    { name: "Sangam Kumar", id: `2` },
    { name: "Rishi Kumar", id: `3` },
    { name: "Sagar", id: `4` },
    { name: "Sangam Kumar", id: `2` },
    { name: "Rishi Kumar", id: `3` },
    { name: "Sagar", id: `4` },
    { name: "Sangam Kumar", id: `2` },
    { name: "Rishi Kumar", id: `3` },
    { name: "Ujjwal", id: `3` },
    { name: "Sagar", id: `4` },
  ];

  return (
    <>
      <Box>
        {parentUsers.map((item, key) => (
          <HStack py={4} key={key} w={["full", "xs"]} justifyContent={'space-between'}>
            <HStack>
              <Avatar name={item?.name} />
              <Box>
                <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
                  {item?.name}
                </Text>
                <Text fontSize={"xs"}>ID: {item?.id}</Text>
              </Box>
            </HStack>
            <Button size={"xs"} colorScheme="yellow">
              Donate
            </Button>
          </HStack>
        ))}
      </Box>
    </>
  );
};

const MyChildren = () => {
  const childUsers = [
    { name: "Sangam Kumar", id: `2` },
    { name: "Rishi Kumar", id: `3` },
    { name: "Sagar", id: `4` },
    { name: "Sangam Kumar", id: `2` },
  ];

  return (
    <>
      <Box>
        {childUsers.map((item, key) => (
          <HStack py={4} key={key} w={["full", "xs"]} justifyContent={'space-between'}>
          <HStack>
            <Avatar name={item?.name} />
            <Box>
              <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
                {item?.name}
              </Text>
              <Text fontSize={"xs"}>ID: {item?.id}</Text>
            </Box>
          </HStack>
          <Button size={"xs"}>
            View Group
          </Button>
        </HStack>
        ))}
      </Box>
    </>
  );
};

const Page = () => {
  return (
    <>
      <HStack justifyContent={"space-between"}>
        <Text className="serif" fontSize={"2xl"}>
          Group Funding
        </Text>
        <HStack>
          <Button colorScheme="yellow" rounded={"full"}>
            Join Group
          </Button>
          <Button rounded={"full"}>Invite To Your Group</Button>
        </HStack>
      </HStack>
      <br />
      <br />
      <Box>
        <Stack
          direction={["column", "row"]}
          justifyContent={"space-around"}
          gap={16}
        >
          <Box>
            <Text fontSize={"xl"}>My Seniors</Text>
            <br />
            <MyParents />
          </Box>
          <Box>
            <Text fontSize={"xl"}>My Juniors</Text>
            <br />
            <MyChildren />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default Page;
