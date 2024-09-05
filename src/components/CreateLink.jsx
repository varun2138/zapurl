import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import * as Yup from "yup";
import Error from "./Error";
import { QRCode } from "react-qrcode-logo";
import UseFetch from "../hooks/UseFetch";
import { createUrl } from "../db/apiUrls";
import { UrlState } from "../Context";
import { BeatLoader } from "react-spinners";
const CreateLink = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const ref = useRef();
  const [errors, setErrors] = useState({});
  const { user } = UrlState();
  const [formData, setFormData] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  // for displaying the modal  by default to generate the link
  useEffect(() => {
    const modal = document.getElementById("my_modal_3");
    if (longLink) {
      modal.showModal();
    }
    modal.addEventListener("close", () => {
      setSearchParams({});
    });

    return () => {
      modal.removeEventListener("close", () => {});
    };
  }, [longLink, setSearchParams]);

  const schema = Yup.object().shape({
    title: Yup.string().required("title is required"),
    longUrl: Yup.string()
      .required("Long Url is required")
      .url("must be valid url"),
    customUrl: Yup.string(),
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = UseFetch(createUrl, { ...formData, user_id: user?.id });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0]?.id}`);
    }
  }, [data, error]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formData, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (error) {
      const newErrors = {};
      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <div>
      <button
        className="btn w-28 bg-green-700 border-none hover:bg-green-800"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        Create New
      </button>
      <dialog id="my_modal_3" className="modal   ">
        <div className="modal-box bg-gray-950 text-green-100  w-11/12 md:w-5/12    ">
          <form method="dialog" className="mb-0">
            <button className="btn  btn-sm btn-circle btn-ghost text-white absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h1 className="flex justify-start ml-2  text-blue-200 mb-2 text-lg">
            Create new Link
          </h1>

          {formData?.longUrl && (
            <QRCode value={formData?.longUrl} size={120} ref={ref} />
          )}

          <div className="mt-2 flex flex-col gap-4">
            <input
              className="flex justify-start px-2 w-full h-10 bg-gray-950 border border-gray-800 rounded-md outline-none      pr-2 text-white placeholder:text-gray-600 placeholder:text-sm  placeholder:opacity-70  "
              type="text"
              id="title"
              placeholder="Short link's title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <Error message={errors.title} />}
            <input
              className="flex justify-start px-2 w-full h-10 bg-gray-950 border border-gray-800 rounded-md outline-none      pr-2 text-white placeholder:text-gray-600 placeholder:text-sm  placeholder:opacity-70  "
              type="text"
              id="longUrl"
              placeholder="Enter your long URL"
              value={formData.longUrl}
              onChange={handleChange}
            />
            {errors.longUrl && <Error message={errors.longUrl} />}

            <div className="flex flex-row  items-center gap-2  ">
              <p className="text-sm italic font-light text-blue-400">zapurl/</p>
              <input
                className="flex justify-start px-2 w-full h-10 bg-gray-950 border border-gray-800 rounded-md outline-none      pr-2 text-white placeholder:text-gray-600 placeholder:text-sm placeholder:opacity-70  "
                type="text"
                id="customUrl"
                placeholder="Custom Link (optional)"
                value={formData.customUrl}
                onChange={handleChange}
              />
            </div>
            {error && <Error message={error.message} />}

            <div className=" md:flex md:justify-end  w-full lg:h-8   ">
              <motion.div whileTap={{ scale: 0.45 }}>
                <button
                  disabled={loading}
                  onClick={createNewLink}
                  className="btn w-full btn-secondary bg-green-600 text-white border-none hover:bg-green-800"
                >
                  {loading ? (
                    <BeatLoader size={5} color="#000000" />
                  ) : (
                    " Create Link"
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreateLink;
