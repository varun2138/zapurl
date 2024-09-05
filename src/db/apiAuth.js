import supabase, { supabaseUrl } from "./supabase.js";

const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getCurrentUser = async () => {
  const { data: session, error } = await supabase.auth.getSession();
  //return null: If no session is found, the function returns null, indicating that there is no currently authenticated user.
  if (!session.session) return null;
  if (error) throw new Error(error.message);
  // If a session exists and contains a user, this returns the user object.
  return session.session?.user;
};

const signup = async ({ email, password, username, profile_pic }) => {
  // Generate a unique filename for the profile picture
  const fileName = `dp-${username.split(" ").join("-")}-${Math.random()}`;
  // Upload the profile picture to Supabase storage
  const { error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profile_pic);
  if (storageError) throw new Error(storageError.message);
  // Sign up the user with email and password, and include additional user metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    /* The options.data object allows you to store additional metadata
     about the user when they sign up.
      This metadata is stored alongside the user's authentication details
       and can include any extra information you want to associate
        with the user (e.g., username, profile_pic URL, etc.).
    */
    options: {
      data: {
        username,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
};
const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
export { login, getCurrentUser, signup, logout };
