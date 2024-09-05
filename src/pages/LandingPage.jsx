import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState("");

  const handleUrl = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth/?createNew=${longUrl}`);
  };
  return (
    <div className="flex flex-col items-center ">
      <h2 className="  bg-gradient-to-r from-fuchsia-100 to-neutral-900 bg-clip-text text-transparent my-16 sm:my-24  text-3xl sm:text-5xl lg:text-6xl w-10/12 text-center font-bold m-auto ">
        Simplify your links, amplify your reach.
      </h2>

      <form
        onSubmit={handleUrl}
        className=" flex w-11/12 flex-col sm:flex-row gap-2 sm:w-2/4     "
      >
        <input
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          type="text"
          placeholder="Shorten your URL in seconds—enter it here..."
          className="input input-bordered w-full sm:max-w-lg sm:ml-10 bg-gray-950    "
        />
        <motion.div whileTap={{ scale: 0.85 }}>
          <button className="btn w-full btn-secondary bg-green-600 text-white border-none hover:bg-green-800">
            Shorten!
          </button>
        </motion.div>
      </form>
      <div className="   flex justify-center items-center  w-full  ">
        <img
          src="/image.png"
          alt=""
          className="  h-full  w-10/12 my-11 md:px-11"
        />
      </div>

      <div className="join join-vertical w-full  ">
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title text-md sm:text-lg font-medium text-green-100">
            What is a URL shortener?
          </div>
          <div className="collapse-content">
            <p>
              A URL shortener is a tool that takes a long URL and turns it into
              a shorter, more manageable one that redirects to the original
              link.
            </p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title text-md sm:text-lg font-medium text-green-100">
            How do I shorten a URL?
          </div>
          <div className="collapse-content">
            <p>
              Simply paste your long URL into the input box above and click the
              "Shorten" button. Your short link will be generated instantly.
            </p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title text-md sm:text-lg font-medium text-green-100">
            Can I customize my shortened URL?
          </div>
          <div className="collapse-content">
            <p>
              Yes! You can create a custom alias for your shortened URL by
              entering your desired text in the customization field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
