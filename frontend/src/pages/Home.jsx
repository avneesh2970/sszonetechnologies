import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BlogCard from "../componant/BlogCard";
import Card from "../componant/Card";
import Testimonial from "../componant/Testimonial";
import WhyChooseUs from "../componant/WhyChooseUs";
import Faq from "../componant/Faq";
import Hero from "../componant/Hero";
import Heading from "./Heading";

function Home() {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto ">
      <Hero />
      
       <Heading
          title="POPULAR COURSES"
          subTitle="Choose Our Top Courses"
          content="Discover a world of knowledge and opportunities with our online
                    education platform pursue a new career."
        />
      <Card />

      <Link to="/courses">
        <button className="bg-blue-600 hover:bg-blue-700 my-5 text-white px-6 py-3 rounded-lg flex items-center justify-self-center gap-2 transition  cursor-pointer duration-300 ease-in-out  hover:scale-105 ">
          Explore All Courses <ArrowRight size={20} />
        </button>
      </Link>

      <WhyChooseUs />

      <BlogCard />

      <Testimonial />

      <Faq />

    
    </div>
  );
}

export default Home;
