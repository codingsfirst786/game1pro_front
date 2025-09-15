// src/Api/Slices/userApi.js
import { apiSlice } from "../apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleLogin: builder.mutation({
      query: (data) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/signup", // match backend route
        method: "POST",
        body: data,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: ({ id, data, isFormData }) => ({
        url: `/update-profile/${id}`,
        method: "PUT",
        body: data,
        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGoogleLoginMutation,
  useRegisterMutation,
  useLoginUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
