"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  HStack,
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
import BackendAxios from "@/utils/axios";
import VideoPlayer from "@/components/global/VideoPlayer";
import { FaUserShield } from "react-icons/fa";

const page = () => {
  const [transactions, setTransactions] = useState([]);
  const [videoStatus, setVideoStatus] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "Watch this video to proceed.",
    id: "",
    provider: "",
    onVideoClose: () => {
      return null;
    },
  });

  const Toast = useToast({
    position: "top-right",
  });

  function fetchMyCollections() {
    BackendAxios.get(`/api/collections-for-me`)
      .then((res) => {
        setTransactions(res.data);
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
    fetchMyCollections();
  }, []);

  function showVideo(id) {
    setVideoStatus(true);
    setVideoData({
      ...videoData,
      onVideoClose: () => {
        setVideoStatus(false);
        approveDonation(id);
      },
    });
  }

  function approveDonation(id) {
    if (!id) return;
    BackendAxios.post(`/api/approve-donation/${id}`, { status: 1 })
      .then((res) => {
        Toast({
          status: "success",
          description: "Donation approved",
        });
        fetchMyCollections();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function deleteDonation(id) {
    if (!id) return;
    BackendAxios.delete(`/api/donation/${id}`)
      .then((res) => {
        Toast({
          description: "Donation deleted",
        });
        fetchMyCollections();
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
      <Text fontSize={["2xl", "3xl"]}>Your Collection</Text>
      <br />
      <TableContainer>
        <Table variant={"striped"} colorScheme="gray" size={"sm"}>
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>From</Th>
              <Th>Description</Th>
              <Th>Amount</Th>
              <Th>Timestamp</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((item, key) => (
              <Tr key={key}>
                <Td>{item?.id}</Td>
                <Td>
                  {item?.user?.name} (VCF{item?.user_id})
                </Td>
                <Td>{item?.remarks}</Td>
                <Td>
                  ₹ {item?.amount || 200}
                  {item?.donated_to_admin ? <FaUserShield /> : null}
                </Td>
                <Td>{new Date(item?.created_at).toLocaleString()}</Td>
                <Td>
                  {!item?.approved &&
                  !item?.deleted_at &&
                  !item?.donated_to_admin ? (
                    <HStack>
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="yellow"
                        onClick={() => showVideo(item.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="red"
                        onClick={() => deleteDonation(item.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  ) : null}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <VideoPlayer
        status={videoStatus}
        title={videoData.title}
        onVideoClose={videoData.onVideoClose}
      />
    </>
  );
};

export default page;
