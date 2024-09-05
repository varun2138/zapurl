import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UrlState } from "../Context";
import { BarLoader } from "react-spinners";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();
  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading]);

  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;

  if (isAuthenticated) return children;
};

export default RequireAuth;
