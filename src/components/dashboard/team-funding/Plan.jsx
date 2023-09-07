"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  useDisclosure,
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
  onClick,
}) => {
  const Toast = useToast({ position: "top-right" });
  const [isLoading, setIsLoading] = useState(false);
  const [parentId, setParentId] = useState("");
  const [referralId, setReferralId] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleClick() {
    if(!parentId) return
    if(parentId == localStorage.getItem("userId")) {Toast({
      description: "You can not join yourself!"
    })}
    setIsLoading(true);
    await BackendAxios.post(`/api/subscription`, {
      planId: id,
      parentId: parentId,
      referralId: referralId
    })
      .then((res) => {
        Toast({
          status: "success",
          description: `${title} purchased successfully`,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
        setIsLoading(false);
      })
      .finally(() => {
        onClose()
        onClick();
      });
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
              onClick={onOpen}
            >
              Join with ₹{price}
            </Button>
          )}
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Text>Enter Senior ID</Text>
            <InputGroup>
              <InputLeftAddon children={"VCF"} />
              <Input
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                placeholder="ID of the user you would like to join with."
              />
            </InputGroup>
            <br /><br />
            <Text>Enter Referral ID</Text>
            <InputGroup>
              <InputLeftAddon children={"VCF"} />
              <Input
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
                placeholder="ID of the user who referred you."
              />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="twitter" onClick={handleClick}>Join</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Plan;
