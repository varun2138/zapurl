import React from "react";
import { Link } from "react-router-dom";
import { FaRegCopy } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import UseFetch from "../hooks/UseFetch";
import { deleteUrl } from "../db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url = [], fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const filename = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
  };
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

  const { loading: loadingDelete, fn: fnDelete } = UseFetch(deleteUrl, url?.id);
  const deletionOfUrl = () => {
    fnDelete().then(() => {
      fetchUrls();
    });
  };
  return (
    <div className="mx-auto mb-2 w-10/12 flex flex-col md:flex-row gap-5 border p-4 bg-black rounded-lg">
      <img
        src={url?.qr}
        className="h-32 object-contain ring ring-blue-600 self-start "
        alt="qr-code"
      />
      <Link className="flex flex-col flex-1" to={`/link/${url?.id}`}>
        <span className="text-xl md:text-2xl capitalize flex flex-1 font-bold hover:underline hover:text-green-200 cursor-pointer">
          {url?.title}
        </span>
        <span className="text-lg md:text-xl text-blue-400 font-semibold hover:underline cursor-pointer">
          https://zapurl.vercel.app/
          {url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className="flex    gap-1 cursor-pointer hover:underline">
          {url?.original_url}
        </span>
        <span className="flex flex-1 items-end font-extralight text-sm text-green-200 ">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-4 items-start mt-2 mr-8">
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              `https://zapurl.vercel.app/${url?.short_url}`
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
        <button onClick={deletionOfUrl} className="text-2xl hover:text-red-600">
          {loadingDelete ? (
            <BeatLoader size={5} color="#ffffff" />
          ) : (
            <RiDeleteBin5Line />
          )}
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
