import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// https://spinwheelgamebackend-production.up.railway.app/api/v1/

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});
