import { compile, run } from "@mdx-js/mdx";
import * as runtime from 'react/jsx-runtime'


const fetchAndParseMDX = async (currentSlide: number) => {
      try {
        const response = await fetch(`http://0.0.0.0:5000/presentation-mdx/${currentSlide}`, {
          method: "GET",
          headers: {
            "Content-Type": "text/plain",
          },
        });
        console.log(response);
        const text: string = await response.text()
        console.log(text);
        if (text.match(/Slide not found/)) {
          return "Slide not found"
        }
        const compiled = await compile(text, {...runtime, jsx: false, development: false, outputFormat: 'function-body', useDynamicImport: true })
        console.log(compiled);
        const {default: evaluated} = await run(compiled, { ...runtime})
        console.log(evaluated);
        return evaluated;
      } catch (error) {
        console.error(error);
      }
    }

export default fetchAndParseMDX;