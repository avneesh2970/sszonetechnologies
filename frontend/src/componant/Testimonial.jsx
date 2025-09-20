import React from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import Heading from "../pages/Heading";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Emma Rodriguez",
      address: "Barcelona, Spain",
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      rating: 5,
      review:
        "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that QuickStay provides.",
    },
    {
      id: 2,
      name: "Liam Johnson",
      address: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      rating: 4,
      review:
        " and the hotels were absolutely top-notch. Highly recommended!",
    },
    {
      id: 3,
      name: "Sophia Lee",
      address: "Seoul, South Korea",
      image:
        "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200",
      rating: 5,
      review:
        "Amazing service! I always find the best luxury accommodations through QuickStay. Their recommendations never disappoint! find the best luxury accommodations through QuickStay. Their recommendations never disappoint",
    },
  ];

  return (
    <>
    <div className="max-w-screen-2xl mx-auto bg-slate-50 ">
      <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>
      <Heading
        title="Testimonials"
        subTitle="What Our Students Say About Us"
        content="Hear real stories and experiences from students who’ve
                transformed their careers with our courses"
      />

      <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none "></div>
        <div className="marquee-inner transform-gpu md:min-w-[200%] min-w-[400%] pb-5  flex  justify-center gap-6 w-full">
          {[...testimonials, ...testimonials].map((testimonial) => (
            <div
              key={testimonial.id}
              className=" p-6 rounded-xl shadow-md max-w-sm w-full sm:w-[400px]"
            >
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <p className="font-playfair text-xl">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4">
                <div className="flex justify-center items-center gap-1 text-amber-300">
                  <FaStar className="text-lg" />
                  <FaStar className="text-lg" />
                  <FaStar className="text-lg" />
                  <FaStar className="text-lg" />
                  <FaRegStarHalfStroke className="text-lg" />
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
      </div>

      </div>
    </>
  );
};

export default Testimonial;
