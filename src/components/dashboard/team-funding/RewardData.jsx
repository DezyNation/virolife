"use client";
import BackendAxios from "@/utils/axios";
import { Button, Td, Tr, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const RewardData = ({
  count,
  userId,
  userName,
  parentId,
  parentName,
  points,
  timestamp,
}) => {
  const Toast = useToast({ position: "top-right" });
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const sortedArray = data.sort((a, b) => a.parent_id - b.parent_id);
    setSortedData(sortedArray);
  }, [data]);

  useEffect(() => {
    getRewardData(localStorage.getItem("userId"));
  }, []);

  const getRewardData = (id) => {
    BackendAxios.get(`/api/my-group-points/${id}`)
      .then((res) => {})
      .catch((err) => {
        Toast({
            status: 'error',
            description: err?.response?.data?.message || err?.response?.data || err?.message,
        })
      });
  };

  return (
    <>
      {sortedData?.map((data, key) => (
        <Tr>
          <Td>{key + 1}</Td>
          {/* <Td>{userId}</Td>
          <Td>{userName}</Td>
          <Td>{parentId}</Td>
          <Td>{parentName}</Td>
          <Td>{points}</Td>
          <Td>{timestamp}</Td> */}
          <Td>
            <Button size={"xs"} onClick={() => getRewardData()}>
              View Junior Rewards
            </Button>
          </Td>
        </Tr>
      ))}
    </>
  );
};

export default RewardData;
