"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const page = () => {
  const [data, setData] = useState([]);
  const { handleError } = useApiHandler();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(`/api/my-campaign-donations`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching donations");
      });
  }

  return (
    <>
      <Text fontSize={"2xl"}>Campaign Donations</Text>
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>Campaign</Th>
              <Th>Amount</Th>
              <Th>Name</Th>
              <Th>Phone Number</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((data, key) => (
              <Tr key={key}>
                <Td>{data?.transaction_id}</Td>
                <Td>{data?.campaign_title}</Td>
                <Td>{data?.amount}</Td>
                <Td>{data?.name}</Td>
                <Td>{data?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
