"use client";
import Carousel from "@/components/home/Carousel";
import AllCampaigns from "./campaigns/page";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Carousel />
      <AllCampaigns showNavbar={false} />
    </>
  );
}
