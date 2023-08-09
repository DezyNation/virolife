"use client";
import React, { useEffect, useState } from "react";
import { Box, Image, Stack, Text } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../styles/blog.css";
import Footer from "@/components/global/Footer";
import blogs from "@/utils/blogs/blogs";
import Navbar from "@/components/global/Navbar";

const Post = ({ params }) => {
  const { id, slug } = params;
  const [blogData, setBlogData] = useState({});
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoPlay: true,
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  function fetchBlog() {
    let foundBlog;
    foundBlog = blogs.find((blog) => blog.id == id);
    setBlogData(foundBlog);
  }

  return (
    <>
    <Navbar />
      <Stack
        direction={["column", "row"]}
        minH={"100vh"}
        p={[8, 16, 24]}
        justifyContent={"space-between"}
        bgImage={"/blogbg.png"}
        bgSize={"cover"}
        bgRepeat={"no-repeat"}
        bgPos={["95% 80%", "center"]}
      >
        <Box w={["full", "sm", "xl"]} p={4}>
          <Image src="/blob.png" />
        </Box>
        <Box maxW={["full", "xl", "xl", "3xl"]}>
          <Text
            fontSize={["3xl", "3xl", "4xl"]}
            fontWeight={"bold"}
            color={"#666"}
          >
            {blogData?.title}
          </Text>
          <br />
          <Slider {...settings}>
            {blogData?.slides?.map((slide, key) => (
              <Box key={key}>
                <Text
                  fontSize={["xl", "2xl"]}
                  fontWeight={"semibold"}
                  color={"#666"}
                  pb={6}
                  textTransform={"capitalize"}
                >
                  {slide?.subtitle}
                </Text>
                {slide?.content?.map((content, keyCount)=>(
                  <Text fontSize={["md"]} pb={3} key={keyCount}>{content}</Text>
                  ))
                }
              </Box>
            ))}
          </Slider>
        </Box>
      </Stack>
      <Footer />
    </>
  );
};

export default Post;
