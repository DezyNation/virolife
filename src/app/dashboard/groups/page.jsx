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
  useToast,
} from "@chakra-ui/react";
import { LuStars } from "react-icons/lu";
import BackendAxios from "@/utils/axios";
import QRCode from "react-qr-code";

const MyParents = ({ parentUsers }) => {
  const Toast = useToast({position: 'top-right'});
  const [qrModal, setQrModal] = useState(false);
  const [upi, setUpi] = useState("");
  const [receiver, setReceiver] = useState("")

  function showUpiModal(id, receiver) {
    setUpi(id);
    setReceiver(receiver)
    setQrModal(true);
  }

  function donationInitiated(){
    Toast({
      status: 'success',
      description: 'Notification sent to senior'
    })
    setQrModal(false)
  }

  return (
    <>
      <Box>
        {parentUsers?.map((item, key) => (
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
            <Button
              size={"xs"}
              colorScheme="yellow"
              onClick={() => showUpiModal(item?.upi_id, item?.name)}
            >
              Donate
            </Button>
          </HStack>
        ))}
      </Box>

      <Modal size={'xs'} isOpen={qrModal} onClose={() => setQrModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Donate ₹200 to {receiver}</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <QRCode size={256} value={`upi://pay?cu=INR&pa=${upi}`} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="yellow" rounded={'full'}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const MyChildren = ({ childMembers }) => {
  const Toast = useToast({ position: "top-right" });
  const [groupModal, setGroupModal] = useState(false);
  const [groupInfo, setGroupInfo] = useState({});

  function viewGroup(id) {
    BackendAxios.get(`/api/group/${id}`)
      .then((res) => {
        setGroupModal(true);
        if (!res.data?.length) {
          Toast({
            description: "Group doesn't exist!",
          });
        }

        if (res.data?.length) {
          setGroupInfo(res.data[0]);
          return;
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

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
                <Text fontSize={"xs"}>ID: {item?.id}; Phone: {item?.phone_number}</Text>
              </Box>
            </HStack>
            <Button
              size={"xs"}
              onClick={() => viewGroup(item?.pivot?.group_id)}
            >
              View Group
            </Button>
          </HStack>
        ))}
      </Box>

      <Modal isOpen={groupModal} onClose={() => setGroupModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Group Info</ModalHeader>
          <ModalBody
            alignItems={"center"}
            justifyContent={"center"}
          ></ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Page = () => {
  const Toast = useToast({ position: "top-right" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [joinGroupId, setJoinGroupId] = useState("");
  const [myGroupExists, setMyGroupExists] = useState(false);
  const [invitationModal, setInvitationModal] = useState(false);
  const { value, setValue, onCopy, hasCopied } = useClipboard(`SANG02`);
  const [parentUsers, setParentUsers] = useState([]);
  const [childMembers, setChildMembers] = useState([]);

  useEffect(() => {
    fetchChildren();
    fetchParents();
  }, []);

  function createGroup() {
    BackendAxios.post(`/api/group`, {
      title: `My Group`,
    })
      .then((res) => {
        fetchChildren();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function joinGroup() {
    BackendAxios.get(`/api/join-group/${joinGroupId}`)
      .then((res) => {
        Toast({
          status: "success",
          description: "Group Joined Successfully!",
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchChildren() {
    BackendAxios.get(`/api/my-group`)
      .then((res) => {
        if (!res?.data?.length) {
          setMyGroupExists(false);
          return;
        }
        if (res?.data?.length) {
          setMyGroupExists(true);
          setChildMembers(res.data[0]?.members);
          setValue(res.data[0]?.joining_code);
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchParents() {}

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
          {myGroupExists ? (
            <Button
              size={["xs", "md"]}
              rounded={"full"}
              onClick={() => setInvitationModal(true)}
            >
              Invite To Your Group
            </Button>
          ) : !childMembers?.length ? (
            <Button size={["xs", "md"]} rounded={"full"} onClick={createGroup}>
              Create Your Group
            </Button>
          ) : null}
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
            <MyParents parentUsers={parentUsers} />
          </Box>
          <Box>
            <Text fontSize={"xl"}>My Juniors</Text>
            <br />
            <MyChildren childMembers={childMembers} />
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
                placeholder="Senior ID"
                value={joinGroupId}
                onChange={(e) => setJoinGroupId(e.target.value)}
              />
              <br />
              <Button onClick={joinGroup} colorScheme="yellow">
                Join with Code
              </Button>
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
              Copy your referral code and invite your friends.
              <br />
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
                {value}
              </Box>
              <Button
                size={"sm"}
                onClick={onCopy}
                colorScheme={hasCopied ? "whatsapp" : "gray"}
              >
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
