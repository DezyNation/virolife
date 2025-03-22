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
        "60 HP and 100 CP per member for direct joining",
        "35 HP and 43 CP per member for next 16 members",
        "30 HP and 20 CP per member for next 64 members",
        "28 HP and 15 CP per member for next 256 members",
        "26 HP and 12 CP per member for next 1024 members",
        "18 HP and 10 CP per member for next 4096 members",
        "15 HP and 9 CP per member for next 16384 members",
        "11 HP and 8 CP per member for next 65536 members",
        "9 HP and 7 CP per member for next 262144 members",
        "8 HP and 6 CP per member for next 1048576 members",
      ],
    },
    {
      id: "2",
      title: "PLAN B",
      bgColor: "orange.500",
      color: "#FFF",
      price: 2400,
      description: [
        "120 HP and 200 CP per member for direct joining",
        "70 HP and 86 CP per member for next 16 members",
        "60 HP and 40 CP per member for next 64 members",
        "56 HP and 30 CP per member for next 256 members",
        "52 HP and 24 CP per member for next 1024 members",
        "36 HP and 20 CP per member for next 4096 members",
        "30 HP and 18 CP per member for next 16384 members",
        "22 HP and 16 CP per member for next 65536 members",
        "18 HP and 14 CP per member for next 262144 members",
        "16 HP and 12 CP per member for next 1048576 members",
      ],
    },
    {
      id: "3",
      title: "PLAN C",
      bgColor: "yellow.500",
      color: "#FFF",
      price: 3600,
      description: [
        "240 HP and 300 CP per member for direct joining",
        "140 HP and 129 CP per member for next 16 members",
        "120 HP and 60 CP per member for next 64 members",
        "112 HP and 45 CP per member for next 256 members",
        "104 HP and 36 CP per member for next 1024 members",
        "72 HP and 30 CP per member for next 4096 members",
        "60 HP and 27 CP per member for next 16384 members",
        "44 HP and 24 CP per member for next 65536 members",
        "36 HP and 21 CP per member for next 262144 members",
        "32 HP and 18 CP per member for next 1048576 members",
      ],
    },
    {
      id: "4",
      title: "PLAN D",
      bgColor: "whatsapp.500",
      color: "#FFF",
      price: 10000,
      description: [
        "300 HP and 500 CP per member for direct joining",
        "275 HP and 215 CP per member for next 16 members",
        "225 HP and 100 CP per member for next 64 members",
        "175 HP and 75 CP per member for next 256 members",
        "150 HP and 60 CP per member for next 1024 members",
        "115 HP and 50 CP per member for next 4096 members",
        "90 HP and 45 CP per member for next 16384 members",
        "65 HP and 40 CP per member for next 65536 members",
        "55 HP and 35 CP per member for next 262144 members",
        "50 HP and 30 CP per member for next 1048576 members",
      ],
    },
    {
      id: "5",
      title: "PLAN E",
      bgColor: "pink.500",
      color: "#FFF",
      price: 16000,
      description: [
        "750 HP and 1000 CP per member for direct joining",
        "525 HP and 430 CP per member for next 16 members",
        "475 HP and 200 CP per member for next 64 members",
        "450 HP and 150 CP per member for next 256 members",
        "400 HP and 120 CP per member for next 1024 members",
        "350 HP and 100 CP per member for next 4096 members",
        "300 HP and 90 CP per member for next 16384 members",
        "275 HP and 80 CP per member for next 65536 members",
        "250 HP and 70 CP per member for next 262144 members",
        "225 HP and 60 CP per member for next 1048576 members",
      ],
    },
    {
      id: "6",
      title: "PLAN F",
      bgColor: "twitter.500",
      color: "#FFF",
      price: 21500,
      description: [
        "950 HP and 1500 CP per member for direct joining",
        "850 HP and 645 CP per member for next 16 members",
        "825 HP and 300 CP per member for next 64 members",
        "725 HP and 225 CP per member for next 256 members",
        "625 HP and 180 CP per member for next 1024 members",
        "600 HP and 150 CP per member for next 4096 members",
        "475 HP and 135 CP per member for next 16384 members",
        "425 HP and 120 CP per member for next 65536 members",
        "400 HP and 105 CP per member for next 262144 members",
        "375 HP and 90 CP per member for next 1048576 members",
      ],
    },
  ];
  const [myPlan, setMyPlan] = useState({});
  const [myRole, setMyRole] = useState("");
  const [seniorPlan, setSeniorPlan] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    getMyPlan();
  }, []);

  useEffect(() => {
    setMyRole(localStorage.getItem("myRole"));
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
        {myRole == "user" ? "Veero Team Funding" : "Cash Points"}
      </Text>
      {myPlan?.id || myRole != "user" ? null : (
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
        gap={4}
        py={4}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        {myPlan?.id || myRole != "user" ? (
          <Box>
            {/* <Text>Members who bought subscription</Text> */}
            <br />
            <TableContainer h={"lg"} overflowY={"scroll"}>
              <Table size={"sm"}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>User Name</Th>
                    <Th>Parent ID</Th>
                    <Th>Plan Purchased</Th>
                    <Th>Health Points</Th>
                    <Th>Cash Points</Th>
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
                      <Td>{data?.cash_points}</Td>
                      <Td>
                        {data?.purpose == "parent"
                          ? "Direct"
                          : data?.purpose == "chain"
                          ? "level"
                          : data?.purpose}
                      </Td>
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
        ) : myRole == "user" ? (
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
        ) : null}
      </HStack>
    </>
  );
};

export default index;
