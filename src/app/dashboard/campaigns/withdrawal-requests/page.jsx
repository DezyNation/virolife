"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
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
import React, { useState, useEffect } from "react";

const page = () => {
  const { handleError } = useApiHandler();
  const Toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [campaignId, setCampaignId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchData();
    fetchCampaigns();
  }, []);

  function fetchData() {
    BackendAxios.get(`/api/campaign-withdrawal-request`)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching requests");
      });
  }

  function fetchCampaigns() {
    BackendAxios.get(`/api/user-campaigns`)
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((err) => {
        handleError(err, "Err while fetching your campaigns");
      });
  }

  function newRequest() {
    BackendAxios.post(`/api/campaign-withdrawal-request`, {
      campaign_id: campaignId,
      amount: amount,
    })
      .then((res) => {
        fetchData();
        onClose();
        Toast({
          status: "success",
          description: "Withdrawal request sent to admin",
        });
      })
      .catch((err) => {
        handleError(err, "Err while sending your request");
      });
  }

  return (
    <>
      <Text fontSize={["xl", "xl"]} fontWeight={"semibold"}>
        Campaign Withdrawals
      </Text>
      <br />
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Campaign</Th>
              <Th>Amount</Th>
              <Th>Requested At</Th>
              <Th>Status</Th>
              <Th>Transaction ID</Th>
              <Th>Channel</Th>
              <Th>Trnxn Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item, key) => (
              <Tr>
                <Td>{key + 1}</Td>
                <Td>{item?.campaign?.title}</Td>
                <Td>{item?.amount}</Td>
                <Td>{item?.created_at}</Td>
                <Td>{item?.status}</Td>
                <Td>{item?.transaction_id}</Td>
                <Td>{item?.channel}</Td>
                <Td>{item?.transaction_timestamp}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Button
        rounded={"full"}
        colorScheme="twitter"
        pos={"fixed"}
        bottom={4}
        right={4}
        onClick={onOpen}
      >
        New Request
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Withdrawal Request</ModalHeader>
          <ModalBody>
            <FormControl maxW={["full", "xs"]}>
              <FormLabel>Please select a campaign</FormLabel>
              <Select
                onChange={(e) => setCampaignId(e.target.value)}
                placeholder="Choose a Campaign"
              >
                {campaigns?.map((item, key) => (
                  <option value={item?.id} key={key}>
                    {item?.title}
                  </option>
                ))}
              </Select>
            </FormControl>
            <br />
            <FormControl w={["full", "xs"]}>
              <FormLabel>Enter Amount</FormLabel>
              <NumberInput>
                <NumberInputField onChange={(e) => setAmount(e.target.value)} />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack w={"full"} justifyContent={"flex-end"}>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="whatsapp" onClick={newRequest}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
