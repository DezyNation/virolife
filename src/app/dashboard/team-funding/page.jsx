"use client";
import Plan from "@/components/dashboard/team-funding/Plan";
import RewardData from "@/components/dashboard/team-funding/RewardData";
import BackendAxios from "@/utils/axios";
import {
  Box,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useEditable,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const index = () => {
  const Toast = useToast({ position: "top-right" });
  const plans = [
    {
      id: "1",
      title: "PLAN A",
      bgColor: "blue.500",
      color: "#FFF",
      price: 1200,
      description: [
        "60 per member for direct joining",
        "35 per member for next 16 members",
        "30 per member for next 64 members",
        "28 per member for next 256 members",
        "26 per member for next 1024 members",
        "18 per member for next 4096 members",
        "15 per member for next 16384 members",
        "11 per member for next 65536 members",
        "9 per member for next 262144 members",
        "8 per member for next 1048576 members",
      ],
    },
    {
      id: "2",
      title: "PLAN B",
      bgColor: "orange.500",
      color: "#FFF",
      price: 2400,
      description: [
        "120 per member for direct joining",
        "70 per member for next 16 members",
        "60 per member for next 64 members",
        "56 per member for next 256 members",
        "52 per member for next 1024 members",
        "36 per member for next 4096 members",
        "30 per member for next 16384 members",
        "22 per member for next 65536 members",
        "18 per member for next 262144 members",
        "16 per member for next 1048576 members",
      ],
    },
    {
      id: "3",
      title: "PLAN C",
      bgColor: "yellow.500",
      color: "#FFF",
      price: 3600,
      description: [
        "240 per member for direct joining",
        "140 per member for next 16 members",
        "120 per member for next 64 members",
        "112 per member for next 256 members",
        "104 per member for next 1024 members",
        "72 per member for next 4096 members",
        "60 per member for next 16384 members",
        "44 per member for next 65536 members",
        "36 per member for next 262144 members",
        "32 per member for next 1048576 members",
      ],
    },
    {
      id: "4",
      title: "PLAN D",
      bgColor: "whatsapp.500",
      color: "#FFF",
      price: 6000,
      description: [
        "300 per member for direct joining",
        "275 per member for next 16 members",
        "225 per member for next 64 members",
        "175 per member for next 256 members",
        "150 per member for next 1024 members",
        "115 per member for next 4096 members",
        "90 per member for next 16384 members",
        "65 per member for next 65536 members",
        "55 per member for next 262144 members",
        "50 per member for next 1048576 members",
      ],
    },
    {
      id: "5",
      title: "PLAN E",
      bgColor: "pink.500",
      color: "#FFF",
      price: 12000,
      description: [
        "750 per member for direct joining",
        "525 per member for next 16 members",
        "475 per member for next 64 members",
        "450 per member for next 256 members",
        "400 per member for next 1024 members",
        "350 per member for next 4096 members",
        "300 per member for next 16384 members",
        "275 per member for next 65536 members",
        "250 per member for next 262144 members",
        "225 per member for next 1048576 members",
      ],
    },
    {
      id: "6",
      title: "PLAN F",
      bgColor: "twitter.500",
      color: "#FFF",
      price: 18000,
      description: [
        "950 per member for direct joining",
        "850 per member for next 16 members",
        "825 per member for next 64 members",
        "725 per member for next 256 members",
        "625 per member for next 1024 members",
        "600 per member for next 4096 members",
        "475 per member for next 16384 members",
        "425 per member for next 65536 members",
        "400 per member for next 262144 members",
        "375 per member for next 1048576 members",
      ],
    },
  ];
  const [myPlan, setMyPlan] = useState({});
  const [seniorPlan, setSeniorPlan] = useState({});
  const [data, setData] = useState(second);

  useEffect(() => {
    getMyPlan();
  }, []);

  useEffect(() => {
    getRewardData(localStorage.getItem("userId"));
  }, []);

  const getRewardData = (id) => {
    BackendAxios.get(`/api/my-group-points/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  };

  useEffect(() => {
    BackendAxios.get(`/api/senior-plan`)
      .then((res) => {
        setSeniorPlan(res.data?.length ? res.data[0]?.plan?.id : "");
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);

  function getMyPlan() {
    BackendAxios.get(`/auth-user`)
      .then((res) => {
        const plan = plans.find(
          (plan) => plan.id == res.data[0]?.subscription?.plan?.id
        );
        console.log(plan);
        setMyPlan(plan);
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
      <Text fontSize={"lg"} className="serif">
        Veero Team Funding
      </Text>
      {myPlan?.id ? null : (
        <VStack w={"full"} py={6}>
          <Text textAlign={"center"}>You don't have any subscription.</Text>
          <Text
            textAlign={"center"}
            fontSize={"xl"}
            className="serif"
            fontWeight={"semibold"}
          >
            Buy your plan to start earning points
          </Text>
        </VStack>
      )}

      {/* Plans */}
      <HStack
        gap={6}
        py={4}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        {myPlan?.id ? (
          <Box>
            {/* <Text>Members who bought subscription</Text> */}
            <br />
            <TableContainer height={'lg'} overflow={'scroll'}>
              <Table size={"sm"}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>User Name</Th>
                    <Th>Parent ID</Th>
                    <Th>Plan Purchased</Th>
                    <Th>Points Received</Th>
                    <Th>Reward Type</Th>
                    <Th>Timestamp</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map((data, key) => (
                    <Tr>
                      <Td>{key + 1}</Td>
                      <Td>
                        {data?.user_name} ({data?.user_id})
                      </Td>
                      <Td>{data?.parent_id}</Td>
                      <Td>{data?.name}</Td>
                      <Td>{data?.points}</Td>
                      <Td>{data?.purpose}</Td>
                      <Td>{data?.created_at}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
        {myPlan?.id ? (
          <Plan
            id={myPlan?.id}
            onClick={() => console.log(myPlan?.id)}
            title={myPlan?.title}
            price={myPlan?.price}
            bgColor={myPlan?.bgColor}
            color={myPlan?.color}
            description={myPlan?.description}
            subscribedByMe={true}
          />
        ) : (
          plans.map((plan, key) => (
            <Plan
              key={key}
              onClick={() => getMyPlan()}
              id={plan?.id}
              title={plan?.title}
              price={plan?.price}
              bgColor={plan?.bgColor}
              color={plan?.color}
              description={plan?.description}
              subscribedByMe={false}
              subscribedBySenior={
                seniorPlan
                  ? parseInt(seniorPlan) == parseInt(plan?.id)
                    ? false
                    : true
                  : false
              }
            />
          ))
        )}
      </HStack>
    </>
  );
};

export default index;
