import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import UseFetch from "../hooks/UseFetch";
import { getLongUrl } from "../db/apiUrls";
import { storeClicks } from "../db/apiClicks";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const { loading, data, fn } = UseFetch(getLongUrl, id);
  const { loading: loadingStats, fn: fnStats } = UseFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);
  if (loading || loadingStats) {
    return (
      <div className="flex justify-center items-center flex-col w-10/12">
        <BarLoader width={"90%"} color="#ffffff" />
        <br />
        <h1> Redirecting........</h1>
      </div>
    );
  }
  return null;
};

export default RedirectLink;
