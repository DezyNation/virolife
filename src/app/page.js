'use client'
import Carousel from "@/components/global/Home/Carousel";
import { ChakraBaseProvider } from "@chakra-ui/react";


export default function Home() {
  return (
    <>
      <ChakraBaseProvider>
        <Carousel />
      </ChakraBaseProvider>
    </>
  )
}
