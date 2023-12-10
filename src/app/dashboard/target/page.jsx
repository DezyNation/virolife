"use client";
import {
  Box,
  Button,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Toast,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiSolidGroup } from "react-icons/bi";
import {
  BsCheckCircleFill,
  BsCurrencyRupee,
  BsHeartFill,
  BsXCircleFill,
} from "react-icons/bs";
import { GiChestnutLeaf } from "react-icons/gi";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Link from "next/link";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import DonateButton from "@/components/dashboard/group-funding/DonateButton";
import useRazorpay from "@/utils/hooks/useRazorpay";

const page = () => {
  const { handleError } = useApiHandler();
  const { payWithRazorpay } = useRazorpay();

  const [rounds, setRounds] = useState([]);
  const [myCurrentRound, setMyCurrentRound] = useState(null);
  const [activeRound, setActiveRound] = useState(null);

  const [requirements, setRequirements] = useState({
    threshold: 0,
    collection: 0,
    campaignDonationsRequired: 0,
    campaignDonationsDone: 0,
    primaryJuniorDonationsRequired: 0,
    primaryJuniorDonationsDone: 0,
    secondaryJuniorDonationsRequired: 0,
    secondaryJuniorDonationsDone: 0,
    virolifeDonationsRequired: 0,
    virolifeDonationsDone: 0,
  });
  const [amounts, setAmounts] = useState({
    primaryJuniorDonation: 0,
    secondaryJuniorDonation: 0,
    primarySeniorDonation: 0,
    secondarySeniorDonation: 0,
    campaignDonation: 0,
    virolifeDonation: 0,
  });
  const [juniorsData, setJuniorsData] = useState([]);
  const [seniorsData, setSeniorsData] = useState([]);

  const [campaignsData, setCampaignsData] = useState([]);
  const [virolifeDonationData, setVirolifeDonationData] = useState([]);

  useEffect(() => {
    if (!myCurrentRound) return;
    setActiveRound(myCurrentRound);
    fetchRounds();
  }, [myCurrentRound]);

  useEffect(() => {
    setMyCurrentRound(localStorage.getItem("currentRound"));
  }, []);

  useEffect(() => {
    if (!activeRound) return;
    fetchJuniorsData();
    fetchSeniorsData();
    fetchMyCollection();
    fetchCampaignDonations();
    fetchVirolifeDonations();
  }, [activeRound]);

  function fetchRounds() {
    BackendAxios.get(`/api/tasks`)
      .then((res) => {
        const tasks = res.data;
        const currentTasks = tasks?.find(
          (task) => task?.round == myCurrentRound
        );
        setRounds(tasks);
        setRequirements((prev) => ({
          ...prev,
          threshold: Number(currentTasks?.target_amount)?.toFixed(0),
          virolifeDonationsRequired: Number(
            currentTasks?.virolife_donation
          )?.toFixed(0),
          primaryJuniorDonationsRequired: currentTasks?.primary_junior_count,
          secondaryJuniorDonationsRequired:
            currentTasks?.secondary_junior_count,
          campaignDonationsRequired: currentTasks?.campaign_count,
        }));
        setAmounts((prev) => ({
          ...prev,
          campaignDonation: Number(currentTasks?.campaign_amount)?.toFixed(0),
          virolifeDonation: Number(currentTasks?.virolife_donation)?.toFixed(0),
          primaryJuniorDonation: Number(
            currentTasks?.primary_junior_amount
          )?.toFixed(0),
          secondaryJuniorDonation: Number(
            currentTasks?.secondary_junior_amount
          )?.toFixed(0),
          primarySeniorDonation: Number(
            currentTasks?.primary_senior_amount
          )?.toFixed(0),
          secondarySeniorDonation: Number(
            currentTasks?.secondary_senior_amount
          )?.toFixed(0),
        }));
      })
      .catch((err) => {
        console.log("error while fetching tasks");
        console.log(err?.response?.data);
      });
  }

  function fetchJuniorsData() {
    BackendAxios.get(`/api/junior-donation-list/${activeRound}`)
      .then((res) => {
        setJuniorsData(res.data);
        const prim = res.data?.filter((data) => {
          if (data?.group == "primary" && data?.approved) {
            return data;
          }
        });
        const sec = res.data?.filter((data) => {
          if (data?.group == "secondary" && data?.approved) {
            return data;
          }
        });
        setRequirements((prev) => ({
          ...prev,
          primaryJuniorDonationsDone: prim?.length,
          secondaryJuniorDonationsDone: sec?.length,
        }));
      })
      .catch((err) => {
        handleError(err, "Error while fetching juniors data");
      });
  }

  function fetchSeniorsData() {
    BackendAxios.get(`/api/my-senior-donation`)
      .then((res) => {
        setSeniorsData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching seniors data");
      });
  }

  async function fetchMyCollection() {
    await BackendAxios.get(`/api/total-donation`)
      .then((res) => {
        setRequirements((prev) => ({
          ...prev,
          collection:
            parseInt(res.data?.primary) + parseInt(res.data?.secondary),
        }));
      })
      .catch((err) => {
        handleError(err, "Error while fetching total collection");
      });
  }

  function fetchCampaignDonations() {
    BackendAxios.get(`/api/campaign-donations/${activeRound}`)
      .then((res) => {
        setCampaignsData(res.data);
        setRequirements((prev) => ({
          ...prev,
          campaignDonationsDone: res.data?.length,
        }));
      })
      .catch((err) => {
        handleError(err, "Err while fetching your campaign donations");
      });
  }

  function donateToVirolife() {
    payWithRazorpay({
      orderType: "virolife-donation",
      amount: amounts?.virolifeDonation,
    });
  }

  function approveDonation(id, approve) {
    BackendAxios.post(`/api/approve/my-senior-donation/${id}`, {
      ...(approve ? { approved: 1 } : { donated: 0, approved: 0 }),
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Donation accepted!",
        });
        window.location.reload(true);
      })
      .catch((err) => {
        handleError(err, "Err while accepting donation");
      });
  }

  function fetchVirolifeDonations() {
    BackendAxios.get(
      `/api/user/donation/donate-virolife?purpose=virolife-donation`
    )
      .then((res) => setVirolifeDonationData(res.data))
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        handleError(err, "Error while fetching donations");
      });
  }

  return (
    <>
      <Text mb={4} fontSize={"2xl"} fontWeight={"semibold"} className="messiri">
        Target List
      </Text>

      <Stack
        w={"full"}
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"center"}
        my={4}
        gap={4}
      >
        <Box
          p={4}
          rounded={4}
          boxShadow={"base"}
          flex={1}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"} alignItems={"flex-start"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BsCurrencyRupee size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Collection</Text>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                ₹ {requirements?.collection}
              </Text>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Required: ₹{requirements?.threshold}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          rounded={4}
          boxShadow={"base"}
          flex={1}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BiSolidGroup size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Junior Donations</Text>
              <HStack w={"full"} gap={8}>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  Prim. {requirements?.primaryJuniorDonationsDone}
                </Text>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  Sec. {requirements?.secondaryJuniorDonationsDone}
                </Text>
              </HStack>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Req.: Prim. {requirements?.primaryJuniorDonationsRequired}
                </Text>
                <Text fontSize={"xs"}>
                  Sec. {requirements?.secondaryJuniorDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          rounded={4}
          boxShadow={"base"}
          flex={1}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BsHeartFill size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Medical campaign donations</Text>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                {requirements?.campaignDonationsDone}
              </Text>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Required: {requirements?.campaignDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          rounded={4}
          boxShadow={"base"}
          flex={1}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <GiChestnutLeaf size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Virolife donations</Text>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                ₹{requirements?.virolifeDonationsDone}
              </Text>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Required: ₹{requirements?.virolifeDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
      </Stack>
      <br />
      <br />
      <HStack
        w={"full"}
        overflowX={"scroll"}
        className="hide-scrollbar"
        justifyContent={"flex-start"}
        gap={6}
        my={4}
      >
        <Text fontSize={"lg"} fontWeight={"medium"}>
          Rounds:{" "}
        </Text>
        {rounds?.map((item, key) => (
          <Box key={key}>
            <Button
              colorScheme={
                myCurrentRound == item?.round
                  ? "yellow"
                  : activeRound == item?.round
                  ? "twitter"
                  : "gray"
              }
              onClick={() => setActiveRound(item?.round)}
            >
              Round {item?.round}
            </Button>
          </Box>
        ))}
      </HStack>
      <br />
      <br />
      <Tabs>
        <TabList>
          {/* <Tab>Donate to Seniors</Tab> */}
          <Tab>Donate to Juniors</Tab>
          <Tab>Approve Donations from Senior</Tab>
          <Tab>Donate in Medical Campaigns</Tab>
          <Tab>Donate to Virolife</Tab>
        </TabList>

        <TabPanels>
          {/* Donate to Juniors */}
          <TabPanel>
            <TableContainer my={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>User</Th>
                    <Th>Group</Th>
                    <Th>Amount</Th>
                    <Th>Donated</Th>
                    <Th>Approved</Th>
                    <Th>Updated On</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {juniorsData?.map((data, key) => (
                    <Tr key={key}>
                      <Td>{key + 1}</Td>
                      <Td>
                        ({data?.receiver_id}) {data?.receiver_name}
                      </Td>
                      <Td>{data?.group}</Td>
                      <Td>{data?.amount}</Td>
                      <Td>
                        {data?.donated ? (
                          <BsCheckCircleFill color="green" />
                        ) : null}
                      </Td>
                      <Td>
                        {data?.donated && data?.approved ? (
                          <BsCheckCircleFill color="green" />
                        ) : (
                          <BsXCircleFill color="red" />
                        )}
                      </Td>
                      <Td>{data?.approved ? data?.updated_at : null}</Td>
                      <Td>
                        {data?.donated ? null : (
                          <DonateButton
                            userId={data?.receiver_id}
                            userName={
                              data?.upi_id
                                ? data?.receiver_name
                                : "Virolife Foundation"
                            }
                            upiId={data?.upi_id ?? "9022853554@okbizaxis"}
                            amount={data?.amount}
                            groupType={data?.group}
                            instanceId={data?.id}
                          />
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Approve Donations from Senior */}
          <TabPanel>
            <TableContainer my={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>User</Th>
                    <Th>Group</Th>
                    <Th>Amount</Th>
                    <Th>Approved</Th>
                    <Th>Updated On</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {seniorsData?.map((data, key) => (
                    <Tr key={key}>
                      <Td>{key + 1}</Td>
                      <Td>
                        ({data?.sender_id}) {data?.sender_name}
                      </Td>
                      <Td>{data?.group}</Td>
                      <Td>{data?.amount}</Td>
                      <Td>
                        {data?.approved ? (
                          <BsCheckCircleFill color="red" />
                        ) : !data?.donated ? (
                          <BsXCircleFill color="red" />
                        ) : null}
                      </Td>
                      <Td>{data?.updated_at}</Td>
                      <Td>
                        <HStack gap={6}>
                          {data?.approved ? null : data?.donated ? (
                            <Button
                              size={"sm"}
                              rounded={"full"}
                              colorScheme="yellow"
                              onClick={() => approveDonation(data?.id, true)}
                            >
                              Approve
                            </Button>
                          ) : null}
                          {data?.approved ? null : data?.donated ? (
                            <Button
                              size={"sm"}
                              rounded={"full"}
                              colorScheme="red"
                              onClick={() => approveDonation(data?.id, false)}
                            >
                              Reject
                            </Button>
                          ) : null}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Donate in Medical Campaigns */}
          <TabPanel>
            <TableContainer my={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Name</Th>
                    <Th>Phone Number</Th>
                    <Th>Campaign</Th>
                    <Th>Amount</Th>
                    <Th>Donated On</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {campaignsData?.map((data, key) => (
                    <Tr key={key}>
                      <Td>{key + 1}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <br />
            {amounts?.campaignDonation > 0 ? (
              <HStack py={4} justifyContent={"flex-end"}>
                <Link
                  href={`/campaigns?prefil_amount=${amounts?.campaignDonation}`}
                >
                  <Button colorScheme="blue">Donate Now</Button>
                </Link>
              </HStack>
            ) : null}
          </TabPanel>

          {/* Donate to Virolife */}
          <TabPanel>
            <TableContainer my={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Amount</Th>
                    <Th>Transaction ID</Th>
                    <Th>Timestamp</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {virolifeDonationData?.map((data, key) => (
                    <Tr key={key}>
                      <Td>{key + 1}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <br />
            {requirements?.virolifeDonationsRequired >
            requirements?.virolifeDonationsDone ? (
              <HStack py={4} justifyContent={"flex-end"}>
                <Button colorScheme="blue" onClick={() => donateToVirolife()}>
                  Donate Now
                </Button>
              </HStack>
            ) : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default page;
