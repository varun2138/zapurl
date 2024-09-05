import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { CiFilter } from "react-icons/ci";
import UseFetch from "../hooks/UseFetch";
import { getUrls } from "../db/apiUrls";
import { getUrlClicks } from "../db/apiClicks";
import { UrlState } from "../Context";
import Error from "../components/Error";
import LinkCard from "../components/LinkCard";
import CreateLink from "../components/CreateLink";

const Dashboard = () => {
  const [searchQuery, setSearchquery] = useState("");
  const { user } = UrlState();
  const {
    loading,
    error,
    data: urls,
    fn: UrlsFn,
  } = UseFetch(getUrls, user?.id);

  //

  const {
    loading: loadingClicks,
    data: clicks,
    fn: ClicksFn,
  } = UseFetch(
    getUrlClicks,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    UrlsFn();
  }, []);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) ClicksFn();
  }, [urls?.length]);

  return (
    <div className=" flex flex-col justify-center   gap-8">
      <div className="flex justify-center items-center">
        {(loading || loadingClicks) && (
          <BarLoader width="88%" color="#37b7d7" />
        )}
      </div>
      <div className="cards flex flex-wrap flex-row justify-center   gap-8   ">
        <div className="  border border-gray-600 card bg-gray-950 w-5/12 h-32  shadow-xl">
          <div className="card-body">
            <h2 className="card-title ">Total Links</h2>
            <p>{urls?.length || 0} </p>
          </div>
        </div>
        <div className="card border border-gray-600 bg-gray-950 w-5/12 h-32 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Clicks</h2>
            <p>{clicks?.length | 0} </p>
          </div>
        </div>
      </div>
      <div className="flex mx-auto justify-between items-center w-10/12  ">
        <h1 className="text-2xl font-extrabold">My Links</h1>
        <div className="btn btn-secondary w-28  font-bold text-gray-950 ">
          <CreateLink />
        </div>
      </div>
      <div className="relative mx-auto w-10/12  ">
        <input
          className="input input-bordered rounded-md input-sm w-full  "
          type="text"
          placeholder="filter links..."
          value={searchQuery}
          onChange={(e) => setSearchquery(e.target.value)}
        />
        <CiFilter className="absolute text-green-200 top-2 right-2   text-xl " />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, index) => (
        <LinkCard key={index} url={url} fetchUrls={UrlsFn} />
      ))}
    </div>
  );
};

export default Dashboard;
