import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loggedOut } from "../auth/authSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { BaseApiURL } from "@/constants/ApiUrl";

const baseQuery = fetchBaseQuery({
  baseUrl: BaseApiURL,
  credentials: "include",
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const currencyQuery = fetchBaseQuery({
  baseUrl: "https://v6.exchangerate-api.com/v6/6a34eee14b9f656fb49f5f89/latest",
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions, queryType = "currency") => {
  const selectedQuery = queryType === "currency" ? currencyQuery : baseQuery;
  let result = await selectedQuery(args, api, extraOptions);

  if (result?.error) {
    const { status = 500 } = result.error;
    if (status === "FETCH_ERROR") {
      alert("Failed to fetch");
    } else if (status === 406) {
      api.dispatch(loggedOut());
    } else if (status === 502) {
      try {
        console.log("sending refresh token");
        const refreshResult: any = await selectedQuery(
          "/refreshToken",
          api,
          extraOptions
        );

        if (refreshResult?.data) {
          result = await selectedQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        api.dispatch(loggedOut());
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (_builder) => ({}),
});
