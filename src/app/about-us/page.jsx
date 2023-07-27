"use client";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";
import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";

const page = () => {
  return (
    <>
      <Box w={["full"]} p={[4, 8]}>
        <Container>
          <Text fontSize={"xl"}>About Us</Text>
          <Text>
            Started in 2019, we have grown through the years we are upcoming
            with new website as digital crowd funding and digital group funding
            platform in India for digital community. The belief that people are
            serious inherently humane and willing to always help forms the crux
            of what we do. We have been able to use technology to its excellent
            and make online giving a seamless and transparent process. Anyone
            across the country, irrespective of their socio-economic background
            can raise a fundraiser on virolife. We believe that in the years to
            come online giving will be ‘the’ way to charitable and humanitarian
            acts with digital community on digital platforms.
          </Text>
          <br />
          <br />
          <Text fontSize={"xl"}>Our Vision</Text>
          <Text>
            To make online giving the most trusted digital way of helping
            someone in emergency need
          </Text>
          <br />
          <br />
          <Text fontSize={"xl"}>Our Mission</Text>
          <Text>
            We believe that humanity is at the core of our being community and
            our mission is to augment this in digital.
          </Text>
          <br />
          <br />
          <Text fontSize={"xl"}>How to start a fundraiser with us?</Text>
          <Text>
            Starting a digital way fundraiser is easy, as anyone can start a
            SELF PROCESSING (Do-It-Yourself) campaign.
            <br />
            The campaign organizers are required to sign up and enter basic
            information about the beneficiary - the person / group for whom the
            funds are raised. Enter details about the campaign (such as the
            story/cause) and required fund amount along with the timeline by
            which the funds are required.
          </Text>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default page;
