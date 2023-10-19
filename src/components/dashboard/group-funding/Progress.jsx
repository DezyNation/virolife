"use client";
import FullPageLoader from "@/components/global/FullPageLoader";
import BackendAxios from "@/utils/axios";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useDisclosure,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  BsCheckCircleFill,
  BsClock,
  BsInfo,
  BsInfoCircleFill,
} from "react-icons/bs";

const Progress = () => {
  const Toast = useToast({ position: "top-right" });
  const [steps, setSteps] = useState([]);
  const [nextRoundInfo, setNextRoundInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [myProgress, setMyProgress] = useState({
    round: "0",
    collection: false,
    campaign_donation: false,
    virolife_donation: false,
    primary_junior_donation: false,
    primary_senior_donation: false,
    secondary_junior_donation: false,
    secondary_senior_donation: false,
  });
  const { activeStep, setActiveStep } = useSteps({
    index: myProgress?.round,
    count: steps.length,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchRounds();
  }, []);

  function fetchRounds() {
    BackendAxios.get(`/api/tasks`)
      .then((res) => {
        setSteps(res.data);
      })
      .catch((err) => {
        console.log("error while fetching tasks");
        console.log(err?.response?.data);
      });
  }

  useEffect(() => {
    const data = steps?.find((step) => step?.round == activeStep + 1);
    setNextRoundInfo(data);
  }, [activeStep, steps]);

  useEffect(() => {
    if (nextRoundInfo?.id) {
      const data = nextRoundInfo;
      localStorage.setItem(
        "primarySeniorAmount",
        Number(data?.primary_senior_amount)
      );
      localStorage.setItem(
        "secondarySeniorAmount",
        Number(data?.secondary_senior_amount)
      );
      localStorage.setItem(
        "primaryJuniorAmount",
        Number(data?.primary_junior_amount)
      );
      localStorage.setItem(
        "secondaryJuniorAmount",
        Number(data?.secondary_junior_amount)
      );
    }
  }, [nextRoundInfo]);

  useEffect(() => {
    fetchMyProgress();
  }, []);

  useEffect(() => {
    console.log("My Progress");
    console.log(myProgress);
    console.log("Next Round");
    console.log(nextRoundInfo);
    if (
      myProgress.campaign_donation &&
      myProgress.collection &&
      myProgress.primary_junior_donation &&
      myProgress.primary_senior_donation &&
      myProgress.secondary_junior_donation &&
      myProgress.secondary_senior_donation &&
      myProgress.virolife_donation
    ) {
      setActiveStep(activeStep + 1);
      updateMyRound(activeStep + 1);
    }
  }, [myProgress]);

  async function updateMyRound(round) {
    await BackendAxios.post(`/api/update-round`, {
      round: round,
    })
      .then((res) => {
        fetchMyProgress();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchCollectionInfo() {
    await BackendAxios.get(`/api/total-donation`)
      .then((res) => {
        if (
          parseInt(res.data?.primary) + parseInt(res.data?.secondary) >=
          parseInt(nextRoundInfo?.target_amount)
        ) {
          setMyProgress((prev) => ({
            ...prev,
            collection: true,
          }));
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching total collection",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function fetchMyProgress() {
    setIsLoading(true);
    await BackendAxios.get(`/auth-user`)
      .then((res) => {
        const userInfo = res.data[0];
        setMyProgress((prev) => ({
          ...prev,
          round: userInfo?.round,
        }));
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching your info",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
    await fetchCollectionInfo();
    await fetchMySeniorDonations();
    await fetchMyJuniorDonations();
    await fetchCampaignDonations();
    setIsLoading(false);
  }

  async function fetchMySeniorDonations() {
    await BackendAxios.get(
      `/api/senior-donations/${localStorage.getItem("userId")}/${activeStep}`
    )
      .then((res) => {
        let sum = 0;
        const amounts = res.data?.map((item) => parseInt(item?.amount));
        amounts?.forEach((amt) => (sum += Number(amt)));

        if (
          res.data?.length >=
            nextRoundInfo?.primary_senior_count +
              nextRoundInfo?.secondary_senior_count &&
          sum >=
            nextRoundInfo?.primary_senior_amount +
              nextRoundInfo?.secondary_senior_amount
        ) {
          setMyProgress((prev) => ({
            ...prev,
            primary_senior_donation: true,
            secondary_senior_donation: true,
          }));
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function fetchMyJuniorDonations() {
    await BackendAxios.get(
      `/api/junior-donations/${localStorage.getItem("userId")}/${activeStep}`
    )
      .then((res) => {
        let sum = 0;
        const amounts = res.data?.map((item) => parseInt(item?.amount));
        amounts?.forEach((amt) => (sum += parseInt(amt)));

        if (
          res.data?.length >=
            nextRoundInfo?.primary_junior_count +
              nextRoundInfo?.secondary_junior_count &&
          sum >=
            nextRoundInfo?.primary_junior_amount +
              nextRoundInfo?.secondary_junior_amount
        ) {
          setMyProgress((prev) => ({
            ...prev,
            primary_junior_donation: true,
            secondary_junior_donation: true,
          }));
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function fetchCampaignDonations() {
    await BackendAxios.get(`/api/campaign-donations/${activeStep}`)
      .then((res) => {
        let sum = 0;
        const amounts = res.data?.map((item) => parseInt(item?.amount));
        amounts?.forEach((amt) => (sum += Number(amt)));

        if (
          res.data?.length >= nextRoundInfo?.campaign_count &&
          sum >= nextRoundInfo?.campaign_amount
        ) {
          setMyProgress((prev) => ({
            ...prev,
            campaign_donation: true,
          }));
        }
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
      {isLoading ? <FullPageLoader /> : null}
      <HStack justifyContent={"flex-end"}>
        <Button
          onClick={() => fetchMyProgress()}
          variant={"ghost"}
          colorScheme="teal"
        >
          Refresh Progress
        </Button>
      </HStack>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <HStack
        w={["full", "xs"]}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
        my={4}
      >
        <Box flexShrink="0">
          <Text>
            <b>Current Round</b> :{" "}
            {steps.find((step) => step?.round == activeStep + 1)?.round}
          </Text>
          <Text>
            <b>Target</b> : ₹
            {parseInt(
              steps.find((step) => step?.round == activeStep + 1)?.target_amount
            )?.toFixed(0)}
          </Text>
        </Box>
        <IconButton
          icon={<BsInfoCircleFill />}
          variant={"ghost"}
          colorScheme="twitter"
          onClick={onOpen}
        />
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Round {activeStep + 1} Information</ModalHeader>
          <ModalBody py={2} px={6}>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                Target Amount :
              </Text>
              <Text fontSize={"sm"} flex={3}>
                ₹{parseInt(nextRoundInfo?.target_amount)?.toFixed(0)}
              </Text>
              <Box flex={1}>
                {myProgress?.collection ? (
                  <BsCheckCircleFill color="green" />
                ) : (
                  <BsClock />
                )}
              </Box>
            </HStack>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                Virolife's Share :
              </Text>
              <Text fontSize={"sm"} flex={3}>
                Donate ₹{parseInt(nextRoundInfo?.virolife_donation)?.toFixed(0)}{" "}
                to Virolife Foundation
              </Text>
              <Box flex={1}>
                {myProgress?.virolife_donation ? (
                  <BsCheckCircleFill color="green" />
                ) : (
                  <BsClock />
                )}
              </Box>
            </HStack>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                Campaign Donations :
              </Text>
              <Text fontSize={"sm"} flex={3}>
                Donate ₹
                {nextRoundInfo?.campaign_amount
                  ? parseInt(nextRoundInfo?.campaign_amount)?.toFixed(0)
                  : "0"}{" "}
                in {nextRoundInfo?.campaign_count}{" "}
                {nextRoundInfo?.campaign_type}{" "}
                {parseInt(nextRoundInfo?.campaign_count) > 1
                  ? "campaigns"
                  : "campaign"}
              </Text>
              <Box flex={1}>
                {myProgress?.campaign_donation ? (
                  <BsCheckCircleFill color="green" />
                ) : (
                  <BsClock />
                )}
              </Box>
            </HStack>

            {nextRoundInfo?.primary_senior_count ? (
              <HStack
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                gap={4}
                py={2}
              >
                <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                  Primary Group Senior Donations :
                </Text>
                <Text fontSize={"sm"} flex={3}>
                  ₹{parseInt(nextRoundInfo?.primary_senior_amount)?.toFixed(0)}{" "}
                  to {nextRoundInfo?.primary_senior_count} seniors each
                </Text>
                <Box flex={1}>
                  {myProgress?.primary_senior_donation ? (
                    <BsCheckCircleFill color="green" />
                  ) : (
                    <BsClock />
                  )}
                </Box>
              </HStack>
            ) : null}

            {nextRoundInfo?.primary_junior_count ? (
              <HStack
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                gap={4}
                py={2}
              >
                <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                  Primary Group Junior Donations :
                </Text>
                <Text fontSize={"sm"} flex={3}>
                  ₹{parseInt(nextRoundInfo?.primary_junior_amount)?.toFixed(0)}{" "}
                  to {nextRoundInfo?.primary_junior_count} juniors each
                </Text>
                <Box flex={1}>
                  {myProgress?.primary_junior_donation ? (
                    <BsCheckCircleFill color="green" />
                  ) : (
                    <BsClock />
                  )}
                </Box>
              </HStack>
            ) : null}

            {nextRoundInfo?.secondary_senior_count ? (
              <HStack
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                gap={4}
                py={2}
              >
                <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                  Secondary Group Senior Donations :
                </Text>
                <Text fontSize={"sm"} flex={3}>
                  ₹
                  {parseInt(nextRoundInfo?.secondary_senior_amount)?.toFixed(0)}{" "}
                  to {nextRoundInfo?.secondary_senior_count} seniors each
                </Text>
                <Box flex={1}>
                  {myProgress?.secondary_senior_donation ? (
                    <BsCheckCircleFill color="green" />
                  ) : (
                    <BsClock />
                  )}
                </Box>
              </HStack>
            ) : null}

            {nextRoundInfo?.secondary_junior_count ? (
              <HStack
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                gap={4}
                py={2}
              >
                <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                  Secondary Group Junior Donations :
                </Text>
                <Text fontSize={"sm"} flex={3}>
                  ₹
                  {parseInt(nextRoundInfo?.secondary_junior_amount)?.toFixed(0)}{" "}
                  to {nextRoundInfo?.secondary_junior_count} juniors each
                </Text>
                <Box flex={1}>
                  {myProgress?.secondary_junior_donation ? (
                    <BsCheckCircleFill color="green" />
                  ) : (
                    <BsClock />
                  )}
                </Box>
              </HStack>
            ) : null}

            {nextRoundInfo?.message ? (
              <HStack
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                gap={4}
                py={2}
              >
                <Text fontSize={"sm"} flex={2} fontWeight={"bold"}>
                  Instructions :
                </Text>
                <Box flex={3}>
                  <Text fontSize={"sm"}>{nextRoundInfo?.message}</Text>
                </Box>
                <Box flex={1}></Box>
              </HStack>
            ) : null}
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"} gap={4}>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Progress;
