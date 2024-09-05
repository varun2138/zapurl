import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { UrlState } from "../Context";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();

  // fun for switching the signup and login components
  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(`/dashboard/${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, loading]);
  return (
    <>
      <div className="mt-10 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">
          {longLink ? "Hold up! let's login first" : "Login/Signup"}
        </h1>
        <div>
          {isLogin ? (
            <Login onSwitch={handleSwitch} />
          ) : (
            <SignUp onSwitch={handleSwitch} />
          )}
        </div>
      </div>
    </>
  );
};

export default Auth;
