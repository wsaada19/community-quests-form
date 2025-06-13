import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rtkBaseQuery = fetchBaseQuery({
  baseUrl: getBaseURL(),
});

function getBaseURL(): string {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.info(`Initializing API, URL: ${apiUrl}`);
  if (typeof apiUrl !== "string") {
    const errorMessage = "API URL is not a string";
    console.error("API URL is not a string");
    throw new Error(errorMessage);
  }
  return apiUrl;
}
