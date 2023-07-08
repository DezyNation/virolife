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
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { LuStars } from "react-icons/lu";
import BackendAxios from "@/utils/axios";
import QRCode from "react-qr-code";
import Tree from "react-d3-tree";
import VideoPlayer from "@/components/global/VideoPlayer";

const MyParents = ({ parentUsers }) => {
  const Toast = useToast({ position: "top-right" });
  const [qrModal, setQrModal] = useState(false);
  const [upi, setUpi] = useState("");
  const [receiver, setReceiver] = useState("");

  function showUpiModal(id, receiver) {
    if (!id) {
      Toast({
        description: "Senior doesn't have UPI ID",
      });
      return;
    }
    setUpi(id);
    setReceiver(receiver);
    setQrModal(true);
  }

  function donate() {
    Toast({
      status: "success",
      description: "Notification sent to senior",
    });
    setQrModal(false);
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
              <Avatar name={item?.parent_name} />
              <Box>
                <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
                  {item?.parent_name}
                </Text>
                <Text fontSize={"xs"}>
                  ID: {item?.id} &nbsp; | &nbsp; Phone: {item?.parent_phone}{" "}
                </Text>
              </Box>
            </HStack>
            <Button
              size={"xs"}
              colorScheme="yellow"
              onClick={() => showUpiModal(item?.upi_id, item?.parent_name)}
            >
              Donate
            </Button>
          </HStack>
        ))}
      </Box>

      <Modal size={"xs"} isOpen={qrModal} onClose={() => setQrModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Donate ₹200 to {receiver}</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <QRCode size={256} value={`upi://pay?cu=INR&pa=${upi}`} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="yellow" rounded={"full"} onClick={donate}>
              Done
            </Button>
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
  const [groupMembers, setGroupMembers] = useState([
    {
      name: "Sangam",
      children: [
        {
          name: "User",
        },
        {
          name: "Another User",
        },
        {
          name: "Great User",
        },
        {
          name: "Awesome User",
        },
      ],
    },
  ]);

  function viewGroup(id) {
    BackendAxios.get(`/api/my-group`)
      .then((res) => {
        setGroupModal(true);
        if (!res.data?.length) {
          Toast({
            description: "Group doesn't exist!",
          });
        }

        if (res.data?.length) {
          setGroupMembers([
            {
              name: res.data[0]?.user?.name,
              attributes: {
                ID: res.data[0]?.user?.id,
                Phone: res.data[0]?.user?.phone_number,
              },
              children: res.data[0]?.members?.map((user) => ({
                name: user?.name,
                attributes: {
                  ID: user?.id,
                  Phone: user?.phone_number,
                },
              })),
            },
          ]);
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
                <Text fontSize={"xs"}>
                  ID: {item?.id} &nbsp; | &nbsp; Phone: {item?.phone_number}
                </Text>
              </Box>
            </HStack>
          </HStack>
        ))}
        {childMembers?.length ? (
          <HStack justifyContent={"flex-end"} py={4}>
            <Button
              size={"sm"}
              rounded={"full"}
              colorScheme="twitter"
              onClick={() => viewGroup()}
            >
              View Group Tree
            </Button>
          </HStack>
        ) : null}
      </Box>

      <Modal
        isOpen={groupModal}
        onClose={() => setGroupModal(false)}
        size={["full", "4xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You Group Members</ModalHeader>
          <ModalBody>
            <Box w={"full"} h={"80vh"}>
              <Tree
                data={groupMembers}
                orientation="vertical"
                translate={{ x: 300, y: 200 }}
                separation={{ siblings: 4, nonSiblings: 4 }}
              />
            </Box>
          </ModalBody>
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

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
  });

  const { value, setValue, onCopy, hasCopied } = useClipboard(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}?refid=SANG02`
  );
  const [parentUsers, setParentUsers] = useState([]);
  const [childMembers, setChildMembers] = useState([]);
  const [primaryIdRequested, setPrimaryIdRequested] = useState(false);
  const [secondaryIdRequested, setSecondaryIdRequested] = useState(false);

  const [videoStatus, setVideoStatus] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "Watch this video to proceed.",
    onVideoClose: () => {
      return null;
    },
  });

  useEffect(() => {
    fetchChildren();
    fetchParents();
  }, []);

  useEffect(() => {
    if (primaryIdRequested) setSecondaryIdRequested(false);
    if (secondaryIdRequested) setPrimaryIdRequested(false);
  }, [secondaryIdRequested, primaryIdRequested]);

  function getUserInfo(id) {
    BackendAxios.get(`/api/users/${joinGroupId}`)
      .then((res) => {
        if (res.data?.length) {
          setUserInfo(res.data[0]);
        } else {
          Toast({
            description: "Invalid senior ID",
          });
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
    if (!joinGroupId) {
      Toast({
        description: "Senior ID is required",
      });
      return;
    }
    setVideoStatus(true);
    setVideoData({
      onVideoClose: () => {
        BackendAxios.get(`/api/join-group/${joinGroupId}`)
          .then((res) => {
            Toast({
              status: "success",
              description: "Group Joined Successfully!",
            });
            onClose();
            setVideoStatus(false);
            fetchParents();
          })
          .catch((err) => {
            setVideoStatus(false);
            onClose();
            Toast({
              status: "error",
              description:
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message,
            });
          });
      },
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
          setValue(
            `${process.env.NEXT_PUBLIC_FRONTEND_URL}/ref_id=${res.data[0]?.joining_code}`
          );
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

  function fetchParents() {
    BackendAxios.get(`/api/my-admin`)
      .then((res) => {
        setParentUsers(res.data);
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

      <Button
        position={"fixed"}
        bottom={4}
        size={["xs", "md"]}
        right={4}
        rounded={"full"}
        colorScheme="twitter"
        onClick={() => setInvitationModal(true)}
      >
        Invite Friends
      </Button>

      {/* Join Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Join Group</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <HStack>
              <Button
                onClick={() => setPrimaryIdRequested(true)}
                colorScheme="yellow"
              >
                Activate Primary ID
              </Button>
              <Button
                onClick={() => setSecondaryIdRequested(true)}
                colorScheme="twitter"
              >
                Activate Secondary ID
              </Button>
            </HStack>
            <br />
            {primaryIdRequested ? (
              <HStack>
                <Box>
                  <InputGroup>
                    <Input
                      onChange={(e) => setJoinGroupId(e.target.value)}
                      variant={"flushed"}
                      placeholder="Enter Senior ID To Join"
                    />
                    <InputRightAddon
                      bgColor={"#FFF"}
                      borderRight={"0"}
                      borderTop={"0"}
                      onClick={() => getUserInfo()}
                      children={
                        <Text
                          fontSize={"xs"}
                          color={"twitter.500"}
                          fontWeight={"semibold"}
                        >
                          Verify
                        </Text>
                      }
                    />
                  </InputGroup>
                  <Text mt={2} fontSize={"xs"}>
                    {userInfo?.name} - {userInfo?.phone}
                  </Text>
                </Box>
              </HStack>
            ) : null}
            {secondaryIdRequested ? (
              <HStack>
                <Text w={"70%"} fontSize={"xs"}>
                  Our system will automatically join you with a random senior ID
                </Text>
              </HStack>
            ) : null}
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"}>
            {primaryIdRequested && (
              <Button
                w={["auto", "auto"]}
                colorScheme="yellow"
                onClick={joinGroup}
              >
                Join with ₹250
              </Button>
            )}
            {secondaryIdRequested && (
              <Button size={"sm"} colorScheme="twitter" onClick={joinGroup}>
                Join with ₹250
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Invitation Modal */}
      <Modal isOpen={invitationModal} onClose={() => setInvitationModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite To Your Group</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <Text textAlign={"center"}>
              Share this link and invite your friends.
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

      <VideoPlayer
        status={videoStatus}
        title={videoData.title}
        onVideoClose={videoData.onVideoClose}
      />
    </>
  );
};

export default Page;
