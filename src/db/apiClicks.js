import supabase from "./supabase";
import { UAParser } from "ua-parser-js";

const getUrlClicks = async (url_ids) => {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", url_ids);
  if (error) {
    console.error(error.message);
    throw new Error("cannot get user clicks");
  }

  return data;
};

const parser = new UAParser();
const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";
    const response = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await response.json();

    await supabase.from("clicks").insert({
      url_id: id,
      country: country,
      city: city,
      device: device,
    });
    window.location.href = originalUrl;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getClicksForUrl = async (url_id) => {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);
  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
};
export { getUrlClicks, storeClicks, getClicksForUrl };
