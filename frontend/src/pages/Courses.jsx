import { useEffect } from "react";
import hero from "../assets/image/coursesbanner.jpg";
import Card from "../componant/Card";
import Heading from "./Heading";

function Courses() {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <>
    <div className="max-w-screen-2xl mx-auto">

      <div
        className="h-[60vh] w-full bg-cover bg-center flex items-center "
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className=" p-8 rounded-lg  text-black md:w-1/2 w-full">
          <h1 className="md:text-5xl text-3xl font-bold mb-4">Courses</h1>
          <p className="md:text-lg text-sm leading-relaxed">
            Discover our wide selection of expert-led courses designed to boost
            your skills and career growth. Start learning today and take the
            next step toward your success!
          </p>
        </div>
      </div>

       <Heading
          title="POPULAR COURSES"
          subTitle="Choose Our Top Courses"
          content="Discover a world of knowledge and opportunities with our online
                    education platform pursue a new career."
        />
      
        <Card />
      </div>
    </>
  );
}

export default Courses;
