import { useEffect } from "react";
import hero from "../assets/image/wishlistbanner.jpg";
import Banner from "../componant/Banner";
import WishlistItems from "../componant/WhislistItems";
import { useNavigate } from "react-router-dom";
import Card from "../componant/Card";
function Wishlist() {
  return (
    <>
      <div
        className="h-[60vh] w-full bg-cover bg-center flex items-center max-w-screen-2xl mx-auto"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className=" p-8 rounded-lg  text-black md:w-1/2 w-full">
          <h1 className="md:text-5xl text-3xl font-bold mb-4">Wishlist</h1>
          <p className="md:text-lg text-sm leading-relaxed">
            Keep track of the courses you love and save them for later. Easily
            access your favorite learning picks anytime, anywhere.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[30px]">
        <div className="py-[30px] px-4 sm:px-10 md:px-24 font-[Manrope] flex flex-col">
          <p className="font-bold text-[18px] leading-[100%] tracking-normal text-[#1C4ED9] pb-2 text-center uppercase">
            Our Wishlist
          </p>
          <h1 className="font-semibold text-[48px] leading-[100%] tracking-normal text-[#292929] pb-2 text-center">
            Save Your Favorite Courses
          </h1>
          <p className="font-normal text-[18px] leading-[100%] tracking-normal text-[#6F6F6F] pb-10 text-center">
            Keep all your favorite courses in one place and come back to learn
            anytime.
          </p>
        </div>

        <WishlistItems />
      </div>
      <div className="py-[30px] px-4 sm:px-10 md:px-24 font-[Manrope] flex flex-col items-center">
        <p className="font-bold text-[18px] leading-[100%] tracking-normal text-[#1C4ED9] pb-2 text-center uppercase">
          Explore Recommended Courses
        </p>
        <h1 className="font-semibold md:text-4xl text-2xl leading-[100%] tracking-normal text-[#292929] pb-2 text-center">
          You Might Also Like
        </h1>
        <p className=" text-sm md:text-xl leading-[100%] max-w-[70%] tracking-normal text-[#6F6F6F] pb-10 text-center">
          Discover personalized course recommendations curated to match your
          interests and learning goals.
        </p>
      </div>
      <div className="">
        <Card />
      </div>
    </>
  );
}

export default Wishlist;
