"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const page = () => {
  const { handleError } = useApiHandler();
  const [data, setData] = useState([]);

  useEffect(() => {
    getPayoutRequests();
  }, []);

  function getPayoutRequests() {
    BackendAxios.get(`/api/user/commission-request`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        handleError(err);
      });
  }

  return (
    <>
      <Text className="messiri" fontWeight={"semibold"} fontSize={"lg"}>
        Payout Requests
      </Text>
      <br />
      <br />
      <TableContainer>
        <Table size={"sm"}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Amount</Th>
              <Th>Remarks</Th>
              <Th>Status</Th>
              <Th>Requested At</Th>
              <Th>Updated At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>₹{item?.request_amount}</Td>
                <Td>
                  {item?.admin_remarks
                    ? `Admin: ${item?.admin_remarks}`
                    : item?.user_remarks
                    ? `You: ${item?.user_remarks}`
                    : ""}
                </Td>
                <Td>{item?.status}</Td>
                <Td>{item?.created_at}</Td>
                <Td>{item?.updated_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
