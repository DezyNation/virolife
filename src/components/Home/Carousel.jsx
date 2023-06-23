"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Text, Image, Stack, Button, VStack } from "@chakra-ui/react";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: null,
    nextArrow: null,
  };

  return (
    <Box w={"full"}>
      <Stack
        p={8}
        direction={["column", "row"]}
        justifyContent={"space-between"}
      >
        <Image
          w={["full", "4xl"]}
          objectFit={"contain"}
          src="/hero.png"
        />
        <VStack>
          <Text
            fontSize={["3xl", "5xl", "6xl"]}
            className="serif"
            textAlign={["center", "right"]}
          >
            We Know You
            <br />
            Need Funds
          </Text>
          <Button
            mt={12} fontSize={"xl"}
            rounded={6} size={"lg"}
            bgColor={"yellow.400"}
            fontWeight={"semibold"}
            color={"#333"}
          >
            Let's Start a Fund Raiser
          </Button>
        </VStack>
      </Stack>
      <Box w={"90vw"} h={"0.5"} mx={"auto"} bgColor={"yellow.400"}></Box>
    </Box>
  );
};

export default Carousel;
