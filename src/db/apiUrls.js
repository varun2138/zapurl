import supabase, { supabaseUrl } from "./supabase";

const getUrls = async (user_id) => {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("cannot get user urls");
  }

  return data;
};
const deleteUrl = async (id) => {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);
  if (error) {
    console.error(error.message);
    throw new Error("cannot get user urls");
  }

  return data;
};

const createUrl = async ({ title, longUrl, customUrl, user_id }, qrcode) => {
  const short_url = Math.random().toString(36).substring(2, 6);
  const filename = `qr-${short_url}`;
  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(filename, qrcode);

  if (storageError) {
    throw new Error(storageError.message);
  }
  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${filename}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ])
    .select();

  //
  if (error) {
    console.error(error.message);
    throw new Error("error while creating url");
  }

  return data;
};

const getLongUrl = async (id) => {
  const { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls")
    .select("id", "original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();
  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }
  return shortLinkData;
};

const getUrl = async ({ id, user_id }) => {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();
  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }
  return data;
};

export { getUrls, deleteUrl, createUrl, getLongUrl, getUrl };
