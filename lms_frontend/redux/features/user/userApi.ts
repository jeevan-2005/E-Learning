import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "/user/update-user-avatar",
        method: "PUT",
        body: {avatar},
        credentials: "include" as const,
      }),
    }),
    editProfile: builder.mutation({
      query: ({name}) => ({
        url: "/user/update-user-info",
        method: "PUT",
        body: {name},
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useUpdateAvatarMutation, useEditProfileMutation } = userApi;