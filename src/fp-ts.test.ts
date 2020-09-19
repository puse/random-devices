import { either } from "https://cdn.skypack.dev/fp-ts?dts";

Deno.test("either.left", () => {
  const x: Either = either.left("hello");
  console.log(x);
});
