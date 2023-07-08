"use client";
import Footer from "@/components/global/Footer";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const page = () => {
  return (
    <>
      <Box p={[4, 8, 16]}>
        <Text fontSize={["xl", "2xl"]} textAlign={"center"}>
          Terms & Conditions
        </Text>
        <br />
        <br />
        <br />
        <Text>Effective From: 08 July 2023</Text>
        <br />
        <br />
        <Text>
          These Terms & Conditions govern your use of our crowd funding website
          ("the Website"). By accessing and using the Website, you agree to
          comply with these Terms & Conditions in their entirety. If you do not
          agree with any part of these Terms & Conditions, you must refrain from
          using the Website.
        </Text>
        <br />
        <br />
        <h1>User Obligations</h1>
        <Text>
          You acknowledge that you are solely responsible for the information
          and content you post on the Website, including project descriptions,
          updates, and rewards. You agree not to submit any misleading, false,
          or fraudulent information and to comply with all applicable laws and
          regulations while using the Website. Furthermore, you must not engage
          in any unauthorized or illegal activities that may compromise the
          integrity of the Website.
        </Text>
        <br />
        <br />
        <h1>Intellectual Property</h1>
        <Text>
          All intellectual property rights, including trademarks, copyrights,
          and patents, associated with the Website and its content are the sole
          property of the Website operator or its licensors. You may not use,
          reproduce, modify, distribute, or exploit any part of the Website
          without obtaining prior written consent from the respective owner.
        </Text>
        <br />
        <br />
        <h1>Project Creators</h1>
        <Text>
          When creating a project on the Website, you must provide accurate and
          complete information about your project, including the funding goal,
          timeline, and expected outcomes. You understand and agree that the
          Website does not guarantee the success or completion of any project,
          and project creators are solely responsible for fulfilling their
          obligations to backers and delivering promised rewards.
        </Text>
        <br />
        <br />
        <h1>Backers</h1>
        <Text>
          By contributing to a project on the Website, you acknowledge that you
          are solely responsible for evaluating the risks associated with the
          project and the project creator's ability to deliver on their
          promises. The Website does not guarantee the accuracy, quality, or
          legitimacy of any project or the rewards offered. Backers are
          encouraged to communicate directly with project creators to address
          any concerns or questions.
        </Text>
        <br />
        <br />
        <h1>Fees and Payments</h1>
        <Text>
          The Website may charge fees for certain services, such as processing
          payments or promoting projects. These fees will be clearly disclosed,
          and you agree to pay all applicable fees as outlined on the Website.
          Payments made through the Website are processed by third-party payment
          providers, and you agree to comply with their terms and conditions.
        </Text>
        <br />
        <br />
        <h1>Limitation of Liability</h1>
        <Text>
          To the extent permitted by law, the Website operator, its affiliates,
          employees, and agents shall not be liable for any direct, indirect,
          incidental, consequential, or punitive damages arising out of or in
          connection with your use of the Website, including but not limited to
          financial losses, personal injury, or reputational damage.
        </Text>
        <br />
        <br />
        <h1>Modifications and Termination</h1>
        <Text>
          The Website operator reserves the right to modify, suspend, or
          terminate the Website or any part thereof, at any time without prior
          notice. Additionally, the operator may update these Terms & Conditions
          from time to time, and it is your responsibility to review them
          periodically. Continued use of the Website after any modifications
          constitutes your acceptance of the revised Terms & Conditions.
        </Text>
        <br />
        <br />
        <h1>Governing Law and Jurisdiction</h1>
        <Text>
          These Terms & Conditions shall be governed by and construed in
          accordance with the laws of the jurisdiction of Maharashtra. Any
          disputes arising out of or in connection with these Terms & Conditions
          shall be subject to the exclusive jurisdiction of the competent courts
          in that jurisdiction.
        </Text>
        <br />
        <br />
        <Text>
          By using the Website, you acknowledge that you have read, understood,
          and agreed to these Terms & Conditions. If you do not agree with any
          part of these Terms & Conditions, you must refrain from using the
          Website.
        </Text>
      </Box>
      <Footer />
    </>
  );
};

export default page;
