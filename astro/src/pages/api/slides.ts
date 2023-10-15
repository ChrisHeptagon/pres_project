import type { APIRoute } from "astro";
import {bundleMDX} from 'mdx-bundler'

export const GET: APIRoute = async () => {
    const fetchAndParseMDX = async () => {
        const response = await fetch(`http://0.0.0.0:5000/presentation-mdx`, {
          method: "GET",
          headers: {
            "Content-Type": "text/plain",
          },
        });
        console.log(response);
        const text: string = await response.text();
        const split_text = text.split('(())```splitpoint```(())')
        const slideCount = split_text.length;
        console.log(split_text);
        const text_processor = split_text.map(async (text) => {
          const result = await bundleMDX({source: text});
          const {code, frontmatter} = result;
          return {code, frontmatter};
        })
        const slides = await Promise.all(text_processor);
        return { slideCount, slides };
    }
    const { slideCount, slides } = await fetchAndParseMDX();
    return new Response(
      JSON.stringify({
        slideCount,
        slides,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
}

