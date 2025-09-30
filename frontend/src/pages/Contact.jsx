import Banner from "../componant/Banner";
import ContactForm from "../componant/ContactForm";
import map from "../assets/image/contactmap.png";
import hero from "../assets/image/contactbanner.png";
import { useEffect } from "react";

function Contact() {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        className="h-[60vh] w-full bg-cover bg-center flex items-center max-w-screen-2xl mx-auto"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className=" p-8 rounded-lg  text-black md:w-1/2 w-full">
          <h1 className="md:text-5xl text-3xl font-bold mb-4">Contact Us</h1>
          <p className="md:text-lg text-sm leading-relaxed">
            Have questions or need support? We're here to help! Reach out to our
            team for assistance, feedback, or more information—we'd love to hear
            from you and guide you on your learning journey."
          </p>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <ContactForm />

        <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d27556.18679835932!2d78.00811094999999!3d30.3076283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1758279339462!5m2!1sen!2sin"
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default Contact;
