import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineLogin } from "react-icons/ai";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import UseFetch from "../hooks/UseFetch";
import { login } from "../db/apiAuth.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "../Context.jsx";

const Login = ({ onSwitch }) => {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  // handle input value
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // fetching the data
  const { data, error, loading, fn: fnLogin } = UseFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  //login validations using "yup"
  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("invalid email")
          .required("email is required"),
        password: Yup.string()
          .min(6, "min 6 characters are required")
          .required("password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
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
      <div className="card border border-gray-800 text-white bg-black w-80 shadow-xl">
        <div className="card-body p-4">
          <h1 className="text-green-200 mb-2 font-semibold text-center">
            login to your account
          </h1>
          {error && <Error message={error.message} />}
          <div className="w-11/12 border border-gray-800 rounded-md overflow-hidden text-blue-300   flex items-center justify-start h-10">
            <MdEmail className="w-2/12" />
            <input
              name="email"
              type="email"
              className="w-10/12 h-10 outline-none bg-none border-none bg-black pr-2 text-white placeholder:text-gray-600 placeholder:text-sm  placeholder:opacity-70  "
              placeholder="enter your email address"
              onChange={handleInput}
            />
          </div>
          {errors.email && <Error message={errors.email} />}
          <div className="w-11/12 border border-gray-800 rounded-md overflow-hidden text-blue-300   flex items-center justify-start h-10">
            <RiLockPasswordLine className="w-2/12" />
            <input
              name="password"
              type="password"
              placeholder=" enter your password"
              className="w-10/12 h-10 outline-none bg-none border-none bg-black pr-2 text-white placeholder:text-gray-600 placeholder:text-sm  placeholder:opacity-70 "
              onChange={handleInput}
            />
          </div>
          {errors.password && <Error message={errors.password} />}

          <button
            onClick={handleLogin}
            className="btn  text-green-500 w-4/12 mt-2"
          >
            {loading ? (
              <BeatLoader size={10} color="#57f4b8" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <AiOutlineLogin className="text-white text-lg" />
                Login
              </div>
            )}
          </button>
          <p>
            Don't have an account?{" "}
            <span
              className="text-blue-700 font-bold cursor-pointer hover:underline"
              onClick={onSwitch}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
