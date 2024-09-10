import { apiSlice } from "../api/apiSlice";


export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeroData: builder.query({
            query: (type) => ({
                url: `get-layout/${type}`,
                method: 'GET',
                credentials: 'include'
            })
        }),
        editLayout: builder.mutation({
            query: ({ type, image, title, subTitle, faq, categories }) => ({
                url: `update-layout`,
                method: 'PUT',
                body: { type, image, title, subTitle, faq, categories },
                credentials: 'include'
            })
        }),
    })
})
export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;