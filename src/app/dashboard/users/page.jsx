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

const Users = () => {
  const Toast = useToast({ position: "top-right" });
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const [myRole, setMyRole] = useState("member");

  const { isOpen, onToggle } = useDisclosure();
  const [userInfo, setUserInfo] = useState({});
  const [qrVisible, setQrVisible] = useState({ status: false, upi: "" });

  const [groupMembers, setGroupMembers] = useState([]);
  const [showTreeModal, setShowTreeModal] = useState(false);

  useEffect(()=>{
    setMyRole(localStorage.getItem("myRole"));
  },[])

  function showQr(upi) {
    if (!upi) {
      Toast({
        description: "UPI ID is not available for this user.",
      });
      return;
    }
    setQrVisible({ status: true, upi: upi });
  }

  function fetchUsers() {
    BackendAxios.get(myRole == "distributor" ? "/api/user/my-agents" : "api/user/my-users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  function getUserInfo(id) {
    onToggle();
    BackendAxios.get(`/api/users/${id}`)
      .then((res) => {
        setUserInfo(res.data[0]);
      })
      .catch((err) => {
        onToggle();
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function updateUser(id, obj) {
    BackendAxios.post(`/api/admin/update-user/${id}`, { ...obj })
      .then((res) => {
        Toast({
          status: "success",
          description: "User updated successfully!",
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

  function searchUser() {
    BackendAxios.get(`/api/admin/find-user?search=${query}`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function updateUserRole(id, role) {
    BackendAxios.post(`/api/admin/change-role/${id}`, { role: role })
      .then((res) => {
        onToggle();
        Toast({
          status: "success",
          description: `The user role was updated successfully!`,
        });
        fetchUsers();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function viewSecondaryTree(id, name) {
    function buildHierarchy(items, parentId) {
      const nestedArray = [];
      for (const item of items) {
        if (parseInt(item.secondary_parent_id) == parseInt(parentId)) {
          const children = buildHierarchy(items, item.id);
          if (children.length > 0) {
            item.children = children;
          }
          nestedArray.push(item);
        }
      }
      return nestedArray;
    }

    BackendAxios.get(`/api/admin/my-group/secondary/${id}`)
      .then((res) => {
        const hierarchyArray = buildHierarchy(res.data, id);
        setGroupMembers([
          { name: name, children: hierarchyArray, id: id, donation: 0 },
        ]);
        setShowTreeModal(true);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function viewPrimaryTree(id, name) {
    function buildHierarchy(items, parentId) {
      const nestedArray = [];
      for (const item of items) {
        if (parseInt(item.parent_id) == parseInt(parentId)) {
          const children = buildHierarchy(items, item.id);
          if (children.length > 0) {
            item.children = children;
          }
          nestedArray.push(item);
        }
      }
      return nestedArray;
    }

    BackendAxios.get(`/api/admin/my-group/${id}`)
      .then((res) => {
        const hierarchyArray = buildHierarchy(res.data, id);
        setGroupMembers([
          { name: name, children: hierarchyArray, id: id, donation: 0 },
        ]);
        setShowTreeModal(true);
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
      <HStack justifyContent={["space-between"]} py={8}>
        <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
          Users
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
                <Th>Current Round</Th>
                <Th>Contact</Th>
                <Th>Donation Collected</Th>
                <Th>Date of Birth</Th>
                <Th>Role</Th>
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
                        {user.name} ({user.gender})
                      </Td>
                      <Td>
                        <Box>
                          <p>{user.email}</p>
                          <p>+91 {user.phone}</p>
                        </Box>
                      </Td>
                      <Td>{user?.round}</Td>
                      <Td>{user?.group_collection}</Td>
                      <Td>
                        {user?.dob ? new Date(user.dob).toDateString() : null}
                      </Td>
                      <Td>{user?.role_name}</Td>
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
                          <Link
                            href={`/dashboard/users/edit/${user?.id}`}
                            target="_blank"
                          >
                            <Button size={"xs"} colorScheme="twitter">
                              Edit
                            </Button>
                          </Link>
                        </HStack>
                        {/* <HStack pt={2}>
                      <Button
                        size={"xs"}
                        colorScheme={"yellow"}
                        onClick={() => viewPrimaryTree(user?.id, user?.name)}
                      >
                        Prim. Tree
                      </Button>
                      <Button
                        size={"xs"}
                        colorScheme={"orange"}
                        onClick={() => viewSecondaryTree(user?.id, user?.name)}
                      >
                        Sec. Tree
                      </Button>
                    </HStack> */}
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

      {/* Tree Modal */}
      {/* <TreeModal
        status={showTreeModal}
        onClose={() => setShowTreeModal(false)}
        groupMembers={groupMembers}
      /> */}
    </>
  );
};

export default Users;
