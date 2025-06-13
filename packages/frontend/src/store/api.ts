import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "./rtkBaseQuery";
import { GetConfigsResponseBody } from "@community-quests-form/core/types/configs";

enum RTKQueryTag {
  Config = "Config",
}

export const interviewProjectApi = createApi({
  reducerPath: "interviewProjectApi",
  baseQuery: rtkBaseQuery,
  tagTypes: Object.values(RTKQueryTag),
  endpoints: (builder) => ({
    getConfigs: builder.query<GetConfigsResponseBody, void>({
      query: () => "configs",
      providesTags: [RTKQueryTag.Config],
    }),
  }),
});

export const { useGetConfigsQuery } = interviewProjectApi;
