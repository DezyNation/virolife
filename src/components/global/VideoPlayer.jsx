"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";

const VideoPlayer = ({ title, onVideoClose, status, videoId, provider }) => {
  const Toast = useToast({ position: "top-right" });
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState("");
  const [videoProps, setVideoProps] = useState({
    type: "video",
    sources: [
      {
        src: "",
        provider: provider || "youtube",
      },
    ],
  });

  // Function Get Random Video
  const getRandomVideo = async () => {
    setLoading(true);
    BackendAxios.get(`/api/random-video`)
      .then((res) => {
        setLoading(false);
        setVideoProps({
          type: "video",
          sources: [
            {
              src: res.data?.video_id,
              provider: "youtube",
            },
          ],
        });
        setLink(res.data?.link);
      })
      .catch((err) => {
        setLoading(false);
        Toast({
          status: "error",
          title: "Notification while fetching video",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  };

  useEffect(() => {
    getRandomVideo();
  }, []);

  useEffect(() => {
    if (status) {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, 30000);
    }
    if (!status) {
      setIsDisabled(false);
    }
  }, [status]);

  const getRandomAdSlotId = () => {
    const adSlots = ["5151821226", "5151821226", "5151821226"];
    const randomIndex = Math.floor(Math.random() * adSlots.length);
    return adSlots[randomIndex];
  };

  return (
    <>
      <Modal
        isOpen={status}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onVideoClose}
        isCentered
        size={["full", "6xl"]}
      >
        <ModalOverlay />
        <ModalContent bgColor={"transparent"} boxShadow={"none"}>
          <ModalHeader bgColor={"#FFF"} rounded={"full"} py={2}>
            {title || "Watch this video to proceed."}
          </ModalHeader>
          <ModalBody>
            <Box rounded={"16"} overflow={"hidden"}>
              {loading ? (
                <Text color={"#FFF"} textAlign={"center"}>
                  Please wait while we load an ad for you.
                </Text>
              ) : (
                <Box
                  w={["full", "90vw", "90vw"]}
                  height={["480px", "560px"]}
                  rounded={16}
                  overflow={"hidden"}
                >
                  <iframe
                    src={link}
                    height={"90%"}
                    width={"85%"}
                    style={{ border: "none" }}
                  ></iframe>
                </Box>
              )}
              {/* <AdSenseVideoAd adSlot={getRandomAdSlotId()} /> */}
            </Box>
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"}>
            {isDisabled ? null : (
              <Button
                onClick={onVideoClose}
                colorScheme="yellow"
                rounded={"full"}
                isDisabled={isDisabled}
              >
                Close
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoPlayer;
