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
  useToast,
} from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";
import Plyr from "plyr-react";
import "plyr/dist/plyr.css";
import AdSenseVideoAd from "./AdSenseVideoAd";

const VideoPlayer = ({ title, onVideoClose, status, videoId, provider }) => {
  const Toast = useToast({ position: "top-right" });
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [videoProps, setVideoProps] = useState({
    type: "video",
    sources: [
      {
        src: videoId,
        provider: provider || "youtube",
      },
    ],
  });

  // Function Get Random Video
  const getRandomVideo = async () => {
    BackendAxios.get(`/api/random-video`)
      .then((res) => {
        setVideoProps({
          type: "video",
          sources: [
            {
              src: res.data?.video_id,
              provider: "youtube",
            },
          ]
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching video",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  };

  useEffect(() => {
    getRandomVideo()
  }, []);

  const getRandomAdSlotId = () => {
    const adSlots = ['5151821226', '5151821226', '5151821226'];
    const randomIndex = Math.floor(Math.random() * adSlots.length);
    return adSlots[randomIndex];
  };

  return (
    <>
      <Modal
        isOpen={status}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        size={["full", "4xl"]}
      >
        <ModalOverlay />
        <ModalContent bgColor={'transparent'} boxShadow={'none'}>
          <ModalHeader bgColor={'#FFF'} rounded={'full'} py={2}>{title || "Watch this video to proceed."}</ModalHeader>
          <ModalBody>
            <Box rounded={'16'} overflow={'hidden'}>
            {/* <Plyr source={videoProps} options={{ ratio: "16:9" }} /> */}
            <AdSenseVideoAd adSlot={getRandomAdSlotId()} />
            </Box>
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"}>
            <Button onClick={onVideoClose} colorScheme="yellow" rounded={'full'}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoPlayer;
