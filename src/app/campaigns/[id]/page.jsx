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
    description: campaign?.description,
    openGraph: {
      images: [
        campaign?.file_path
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${JSON.parse(campaign?.file_path)[0]}`
            : "https://idea.batumi.ge/files/default.jpg"
      ]
    }
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
      <CampaignData campaign={campaign} id={id} />
      <Footer />
    </>
  );
};

export default CampaignInfo;
