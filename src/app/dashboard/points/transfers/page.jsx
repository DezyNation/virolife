"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import BackendAxios from "@/utils/axios";

const Transactions = () => {
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState("");

  const Toast = useToast({
    position: "top-right",
  });

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    fetchRequests();
  }, []);

  function fetchRequests() {
    BackendAxios.get("/api/points/my-requests")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          title: "Error while fetching peding requests",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <Text
        className="serif"
        fontSize={"2xl"}
        py={4}
        textTransform={"capitalize"}
      >
        Transactions
      </Text>
      <br />
      <HStack justifyContent={"flex-end"} py={4}>
        <Button onClick={fetchRequests}>Reload Data</Button>
      </HStack>
      <Stack
        w={"full"}
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
      >
        <TableContainer rounded={"16"} flex={["unset", 3]}>
          <Table variant={"striped"} colorScheme="gray">
            <TableCaption>
              <Link href={"#"}>Point Transfer Requests</Link>
            </TableCaption>
            <Thead bgColor={"yellow.400"}>
              <Tr>
                <Th>#</Th>
                <Th>Ponits</Th>
                <Th>Status</Th>
                <Th>Sender</Th>
                <Th>Receiver</Th>
                <Th>Requested At</Th>
                <Th>Updated At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {requests.map((item, key) => (
                <Tr fontSize={"xs"} key={key}>
                  <Td>{key + 1}</Td>
                  <Td>
                    <Text
                      py={1} px={2}
                      bgColor={userId == item?.user_id ? "red.400" : "whatsapp.500"}
                      color={"white"}
                    >
                      {item?.value}
                    </Text>
                  </Td>
                  <Td>{item?.status}</Td>
                  <Td>
                    {item?.user_id}-{item?.sender_name}
                  </Td>
                  <Td>
                    {item?.receiver_id}-{item?.receiver_name}
                  </Td>
                  <Td>{item?.created_at}</Td>
                  <Td>{item?.updated_at}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
};

export default Transactions;
