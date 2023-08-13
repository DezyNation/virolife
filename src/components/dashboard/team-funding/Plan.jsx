"use client";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Plan = ({
  bgColor,
  color = "#FFF",
  title,
  price,
  description,
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false)
    }, 2000);
  }
  return (
    <>
      <Box
        w={["full", "xs"]}
        bgColor={"#FFF"}
        border={"1px"}
        borderColor={"gray.200"}
        boxShadow={"md"}
      >
        <VStack p={4} bgColor={bgColor}>
          <Text
            color={color}
            textAlign={"center"}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            fontSize={"2xl"}
          >
            {title}
          </Text>
          <Text
            color={color}
            textAlign={"center"}
            fontSize={"sm"}
            fontWeight={"semibold"}
          >
            Joining Fees ₹{price}
          </Text>
        </VStack>
        <Box >
          <Table size={'sm'}>
            <Tbody>
              {description?.map((content, key) => (
                <Tr key={key}>
                  <Td py={2} fontSize={'xs'}>{content}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box p={4}>
          <Button
            w={"full"}
            bgColor={bgColor}
            _hover={{ bgColor: bgColor }}
            color={color}
            isLoading={isLoading}
            onClick={handleClick}
          >
            Join with ₹{price}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Plan;
