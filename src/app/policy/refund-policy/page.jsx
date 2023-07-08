"use client";
import Footer from "@/components/global/Footer";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const page = () => {
  return (
    <>
      <Box p={[4, 8, 16]}>
        <Text fontSize={["xl", "2xl"]} textAlign={"center"}>
          Refund Policy
        </Text>
        <br />
        <br />
        <br />
        <Text>Effective From: 08 July 2023</Text>
        <br />
        <br />
        <Text>
          Thank you for choosing our crowdfunding platform. This policy outlines
          our guidelines regarding refunds and cancellations for contributions
          made on our website. Please read this policy carefully before making
          any contributions, as it constitutes a legally binding agreement
          between you and our platform.
        </Text>
        <br />
        <br />
        <h1>No Refunds:</h1>
        <Text>
          Once a contribution has been made on our crowdfunding website, it is
          non-refundable. We do not offer any refunds for contributions under
          any circumstances. This policy is in place to ensure the efficient and
          effective distribution of funds to the intended project or cause.
        </Text>
        <br />
        <br />
        <h1>No Cancellations:</h1>
        <Text>
          Contributions made on our platform cannot be canceled or revoked. Once
          you have submitted your contribution, it is considered final and
          cannot be reversed. It is important to carefully consider your
          decision before making a contribution.
        </Text>
        <br />
        <br />
        <h1>Project Completion</h1>
        <Text>
          Our platform operates on a campaign basis where projects or causes are
          presented for funding. If a project or cause fails to reach its
          funding goal within the specified campaign duration, the contributions
          made to that project will still be considered final and
          non-refundable.
        </Text>
        <br />
        <br />
        <h1>Responsibility of Project Owners:</h1>
        <Text>
          Project owners are responsible for fulfilling their promised rewards,
          perks, or incentives to contributors. However, our platform does not
          guarantee or enforce the fulfillment of such rewards. If a project
          owner fails to deliver the promised rewards, contributors do not have
          the right to request a refund or cancellation.
        </Text>
        <br />
        <br />
        <h1>Exceptions:</h1>
        <Text>
          In exceptional cases, where fraudulent activity or a violation of our
          terms of service is identified, we reserve the right to initiate
          refunds or cancellations at our sole discretion. Such cases will be
          thoroughly investigated, and appropriate action will be taken based on
          the outcome of the investigation.
        </Text>
        <br />
        <br />
        <h1>Disputes:</h1>
        <Text>
          If you have concerns about a project or believe that a project owner
          has acted in bad faith, we encourage you to contact our customer
          support team. We will review your concerns and may take appropriate
          actions, which may or may not include refund or cancellation, based on
          our sole discretion.
        </Text>
        <br />
        <br />
        <h1>Modifications and Termination</h1>
        <Text>
          Please note that this refund and cancellation policy is subject to
          change without prior notice. We recommend reviewing this policy
          periodically to stay updated on any modifications.
        </Text>

        <br />
        <br />
        <Text>
          By using our crowdfunding platform and making a contribution, you
          acknowledge and agree to abide by the terms of this refund and
          cancellation policy.
        </Text>
        <br />
        <br />
        <Text>
          If you have any questions or require further clarification, please
          contact our customer support team for assistance.
        </Text>
      </Box>
      <Footer />
    </>
  );
};

export default page;
