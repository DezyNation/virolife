import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import BackendAxios from "@/utils/axios";
import CampaignData from "@/components/campaign/CampaignData";

export async function generateMetadata({ params }) {
  const { id } = params;
  let campaign;
  await BackendAxios.get(`/api/campaign/${id}`)
    .then((res) => {
      campaign = res.data[0];
    })
    .catch((err) => {
      console.log(err);
    });

  return {
    title: campaign?.title,
    openGraph: {
      images: [
        campaign?.file_path
          ? `https://api.virolife.in/${campaign?.file_path}`
          : "https://idea.batumi.ge/files/default.jpg",
        "https://idea.batumi.ge/files/default.jpg",
      ],
    },
  };
}

const CampaignInfo = async ({ params }) => {
  const { id } = params;

  let campaign;
  await BackendAxios.get(`/api/campaign/${id}`)
    .then((res) => {
      campaign = res.data[0];
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <>
      <Navbar />
      <CampaignData campaign={campaign} />
      <Footer />
    </>
  );
};

export default CampaignInfo;
