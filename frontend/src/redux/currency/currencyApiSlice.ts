import { apiSlice } from "../app/api";

export const currencyApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        fetchCurrencyRate:builder.query({
            query:({countryCode})=>({
                url:`/${countryCode}`,
                method:"GET",
                queryType:"currency"
            })
        })
    })
})


export const { useFetchCurrencyRateQuery } = currencyApiSlice

