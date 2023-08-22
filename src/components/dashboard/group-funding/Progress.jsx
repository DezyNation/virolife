"use client";
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsInfo, BsInfoCircleFill } from "react-icons/bs";

const Progress = () => {
  const [steps, setSteps] = useState([]);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [nextRoundInfo, setNextRoundInfo] = useState({});

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
    setNextRoundInfo(steps?.find((step) => step?.round == activeStep + 1));
  }, [activeStep, steps]);

  return (
    <>
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
            <b>Next Round</b> :{" "}
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

      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
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
              <Text flex={2} fontWeight={"bold"}>
                Target Amount :
              </Text>
              <Text flex={3}>₹{nextRoundInfo?.target_amount}</Text>
            </HStack>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text flex={2} fontWeight={"bold"}>
                Virolife's Share :
              </Text>
              <Text flex={3}>₹{nextRoundInfo?.virolife_donation}</Text>
            </HStack>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text flex={2} fontWeight={"bold"}>
                Campaign Donations :
              </Text>
              <Text flex={3}>
                Donate ₹{nextRoundInfo?.campaign_amount} in{" "}
                {nextRoundInfo?.campaign_count} {nextRoundInfo?.campaign_type}{" "}
                campaigns
              </Text>
            </HStack>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text flex={2} fontWeight={"bold"}>
                Senior Donations :
              </Text>
              <Text flex={3}>₹{nextRoundInfo?.junior_donation1}</Text>
            </HStack>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text flex={2} fontWeight={"bold"}>
                Junior Donations :
              </Text>
              <Text flex={3}>₹{nextRoundInfo?.junior_donation2}</Text>
            </HStack>
            <HStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              py={2}
            >
              <Text flex={2} fontWeight={"bold"}>
                Instructions :
              </Text>
              <Box flex={3}>
                <Text>• {nextRoundInfo?.message}</Text>
                <Text>
                  {nextRoundInfo?.message2
                    ? `• ${nextRoundInfo?.message2}`
                    : ""}
                </Text>
              </Box>
            </HStack>
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
