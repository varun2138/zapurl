import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUrl, deleteUrl } from "../db/apiUrls";
import { getClicksForUrl } from "../db/apiClicks";
import UseFetch from "../hooks/UseFetch";
import { UrlState } from "../Context";
import { BarLoader, BeatLoader } from "react-spinners";
import { FaRegCopy } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import { FaLink } from "react-icons/fa6";
import LocationStats from "../components/LocationStats";
import DeviceStats from "../components/DeviceStats";

const LinkTo = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();
  const {
    loading,
    data: url,

    fn,
    error,
  } = UseFetch(getUrl, { id, user_id: user?.id });
  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = UseFetch(getClicksForUrl, id);
  const { loading: loadingDelete, fn: fnDelete } = UseFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  const downloadImage1 = async () => {
    try {
      const imageUrl = url?.qr;
      const filename = url?.title || "downloaded-image.png";

      if (!imageUrl) {
        console.error("Image URL is missing");
        return;
      }

      // Fetch the image as a Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create an anchor element and trigger the download
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = filename;

      document.body.appendChild(anchor);
      anchor.click();

      //  remove the anchor and revoke the blob URL
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);

      console.log("Image downloaded:", filename);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };
  const deletionOfUrl = () => {
    fnDelete().then(() => {
      navigate("/dashboard");
    });
  };

  return (
    <div>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      {/* https://zapurl.netlify.app */}

      <div className="flex flex-col gap-8 sm:flex-row justify-between sm:px-12 sm:py-6 ">
        <div className="flex flex-col items-start gap-8 rounded-lg w-4/5 sm:w-3/5 p-8">
          <span className="text-3xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={`https://zap-url.netlify.app/${link}`}
            target="_blank"
            className="text-lg sm:text-2xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
            https://zap-url.netlify.app/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer "
            onClick={async (e) => {
              // Prevent the default action of the anchor tag
              e.preventDefault();

              // Track the click in your database
              try {
                await fnStats(); // Call the function that tracks the click
              } catch (error) {
                console.error("Error tracking click:", error);
              }

              // Redirect to the shortened URL
              window.location.href = `https://zapurl.netlify.app/${link}`;
            }}
          >
            <FaLink className="p-1 text-xl  text-green-400" />
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>
          <div className="flex gap-4 items-start mt-2 mr-8">
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://zapurl.netlify.app/${url?.short_url}`
                )
              }
              className="text-2xl hover:text-blue-400"
            >
              <FaRegCopy />
            </button>

            <button
              onClick={downloadImage1}
              className="text-2xl hover:text-green-800"
            >
              <FaDownload />
            </button>
            <button
              disable={loadingDelete}
              onClick={deletionOfUrl}
              className="text-2xl hover:text-red-600"
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="#ffffff" />
              ) : (
                <RiDeleteBin5Line />
              )}
            </button>
          </div>
          <img
            src={url?.qr}
            className="w-9/12 self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>

        <div className="card bg-black sm:border sm:border-gray-900 w-full sm:mr-6 shadow-xl">
          <div className="card-body">
            <div className="card-actions justify-center">
              <h1 className="text-2xl capitalize mb-4">Statistics</h1>
            </div>
            {stats && stats.length ? (
              <div className="card-actions  ">
                <div className="card rounded-md w-full h-24 border bg-black border-green-950 px-4 py-6">
                  <h1 className="text-xl">Clicks</h1>
                  <p className="text-lg">{stats.length}</p>
                </div>
                <div className=" w-full flex flex-col gap-4  ">
                  <h1 className="text-lg font-mono text-violet-200">
                    Location Data
                  </h1>
                  <LocationStats stats={stats} />
                </div>
                <div className="card w-full ">
                  <h1 className="text-lg font-mono text-violet-200">
                    Device Info
                  </h1>
                  <DeviceStats stats={stats} />
                </div>
              </div>
            ) : (
              <div>
                {loadingStats === false
                  ? "No Statistics yet"
                  : "Loading Statistics.."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTo;
