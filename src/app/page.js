'use client'
import Carousel from "@/components/home/Carousel"
import AllCampaigns from "./campaigns/page"
import Footer from "@/components/global/Footer"

export default function Home() {
  return (
    <>
      <Carousel />
      <AllCampaigns />

      <Footer />
    </>
  )
}
