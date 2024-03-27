"use client";
import {
  Badge,
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
import useAuth from "@/utils/hooks/useAuth";
import { FaUserShield } from "react-icons/fa";

const page = () => {
  const { handleError } = useApiHandler();
  const { authUser } = useAuth();
  const { payWithRazorpay } = useRazorpay();

  const [rounds, setRounds] = useState([
    // {
    //   round: 0,
    // },
    {
      round: 1,
    },
    {
      round: 2,
    },
    {
      round: 3,
    },
    {
      round: 4,
    },
    {
      round: 5,
    },
    {
      round: 6,
    },
    {
      round: 7,
    },
    {
      round: 8,
    },
    {
      round: 9,
    },
  ]);
  const [myCurrentRound, setMyCurrentRound] = useState(null);
  const [activeRound, setActiveRound] = useState(null);

  const [requirements, setRequirements] = useState({
    threshold: 0,
    collection: 0,
    campaignDonationsRequired: 0,
    campaignDonationsDone: 0,
    primarySeniorDonationsRequired: 0,
    primarySeniorDonationsDone: 0,
    secondarySeniorDonationsRequired: 0,
    secondarySeniorDonationsDone: 0,
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
  const [donationData, setDonationData] = useState([]);

  const [campaignsData, setCampaignsData] = useState([]);
  const [totalCampaignDonation, setTotalCampaignDonation] = useState(0);
  const [virolifeDonationData, setVirolifeDonationData] = useState([]);

  useEffect(() => {
    refreshMyRound();
  }, []);

  useEffect(() => {
    // if (!myCurrentRound) return;
    setActiveRound(myCurrentRound);
    fetchRounds(myCurrentRound);
  }, [myCurrentRound]);

  useEffect(() => {
    setMyCurrentRound(localStorage.getItem("currentRound"));
  }, []);

  useEffect(() => {
    // if (!activeRound) return;
    fetchRounds(activeRound);
    fetchJuniorsData();
    fetchSeniorsData();
    fetchMyCollection();
    fetchCampaignDonations();
    fetchVirolifeDonations();
    fetchMyPreviousDonations(localStorage.getItem("userId"));
  }, [activeRound]);

  useEffect(() => {
    if (!campaignsData) return;
    let total = campaignsData.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.amount);
    }, 0);
    console.log("totalCampaignDonation", totalCampaignDonation);
    setTotalCampaignDonation(total);
  }, [campaignsData]);

  function fetchRounds(round = myCurrentRound) {
    BackendAxios.get(`/api/tasks`)
      .then((res) => {
        const tasks = res.data;
        const currentTasks = tasks?.find((task) => task?.round == round);
        setRounds(tasks?.sort((a, b) => a.round - b.round));
        setRequirements((prev) => ({
          ...prev,
          threshold: Number(currentTasks?.target_amount)?.toFixed(0),
          virolifeDonationsRequired: Number(
            currentTasks?.virolife_donation
          )?.toFixed(0),
          primarySeniorDonationsRequired: currentTasks?.primary_senior_count,
          secondarySeniorDonationsRequired:
            currentTasks?.secondary_senior_count,
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
      `/api/user/donation/donate-virolife?purpose=virolife-donation&round=${activeRound}`
    )
      .then((res) => {
        const result = res.data?.filter((data) => data?.round == activeRound);
        setVirolifeDonationData(result);

        const totalAmount = result?.reduce((accumulator, currentValue) => {
          if (currentValue.hasOwnProperty("amount")) {
            return accumulator + Number(currentValue.amount);
          }
          return accumulator;
        }, 0);

        setRequirements((prev) => ({
          ...prev,
          virolifeDonationsDone: totalAmount,
        }));
      })
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

  function fetchMyPreviousDonations(userId) {
    BackendAxios.get(`/api/senior-donations/${userId}/${activeRound}`)
      .then((res) => {
        setDonationData(res.data);
        setRequirements((prev) => ({
          ...prev,
          secondarySeniorDonationsDone: res.data?.filter(
            (item) => item?.group == "secondary"
          )?.length,
          primarySeniorDonationsDone: res.data?.filter(
            (item) => item?.group == "primary"
          )?.length,
        }));
      })
      .catch((err) => {
        handleError(err, "Error while getting your past donations");
      });
  }

  function refreshMyRound() {
    BackendAxios.get(`/api/update-round`)
      .then((res) => {
        Toast({
          status: "success",
          description: "Data updated successfully!",
        });
      })
      .catch((err) => {
        handleError(err, "Error while updating data", 20 * 60 * 1000);
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
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
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
              {Number(requirements?.collection) <
              Number(requirements?.threshold) ? (
                <Badge>Pending</Badge>
              ) : null}
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontWeight={"semibold"} fontSize={"xs"}>
                  Required: ₹{requirements?.threshold}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
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
              {Number(requirements?.primaryJuniorDonationsDone) +
                Number(requirements?.secondaryJuniorDonationsDone) <
              Number(requirements?.primaryJuniorDonationsRequired) +
                Number(requirements?.secondaryJuniorDonationsRequired) ? (
                <Badge>Pending</Badge>
              ) : null}
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontWeight={"semibold"} fontSize={"xs"}>
                  Req.: &nbsp;&nbsp;&nbsp;&nbsp;Prim.{" "}
                  {requirements?.primaryJuniorDonationsRequired}
                </Text>
                <Text fontWeight={"semibold"} fontSize={"xs"}>
                  Sec. {requirements?.secondaryJuniorDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BsHeartFill size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Medical donations</Text>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                {requirements?.campaignDonationsDone}
              </Text>
              {Number(requirements?.campaignDonationsDone) <
              Number(requirements?.campaignDonationsRequired) ? (
                <Badge>Pending</Badge>
              ) : null}
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontWeight={"semibold"} fontSize={"xs"}>
                  Req: {requirements?.campaignDonationsRequired}{" "}
                  &nbsp;&nbsp;&nbsp; Amt: ₹{amounts?.campaignDonation} each
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
      </Stack>
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
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BiSolidGroup size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Senior Donations</Text>
              <HStack w={"full"} gap={8}>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  Prim. {requirements?.primarySeniorDonationsDone}
                </Text>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  Sec. {requirements?.secondarySeniorDonationsDone}
                </Text>
              </HStack>
              {Number(requirements?.primarySeniorDonationsDone) +
                Number(requirements?.secondarySeniorDonationsDone) <
              Number(requirements?.primarySeniorDonationsRequired) +
                Number(requirements?.secondarySeniorDonationsRequired) ? (
                <Badge>Pending</Badge>
              ) : null}
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontWeight={"semibold"} fontSize={"xs"}>
                  Req.: &nbsp;&nbsp;&nbsp;&nbsp;Prim.{" "}
                  {requirements?.primarySeniorDonationsRequired}
                </Text>
                <Text fontWeight={"semibold"} fontSize={"xs"}>
                  Sec. {requirements?.secondarySeniorDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
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
              {Number(requirements?.virolifeDonationsDone) <
              Number(requirements?.virolifeDonationsRequired) ? (
                <Badge>Pending</Badge>
              ) : null}
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontWeight={"semibold"} fontSize={"xs"}>
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
      <HStack w={"full"} justifyContent={"flex-end"}>
        <Text fontSize={"xs"}>
          If the data is incorrect, please refresh the page.
        </Text>
      </HStack>
      <br />
      <br />

      <Tabs>
        <TabList>
          {/* <Tab>Donate to Seniors</Tab> */}
          <Tab>Donate to Juniors</Tab>
          <Tab>Senior Donation History</Tab>
          <Tab>Approve Donations from Senior</Tab>
          <Tab>Donate in Medical Campaigns</Tab>
          <Tab>Donate to Virolife</Tab>
        </TabList>

        <TabPanels>
          {/* Donate to Juniors */}
          <TabPanel>
            {activeRound == 0 ? (
              <Text p={8}>No data to show</Text>
            ) : requirements?.collection >= requirements?.threshold ? (
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
                    {juniorsData
                      ?.filter((data) => data?.group == "primary")
                      ?.slice(0, 20)
                      .map((data, key) => (
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
                            ) : null}
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
                    {juniorsData
                      ?.filter((data) => data?.group == "secondary")
                      ?.slice(0, 20)
                      .map((data, key) => (
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
                            ) : null}
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
            ) : (
              <Text p={8}>
                Please collect atleast ₹{requirements?.threshold} to view tasks
                of this round
              </Text>
            )}
          </TabPanel>

          {/* Senior Donation History */}
          <TabPanel>
            <TableContainer my={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>User</Th>
                    <Th>Amount</Th>
                    <Th>Group</Th>
                    <Th>Approved</Th>
                    <Th>Updated On</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {donationData?.map((data, key) => (
                    <Tr key={key}>
                      <Td>{key + 1}</Td>
                      <Td>
                        ({data?.donatable_id}) {data?.user_name}
                      </Td>
                      <Td>
                        ₹{data?.amount}{" "}
                        {data?.donated_to_admin ? <FaUserShield /> : null}
                      </Td>
                      <Td>{data?.group}</Td>
                      <Td>
                        {data?.approved ? (
                          <BsCheckCircleFill color="green" />
                        ) : null}
                      </Td>
                      <Td>{data?.updated_at}</Td>
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
            {activeRound == 0 ? (
              <Text p={8}>No data to show</Text>
            ) : requirements?.collection >= requirements?.threshold ? (
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
                        <Td>{data?.name}</Td>
                        <Td>{data?.phone_number}</Td>
                        <Td>
                          ({data?.campaign_id}) {data?.title}
                        </Td>
                        <Td>₹ {data?.amount}</Td>
                        <Td>{data?.updated_at}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text p={8}>
                Please collect atleast ₹{requirements?.threshold} to view tasks
                of this round
              </Text>
            )}
            <br />
            {totalCampaignDonation >=
              parseInt(requirements?.campaignDonationsRequired) *
                parseInt(amounts?.campaignDonation) &&
            requirements?.campaignDonationsDone >=
              requirements?.campaignDonationsRequired ? null : requirements?.collection >=
                requirements?.threshold && amounts?.campaignDonation > 0 ? (
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
            {activeRound == 0 ? (
              <Text p={8}>No data to show</Text>
            ) : requirements?.collection >= requirements?.threshold ? (
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
                        <Td>{Number(data?.amount)?.toFixed(2)}</Td>
                        <Td>{data?.transaction_id}</Td>
                        <Td>{data?.created_at}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text p={8}>
                Please collect atleast ₹{requirements?.threshold} to view tasks
                of this round
              </Text>
            )}
            <br />
            {requirements?.virolifeDonationsRequired >
              requirements?.virolifeDonationsDone &&
            requirements?.collection >= requirements?.threshold ? (
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
