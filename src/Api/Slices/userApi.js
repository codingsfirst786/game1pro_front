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
        url: "/register",
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

    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, data }) => ({
        url: `/reset-password/${token}`,
        method: "POST",
        body: data,
      }),
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
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
