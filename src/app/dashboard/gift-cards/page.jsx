"use client";
import BackendAxios from "@/utils/axios";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const page = () => {
  const [giftCards, setGiftCards] = useState([]);
  const Toast = useToast({ position: "top-right" });

  useEffect(() => {
    fetchGiftCards();
  }, []);


  function fetchGiftCards() {
    BackendAxios.get(`/api/my-gifts`)
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
              {/* <Th>Amount</Th> */}
              <Th>Purpose</Th>
              <Th>Status</Th>
              <Th>Linked User</Th>
              <Th>Created At</Th>
              <Th>Expires At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {giftCards?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>{item?.code}</Td>
                {/* <Td>{item?.amount}</Td> */}
                <Td>
                  {item?.purpose}
                </Td>
                <Td>{item?.redeemed ? "USED" : "PENDING"}</Td>
                <Td>{item?.user_id}</Td>
                <Td>
                  {item?.created_at
                    ? new Date(item?.created_at).toLocaleDateString()
                    : ""}
                </Td>
                <Td>{item?.expiry_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

    </>
  );
};

export default page;
