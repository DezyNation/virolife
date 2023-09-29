"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Stack,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Switch,
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormLabel,
  ModalFooter,
  Image,
  Avatar,
} from "@chakra-ui/react";
import Link from "next/link";
import { BsDownload, BsEye, BsPlus } from "react-icons/bs";
import BackendAxios from "@/utils/axios";
import QRCode from "react-qr-code";
import FullPageLoader from "@/components/global/FullPageLoader";

const Users = () => {
  const Toast = useToast({ position: "top-right" });
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false)

  const [myRole, setMyRole] = useState("");
  const [myId, setMyId] = useState("");

  const [juniorsModalStatus, setJuniorsModalStatus] = useState(false);
  const [selectedParentAgent, setSelectedParentAgent] = useState("");
  const [pointsInfo, setPointsInfo] = useState(null);
  const [subJuniorUsers, setSubJuniorUsers] = useState([]);

  const { isOpen, onToggle } = useDisclosure();
  const [userInfo, setUserInfo] = useState({});
  const [qrVisible, setQrVisible] = useState({ status: false, upi: "" });

  useEffect(() => {
    setMyRole(localStorage.getItem("myRole"));
    setMyId(localStorage.getItem("userId"));
  }, []);

  function showQr(upi) {
    if (!upi) {
      Toast({
        description: "UPI ID is not available for this user.",
      });
      return;
    }
    setQrVisible({ status: true, upi: upi });
  }

  useEffect(() => {
    if (myRole) {
      fetchUsers();
    }
  }, [myRole]);

  function fetchUsers(id) {
    setLoading(true)
    if (id){ setSelectedParentAgent(id);}
    BackendAxios.get(
      `api/user/my-users${selectedParentAgent ? `/${selectedParentAgent}` : ""}`
      )
      .then((res) => {
        if (Array.isArray(res.data)) return;
        if (typeof res.data == "object") {
          if (selectedParentAgent) {
            setJuniorsModalStatus(()=>true)
            setSubJuniorUsers(res.data[id]);
            return;
          }
          setUsers(res.data[myId]);
        }
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        Toast({
          status: "error",
          description:
          err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
    }
    
    function fetchPointsInfo(id) {
      setLoading(true)
      setUserInfo(id);
      BackendAxios.get(`/api/agent/my-user-points?userId=${id}`)
      .then((res) => {
        setPointsInfo(res.data[id]);
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function getUserInfo(id) {
    setLoading(true)
    BackendAxios.get(`/api/users/${id}`)
    .then((res) => {
        setLoading(false)
        setUserInfo(res.data[0]);
        fetchPointsInfo(id);
        onToggle();
      })
      .catch((err) => {
        setLoading(false)
        Toast({
          status: "error",
          description:
          err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
    }
    
    function searchUser() {
    setLoading(true)
    BackendAxios.get(`/api/admin/find-user?search=${query}`)
    .then((res) => {
      setUsers(res.data);
      setLoading(false)
    })
    .catch((err) => {
        setLoading(false)
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
    {
      loading ? <FullPageLoader /> : null
    }
      <HStack justifyContent={["space-between"]} py={8}>
        <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
          {myRole == "distributor" ? "Agents" : "Users"}
        </Text>
        <HStack alignItems={"flex-end"}>
          <Input
            placeholder={"Search Users"}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button colorScheme={"yellow"} onClick={searchUser}>
            Search
          </Button>
        </HStack>
      </HStack>
      <Stack
        w={"full"}
        direction={["column"]}
        justifyContent={"space-between"}
        gap={8}
      >
        <TableContainer rounded={"16"} w={"full"}>
          <Table variant={"striped"} colorScheme="gray">
            <TableCaption>Users on Virolife</TableCaption>
            <Thead bgColor={"yellow.400"}>
              <Tr>
                <Th>#</Th>
                <Th>ID</Th>
                <Th className="sticky-left">User Name</Th>
                <Th>Contact</Th>
                <Th>Registered On</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {myRole == "agent" || myRole == "distributor"
                ? users.map((user, key) => (
                    <Tr fontSize={"xs"} key={key}>
                      <Td>{key + 1}</Td>
                      <Td>VCF{user.id}</Td>
                      <Td className="sticky-left">
                        {user.child_name} ({user.gender})
                      </Td>
                      <Td>
                        <Box>
                          <p>{user.email}</p>
                          <p>+91 {user.phone_number}</p>
                        </Box>
                      </Td>
                      <Td>{new Date(user.created_at).toLocaleString()}</Td>
                      <Td>
                        <HStack gap={4} pb={2}>
                          <Button
                            size={"xs"}
                            colorScheme={"teal"}
                            leftIcon={<BsEye />}
                            onClick={() => getUserInfo(user?.id)}
                          >
                            View
                          </Button>
                          {myRole == "distributor" ? (
                            <Button size={"xs"} colorScheme="twitter" onClick={()=>fetchUsers(user?.id)}>
                              View Users
                            </Button>
                          ) : null}
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>

      <Link href={"/dashboard/users/create"}>
        <Button
          position={"fixed"}
          bottom={4}
          right={4}
          colorScheme="twitter"
          zIndex={9999}
          rounded={"full"}
          leftIcon={<BsPlus size={24} />}
        >
          Create New
        </Button>
      </Link>

      {/* User Info Modal */}
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onToggle}
        size={["full", "3xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={8}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <HStack gap={8}>
                <Avatar src={userInfo?.profile} name={userInfo?.name} />
                <Text>{userInfo?.name}</Text>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalBody p={8}>
            <Text fontSize={"lg"} fontWeight={"semibold"}>
              Basic Details
            </Text>
            <hr />
            <br />
            <Stack direction={["column", "row"]}>
              <Box flex={1}>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Email</Text>
                  <Text>{userInfo?.email}</Text>
                </HStack>

                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Phone</Text>
                  <Text>{userInfo?.phone_number}</Text>
                </HStack>

                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Joined On</Text>
                  <Text>{userInfo?.created_at}</Text>
                </HStack>

                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>D.o.B</Text>
                  <Text>{userInfo?.dob}</Text>
                </HStack>
              </Box>
              <Box flex={1}>
                <Text fontWeight={"semibold"}>Address</Text>
                <Text>
                  Street:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.street
                    : null}
                </Text>
                <Text>
                  City:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.city
                    : null}
                </Text>
                <Text>
                  Pincode:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.pincode
                    : null}
                </Text>
                <Text>
                  Landmark:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.landmark
                    : null}
                </Text>
              </Box>
            </Stack>
            <br />
            <br />
            <Text fontSize={"lg"} fontWeight={"semibold"}>
              Financial Details
            </Text>
            <hr />
            <br />
            <Stack direction={["column", "row"]}>
              <Box flex={1}>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Account No.:</Text>
                  <Text>{userInfo?.account_number}</Text>
                </HStack>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Bank Name:</Text>
                  <Text>{userInfo?.bank_name}</Text>
                </HStack>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>IFSC:</Text>
                  <Text>{userInfo?.ifsc}</Text>
                </HStack>
              </Box>
              <Box flex={1}>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>MICR:</Text>
                  <Text>{userInfo?.micr}</Text>
                </HStack>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>UPI:</Text>
                  <Text>{userInfo?.upi_id}</Text>
                </HStack>
                <br />
                <Button
                  size={"sm"}
                  rounded={"full"}
                  onClick={() => showQr(userInfo?.upi_id)}
                >
                  View UPI QR Code
                </Button>
              </Box>
            </Stack>
            <br />
            <br />
            <Text fontWeight={"semibold"}>Health Points</Text>
            <Text>Referral Points: ${pointsInfo?.referrals}</Text>
            <Text>Direct Points: ${pointsInfo?.parent}</Text>
            <Text>Level Points: ${pointsInfo?.chain}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* UPI Modal */}
      <Modal
        size={"xs"}
        isOpen={qrVisible.status}
        onClose={() => setQrVisible({ status: false })}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <QRCode size={256} value={`upi://pay?cu=INR&pa=${qrVisible.upi}`} />
            <br />
            <Text textAlign={"center"}>Scan with any UPI app</Text>
            <Image
              w={"80%"}
              alignSelf={"center"}
              mx={"auto"}
              src={"https://mytechtrips.com/wp-content/uploads/2023/01/upi.png"}
              objectFit={"contain"}
            />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Junior Users */}
      <Modal
        isOpen={juniorsModalStatus}
        onClose={() => setJuniorsModalStatus(false)}
        isCentered size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Junior Users of {selectedParentAgent}</ModalHeader>
          <ModalBody>
            <TableContainer rounded={"8"} w={"full"}>
              <Table variant={"striped"} colorScheme="gray" size={"sm"}>
                <Thead bgColor={"yellow.400"}>
                  <Tr>
                    <Th>#</Th>
                    <Th>ID</Th>
                    <Th>User Name</Th>
                    <Th>Contact</Th>
                    <Th>Registered On</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {myRole == "agent" || myRole == "distributor"
                    ? subJuniorUsers.map((user, key) => (
                        <Tr fontSize={"xs"} key={key}>
                          <Td>{key + 1}</Td>
                          <Td>VCF{user.id}</Td>
                          <Td>
                            {user.child_name} ({user.gender})
                          </Td>
                          <Td>
                            <Box>
                              <p>{user.email}</p>
                              <p>+91 {user.phone_number}</p>
                            </Box>
                          </Td>
                          <Td>{new Date(user.created_at).toLocaleString()}</Td>
                        </Tr>
                      ))
                    : null}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Users;
