"use client";

import Maps from "../components/maps/maps";
import ItemSlider from "../components/slider/ItemSlider";
import CircleCarousel from "../components/animation-item/AnimationItem";
import Chatbot from "../components/chatbot/Chatbot";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import AllServices from "../components/all-services/AllServices";
import ScrollToTopButton from "../components/scroll-top/ScrollTop";

export default function Home() {
  return (
    <>
      <Header />
      <ItemSlider />
      <Chatbot />
      <Maps />
      <CircleCarousel />
      <AllServices />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
