"use client";
import React, { useEffect, useState } from "react";
import {
  Text,
  Stack,
  Box,
  Image,
  Button,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  BsArrowRight,
  BsCashCoin,
  BsCurrencyRupee,
  BsMegaphoneFill,
  BsYoutube,
} from "react-icons/bs";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { isExpired } from "react-jwt";
import BackendAxios from "@/utils/axios";
import { MdGroups } from "react-icons/md";
import Cookies from "js-cookie";

const DashboardHome = () => {
  const [selectedImg, setSelectedImg] = useState(
    "https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg"
  );
  const Toast = useToast({ position: "top-right" });
  const [sessionExpired, setSessionExpired] = useState(false);
  const [cookies] = useCookies(["jwt"]);
  const [campaigns, setCampaigns] = useState({});
  const [campaignDate, setCampaignDate] = useState(new Date());
  const [authUser, setAuthUser] = useState({});

  const [myRole, setMyRole] = useState("");

  useEffect(() => {
    setSessionExpired(isExpired(Cookies.get("jwt")));
  }, [Cookies.get()]);

  useEffect(() => {
    fetchInfo();
  }, []);

  function fetchInfo() {
    BackendAxios.get("/auth-user")
      .then((res) => {
        setAuthUser(res.data[0]);
        localStorage.setItem("userName", res.data[0]?.name);
        localStorage.setItem("userId", res.data[0]?.id);
        localStorage.setItem("primaryActive", res.data[0]?.primary_activated);
        localStorage.setItem(
          "secondaryActive",
          res.data[0]?.secondary_activated
        );
        localStorage.setItem("myPlan", res.data[0]?.subscription?.plan?.id);
        Cookies.set("adPoints", res.data[0]?.ad_points);
        Cookies.set("healthPoints", res.data[0]?.health_points);
        Cookies.set("viroPoints", res.data[0]?.virolife_points);
        localStorage.setItem(
          "myRole",
          res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
        );
        setMyRole(
          res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
        );
        if (res.data[0].parent_id) {
          localStorage.setItem("primaryParentId", res.data[0]?.parent_id);
        }
        if (res.data[0].secondary_parent_id) {
          localStorage.setItem(
            "secondaryParentId",
            res.data[0]?.secondary_parent_id
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  if (sessionExpired) {
    return (
      <>
        <Text>You need to login to view this page</Text>
      </>
    );
  }

  // useEffect(() => {
  //   BackendAxios.get("/api/user-campaigns")
  //     .then((res) => {
  //       setCampaigns(res.data);
  //       setCampaignDate(new Date(res.data[0]?.created_at));
  //     })
  //     .catch((err) => {
  //       Toast({
  //         status: "error",
  //         description:
  //           err?.response?.data?.message || err?.response?.data || err?.message,
  //       });
  //     });
  // }, []);

  return (
    <>
      <Text
        className="serif"
        fontSize={"xl"}
        py={4}
        textTransform={"capitalize"}
      >
        Welcome, {authUser?.name} - ({process.env.NEXT_PUBLIC_CODE}
        {authUser?.id})
      </Text>
      {myRole == "user" ? (
        <Stack
          w={"full"}
          direction={["column", "row"]}
          gap={[8, 16]}
          justifyContent={"space-between"}
        >
          <StatsCard icon={<MdGroups size={28} />} title={"my team"} />
          <StatsCard
            icon={<BsMegaphoneFill size={28} />}
            title={"active campaigns"}
          />
          <StatsCard
            icon={<BsCurrencyRupee size={28} />}
            title={"self earning"}
          />
          <StatsCard icon={<BsCashCoin size={28} />} title={"amount settled"} />
        </Stack>
      ) : (
        <Stack
          w={"full"}
          direction={["column", "row"]}
          gap={[8, 16]}
          justifyContent={"space-between"}
        >
          <StatsCard icon={<MdGroups size={28} />} title={"users created"} />
          <StatsCard
            icon={<BsCurrencyRupee size={28} />}
            title={"pending commision"}
          />
          <StatsCard icon={<BsCashCoin size={28} />} title={"commission settled"} />
        </Stack>
      )}

      {/* <Box pt={16}>
        <Stack
          direction={["column", "row"]}
          gap={8}
          justifyContent={"space-between"}
        >
          <Box flex={["unset", 4]}>
            <Text pb={8}>Your Most Recent Campaign</Text>
            {campaigns.length > 0 && (
              <Box
                pos={"relative"}
                boxShadow={"md"}
                rounded={8}
                overflow={"hidden"}
                bgImage={
                  campaigns[0]?.file_path
                    ? `https://virolife.in/${campaigns[0]?.file_path}`
                    : "https://idea.batumi.ge/files/default.jpg"
                }
                bgSize={"cover"}
                bgRepeat={"no-repeat"}
                h={"sm"}
                cursor={"pointer"}
              >
                <Box
                  position={"absolute"}
                  w={"full"}
                  h={"sm"}
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  p={4}
                  bgImage={
                    "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.3))"
                  }
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                  justifyContent={"flex-end"}
                >
                  <Text pos={"absolute"} top={4} right={4} color={"#FFF"}>
                    {new Date(campaigns[0]?.updated_at).toDateString()}
                  </Text>
                  <Text className="serif" fontSize={"3xl"} color={"#FFF"}>
                    {campaigns[0]?.title}
                  </Text>
                  <Text fontSize={"xs"} color={"#FFF"}>
                    {campaigns[0]?.description}
                  </Text>
                </Box>
              </Box>
            )}

            <Link href={"/dashboard/campaigns"}>
              <Button mt={8} colorScheme="yellow" rightIcon={<BsArrowRight />}>
                View All Campaigns
              </Button>
            </Link>
          </Box>
          <Box flex={["unset", 2]}>
            <Text pb={8}>Your Top Contributors</Text>
            
                        <VStack gap={4} w={'full'} p={4} boxShadow={'md'} rounded={8}>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Sangam Kumar</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹4571</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>John Doe</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3654</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Sanjay Mehta</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3600</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>George Bush</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹2154</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Tilak Prasad</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3884</Text>
                                </HStack>
                            </Box>
                            <Button pt={4} w={'full'} variant={'link'} colorScheme='yellow'>
                                View All Contributors
                            </Button>
                        </VStack>
                       
          </Box>
        </Stack>
      </Box> */}
    </>
  );
};

export default DashboardHome;
