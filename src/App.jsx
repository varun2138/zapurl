import React from "react";
import { Routes } from "./Routes/Routes";
import { RouterProvider } from "react-router-dom";
import UrlProvider from "./Context";

const App = () => {
  return (
    <div data-theme="night" className="bg-black">
      <UrlProvider>
        <RouterProvider router={Routes} />
      </UrlProvider>
    </div>
  );
};

export default App;
