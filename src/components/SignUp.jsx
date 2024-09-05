import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import Error from "./Error";
import { BeatLoader } from "react-spinners";
import UseFetch from "../hooks/UseFetch";
import { signup } from "../db/apiAuth.js";
import { UrlState } from "../Context";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
const SignUp = ({ onSwitch }) => {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    profile_pic: null,
  });

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  // fetching data
  const { data, error, loading, fn: fnSignup } = UseFetch(signup, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    fetchUser();
  }, [error, loading]);

  // signup handling
  const handleSignUp = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("email is required"),
        password: Yup.string()
          .min(6, "password must be minimum 6 characters")
          .required("password is required"),
        username: Yup.string().required("username is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  return (
    <div>
      <div className="mb-4 card border border-gray-800 text-white bg-black w-80 shadow-xl">
        <div className="card-body p-4">
          <h1 className="text-green-200 mb-2 font-semibold text-center">
            Create your account
          </h1>
          {error && <Error message={error.message} />}
          <div className="w-11/12 border border-gray-800 rounded-md overflow-hidden text-blue-300   flex items-center justify-start h-10">
            <MdEmail className="w-2/12" />
            <input
              name="email"
              type="email"
              placeholder="enter your email address"
              className="w-10/12 h-10 outline-none bg-none border-none bg-black pr-2 text-white placeholder:text-gray-600 placeholder:text-sm  placeholder:opacity-70  "
              onChange={handleInput}
            />
          </div>
          {errors.email && <Error message={errors.email} />}
          <div className="w-11/12 border border-gray-800 rounded-md overflow-hidden text-blue-300   flex items-center justify-start h-10">
            <RiLockPasswordLine className="w-2/12" />
            <input
              name="password"
              type="password"
              placeholder="add your password"
              className="w-10/12 h-10 outline-none bg-none border-none bg-black pr-2 text-white placeholder:text-gray-600 placeholder:text-sm  placeholder:opacity-70 "
              onChange={handleInput}
            />
          </div>
          {errors.password && <Error message={errors.password} />}

          <div className="w-11/12 border border-gray-800 rounded-md overflow-hidden text-blue-300   flex items-center justify-start h-10">
            <FaUser className="w-2/12" />
            <input
              name="username"
              type="text"
              placeholder="add your username"
              className=" w-10/12 h-10 outline-none bg-none border-none bg-black pr-2 text-white placeholder:text-gray-600 placeholder:text-sm  placeholder:opacity-70 "
              onChange={handleInput}
            />
          </div>
          {errors.username && <Error message={errors.username} />}

          <div className=" flex flex-col gap-1   ">
            <p className="text-violet-300">Avatar : </p>
            <input
              name="profile_pic"
              type="file"
              accept="image/"
              className="file-input h-8  file-input-secondary text-violet-200 bg-black w-11/12 max-w-xs"
              onChange={handleInput}
            />
          </div>
          {errors.profile_pic && <Error message={errors.profile_pic} />}

          <button
            onClick={handleSignUp}
            className="btn  text-green-500 w-5/12 mt-2"
          >
            {loading ? (
              <BeatLoader size={10} color="#57f4b8" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaSignInAlt className="text-white text-lg" />
                Signup
              </div>
            )}
          </button>
          <p>
            Already have an account?{" "}
            <span
              className="text-blue-700 font-bold cursor-pointer hover:underline"
              onClick={onSwitch}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
