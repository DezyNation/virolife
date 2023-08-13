"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Plan = ({
  id,
  bgColor,
  color = "#FFF",
  title,
  price,
  description,
  subscribedByMe,
  subscribedBySenior,
  onClick
}) => {
  const Toast = useToast({position: 'top-right'})
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    await BackendAxios.post(`/api/subscription`, {planId: id}).then(res => {
      Toast({
        status: 'success',
        description: `${title} purchased successfully`
      })
      setIsLoading(false);
    }).catch(err => {
      Toast({
        status: 'error',
        description: err?.response?.data?.message || err?.response?.data || err?.message
      })
      setIsLoading(false);
    }).finally(()=>{
      onClick()
    })
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
        <Box>
          <Table size={"sm"}>
            <Tbody>
              {description?.map((content, key) => (
                <Tr key={key}>
                  <Td py={2} fontSize={"xs"}>
                    {content}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box p={4}>
          {subscribedByMe ? (
            <Button
              w={"full"}
              bgColor={bgColor}
              _hover={{ bgColor: bgColor }}
              color={color}
            >
              Already Joined
            </Button>
          ) : (
            <Button
              w={"full"}
              bgColor={bgColor}
              _hover={{ bgColor: bgColor }}
              color={color}
              isLoading={isLoading}
              isDisabled={subscribedBySenior ? subscribedBySenior != id : false}
              onClick={handleClick}
            >
              Join with ₹{price}
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Plan;
