import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import BackendAxios, { DefaultAxios } from "@/utils/axios";
import CampaignData from "@/components/campaign/CampaignData";
import ProductData from "@/components/campaign/ProductData";

export async function generateMetadata({ params }) {
  const { id } = params;
  let campaign;
  await BackendAxios.get(`/api/product/${id}`)
    .then((res) => {
      campaign = res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return {
    title: campaign?.name,
    description: campaign?.description,
    openGraph: {
      images: [
        campaign?.images
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
              JSON.parse(campaign?.images)[0]
            }`
          : "https://idea.batumi.ge/files/default.jpg",
      ],
    },
  };
}

const CampaignInfo = async ({ params }) => {
  const { id } = params;

  let campaign;
  await DefaultAxios.get(`/api/product/${id}`)
    .then((res) => {
      campaign = res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <>
      <Navbar />
      <ProductData campaign={campaign} />
      <Footer />
    </>
  );
};

export default CampaignInfo;
