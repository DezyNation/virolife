"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  VStack,
  useClipboard,
} from "@chakra-ui/react";
import { LuStars } from "react-icons/lu";

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
          <HStack
            py={4}
            key={key}
            w={["full", "xs"]}
            justifyContent={"space-between"}
          >
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
  const childMembers = [
    { name: "Sangam Kumar", id: `2` },
    { name: "Rishi Kumar", id: `3` },
    { name: "Sagar", id: `4` },
    { name: "Sangam Kumar", id: `2` },
  ];

  return (
    <>
      <Box>
        {childMembers.map((item, key) => (
          <HStack
            py={4}
            key={key}
            w={["full", "xs"]}
            justifyContent={"space-between"}
          >
            <HStack>
              <Avatar name={item?.name} />
              <Box>
                <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
                  {item?.name}
                </Text>
                <Text fontSize={"xs"}>ID: {item?.id}</Text>
              </Box>
            </HStack>
            <Button size={"xs"}>View Group</Button>
          </HStack>
        ))}
      </Box>
    </>
  );
};

const Page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [joinGroupId, setJoinGroupId] = useState("");
  const [invitationModal, setInvitationModal] = useState(false);
  const { value, setValue, onCopy, hasCopied } = useClipboard(`SANG02`);

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <Text className="serif" fontSize={"2xl"}>
          Group Funding
        </Text>
        <HStack>
          <Button
            size={["xs", "md"]}
            colorScheme="yellow"
            rounded={"full"}
            onClick={onOpen}
          >
            Join Group
          </Button>
          <Button
            size={["xs", "md"]}
            rounded={"full"}
            onClick={() => setInvitationModal(true)}
          >
            Invite To Your Group
          </Button>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join Group</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <Text textAlign={"center"}>Enter Group Code To Join</Text>
            <br />
            <VStack w={"full"}>
              <Input
                variant={"flushed"}
                w={"36"}
                textAlign={"center"}
                placeholder="Group ID"
                value={joinGroupId}
                onChange={(e) => setJoinGroupId(e.target.value)}
              />
              <br />
              <Button colorScheme="yellow">Join with Code</Button>
              <br />
              <br />
              <Text textAlign={"center"}>
                Or Let Our System Add You In A Group Automatically!
              </Text>
              <br />
              <Button colorScheme="twitter" leftIcon={<LuStars />}>
                Join Automatically
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={invitationModal} onClose={() => setInvitationModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite To Your Group</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <Text textAlign={"center"}>
              Copy your referral code and invite your friends.<br />
              <b>
                They will be automatically added to your group once they signup
                through your code
              </b>
            </Text>
            <br />
            <HStack justifyContent={"center"}>
              <Box
                p={2}
                border={"1px"}
                borderStyle={"dashed"}
                borderColor={"blackAlpha.200"}
              >
                SANG02
              </Box>
              <Button size={"sm"} onClick={onCopy} colorScheme={hasCopied ? "whatsapp" : "gray"}>
                {hasCopied ? "Copied!" : "Copy"}
              </Button>
            </HStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Page;
