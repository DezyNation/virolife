"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Button,
  Checkbox,
  CheckboxGroup,
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
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { LuMerge } from "react-icons/lu";

const page = () => {
  const [giftCards, setGiftCards] = useState([]);
  const Toast = useToast({ position: "top-right" });
  const { handleError } = useApiHandler();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [myRole, setMyRole] = useState("");
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);

  const [mergeCouponModal, setMergeCouponModal] = useState(false);
  const [mergeCoupons, setMergeCoupons] = useState([]);

  const [shareGiftCardId, setShareGiftCardId] = useState("");
  const [targetUser, setTargetUser] = useState("");

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
      gift_card_ids: [],
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
      BackendAxios.put(`/api/edit-gift`, values)
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
      const existingGiftCards = Formik.values.gift_card_ids;
      if (!existingGiftCards.includes(selectedGiftCard?.id)) {
        Formik.setFieldValue("gift_card_ids", [
          ...existingGiftCards,
          selectedGiftCard?.id,
        ]);
      }
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

  function mergeGiftCards() {
    BackendAxios.post(`/api/merge-gifts`, {
      gifts: mergeCoupons,
    })
      .then((res) => {
        setMergeCouponModal(false);
        if (myRole == "distributor" || myRole == "agent") {
          fetchGiftCards("my-assigned-gifts");
        } else {
          fetchGiftCards("my-gifts");
        }
        Toast({
          status: "success",
          title: "Coupons merged successfully!",
          description: "A new gift card has been issued to you.",
        });
      })
      .catch((err) => {
        handleError(err, "Notification while merging gift cards");
      });
  }

  function shareGiftCard() {
    BackendAxios.post(`/api/transfer-gift/${shareGiftCardId}`, {
      user_id: targetUser,
    })
      .then((res) => {
        if (myRole == "distributor" || myRole == "agent") {
          fetchGiftCards("my-assigned-gifts");
        } else {
          fetchGiftCards("my-gifts");
        }
        Toast({
          status: "success",
          description: "Gift card transferred successfully!",
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
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {giftCards?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>{item?.code}</Td>
                <Td>
                  {item?.purpose}{" "}
                  {item?.purpose == "ecommerce" ? `(₹ ${item?.amount})` : ""}
                </Td>
                <Td>{item?.redeemed ? "USED" : "PENDING"}</Td>
                <Td>{item?.agent_id}</Td>
                <Td>{item?.user_id}</Td>
                <Td>
                  {item?.created_at
                    ? new Date(item?.created_at).toLocaleDateString()
                    : ""}
                </Td>
                <Td>{item?.expiry_at}</Td>
                <Td>
                  {myRole == "agent" || myRole == "distributor" ? (
                    <Button
                      size={"xs"}
                      onClick={() => setSelectedGiftCard(item)}
                    >
                      Edit
                    </Button>
                  ) : item?.redeemed ? null : (
                    <Button
                      size={"xs"}
                      onClick={() => setShareGiftCardId(true)}
                    >
                      Share
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Button
        rounded={"full"}
        pos={"fixed"}
        bottom={4}
        right={4}
        colorScheme="twitter"
        leftIcon={<LuMerge />}
        onClick={() => setMergeCouponModal(true)}
      >
        Merge Gift Cards
      </Button>

      {/* Gift Card Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Gift Card</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Card No.</FormLabel>
              <HStack w={'full'}>
                {/* <Input
                  name="code"
                  value={Formik.values.code}
                  isDisabled={true}
                /> */}
                <Select
                  isMulti
                  name="gift_card_ids"
                  options={giftCards
                    ?.filter(
                      (item) =>
                        item?.redeemed == 0 &&
                        (item?.agent_id == null || item?.user_id == null)
                    )
                    ?.map((item) => ({ value: item?.code, label: item?.code }))}
                  onChange={(e) => {
                    Formik.setFieldValue("code", e.value);
                    Formik.setFieldValue("gift_card_ids", e.value);
                  }}
                  styles={{width: '100%'}}
                />
              </HStack>
            </FormControl>

            {/* {Formik.values.giftCardId ? null : (
              <FormControl mb={4}>
                <FormLabel>Amount</FormLabel>
                <Input
                  name="amount"
                  value={Formik.values.amount}
                  // onChange={Formik.handleChange}
                />
              </FormControl>
            )} */}

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

      {/* Merge Gift Cards Modal */}
      <Modal
        isOpen={mergeCouponModal}
        onClose={() => setMergeCouponModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Merge Gift Cards</ModalHeader>
          <ModalBody>
            <Text>Select Gift Cards to Merge</Text>
            <CheckboxGroup
              value={mergeCoupons}
              onChange={(value) => setMergeCoupons(value)}
            >
              <VStack
                spacing={3}
                w={"full"}
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                mt={4}
              >
                {giftCards
                  ?.filter(
                    (item) => item?.purpose == "ecommerce" && !item?.redeemed
                  )
                  .map((card, key) => (
                    <Checkbox value={card?.code}>{card?.code}</Checkbox>
                  ))}
              </VStack>
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button onClick={() => setMergeCouponModal(false)}>Cancel</Button>
              <Button colorScheme="yellow" onClick={() => mergeGiftCards()}>
                Merge
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Transfer Gift Card */}
      <Modal isOpen={shareGiftCardId} onClose={() => setShareGiftCardId(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transfer Gift Card</ModalHeader>
          <ModalBody>
            <FormLabel>User ID</FormLabel>
            <HStack>
              <InputGroup>
                <InputLeftAddon children={"VCF"} />
                <Input
                  name="userId"
                  placeholder="Enter User ID"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                />
              </InputGroup>
              <Button size={"xs"} onClick={() => verifyUser(targetUser)}>
                Verify
              </Button>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button colorScheme="twitter" onClick={shareGiftCard}>
                Share
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
