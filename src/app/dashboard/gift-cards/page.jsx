"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
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
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";

const page = () => {
  const [giftCards, setGiftCards] = useState([]);
  const Toast = useToast({ position: "top-right" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [myRole, setMyRole] = useState("");
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);

  useEffect(() => {
    setMyRole(localStorage.getItem("myRole"));
  }, []);

  useEffect(() => {
    if (myRole == "distributor" || myRole == "agent") {
      fetchGiftCards("my-assigned-gifts");
    } else {
      fetchGiftCards("my-gifts");
    }
  }, [myRole]);

  const Formik = useFormik({
    initialValues: {
      giftCardId: "",
      count: "",
      code: "",
      userId: "",
      agentId: "",
      distributorId: "",
      amount: "",
      purpose: "",
      plan: "",
      expiry: "",
      purpose: "",
    },
    onSubmit: (values) => {
      BackendAxios.put(`/api/gift/${values.giftCardId}`, values)
        .then((res) => {
          Toast({
            status: "success",
            title: "Gift card created successfully!",
          });
          fetchGiftCards("my-assigned-gifts");
          Formik.handleReset();
          onClose();
        })
        .catch((err) => {
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

  useEffect(() => {
    if (selectedGiftCard) {
      Formik.setFieldValue("giftCardId", selectedGiftCard?.id);
      Formik.setFieldValue("userId", selectedGiftCard?.user_id);
      Formik.setFieldValue("code", selectedGiftCard?.code);
      Formik.setFieldValue("agentId", selectedGiftCard?.agent_id);
      Formik.setFieldValue("distributorId", selectedGiftCard?.distributor_id);
      onOpen();
    }
  }, [selectedGiftCard]);

  function fetchGiftCards(keyword) {
    BackendAxios.get(`/api/${keyword}`)
      .then((res) => {
        setGiftCards(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function verifyUser(id) {
    if (!id) {
      Toast({
        description: "Please enter ID",
      });
      return;
    }
    BackendAxios.get(`/api/users/${id}`)
      .then((res) => {
        if (res.data?.length) {
          Toast({
            title: res.data[0]?.name,
            description: `Ph. ${res.data[0]?.phone_number || "NA"}`,
          });
        } else {
          Toast({
            description: "User not found!",
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

  return (
    <>
      <Text fontSize={"lg"}>Your Gift Cards</Text>
      <br />
      <br />

      <TableContainer>
        <Table size={"sm"} variant={"striped"} colorScheme="yellow">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Card No.</Th>
              <Th>Purpose</Th>
              <Th>Status</Th>
              <Th>Agent</Th>
              <Th>Linked User</Th>
              <Th>Created At</Th>
              <Th>Expires At</Th>
              {myRole == "agent" || myRole == "distributor" ? (
                <Th>Action</Th>
              ) : null}
            </Tr>
          </Thead>
          <Tbody>
            {giftCards?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>{item?.code}</Td>
                <Td>{item?.purpose}</Td>
                <Td>{item?.redeemed ? "USED" : "PENDING"}</Td>
                <Td>{item?.agent_id}</Td>
                <Td>{item?.user_id}</Td>
                <Td>
                  {item?.created_at
                    ? new Date(item?.created_at).toLocaleDateString()
                    : ""}
                </Td>
                <Td>{item?.expiry_at}</Td>
                {myRole == "agent" || myRole == "distributor" ? (
                  <Td>
                    <Button
                      size={"xs"}
                      onClick={() => setSelectedGiftCard(item)}
                    >
                      Edit
                    </Button>
                  </Td>
                ) : null}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Gift Card Creation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Gift Card</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Card No.</FormLabel>
              <HStack>
                <Input
                  name="code"
                  value={Formik.values.code}
                  isDisabled={true}
                />
              </HStack>
            </FormControl>
            {Formik.values.giftCardId ? null : (
              <FormControl mb={4}>
                <FormLabel>Amount</FormLabel>
                <Input
                  name="amount"
                  value={Formik.values.amount}
                  // onChange={Formik.handleChange}
                />
              </FormControl>
            )}

            {myRole == "agent" ? null : (
              <FormControl mb={4}>
                <FormLabel>Agent</FormLabel>
                <HStack>
                  <InputGroup>
                    <InputLeftAddon children={"VCF"} />
                    <Input
                      name="agentId"
                      placeholder="Enter Agent ID"
                      value={Formik.values.agentId}
                      onChange={Formik.handleChange}
                    />
                  </InputGroup>
                  <Button
                    size={"xs"}
                    onClick={() => verifyUser(Formik.values.agentId)}
                  >
                    Verify
                  </Button>
                </HStack>
              </FormControl>
            )}
            {myRole == "distributor" ? null : (
              <FormControl mb={4}>
                <FormLabel>Authorised User</FormLabel>
                <HStack>
                  <InputGroup>
                    <InputLeftAddon children={"VCF"} />
                    <Input
                      name="userId"
                      placeholder="Enter User ID"
                      value={Formik.values.userId}
                      onChange={Formik.handleChange}
                    />
                  </InputGroup>
                  <Button
                    size={"xs"}
                    onClick={() => verifyUser(Formik.values.userId)}
                  >
                    Verify
                  </Button>
                </HStack>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"} gap={4}>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="twitter" onClick={Formik.handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
