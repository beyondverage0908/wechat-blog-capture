import server from "koa-static";
import path from "path";

export const useStatic = () => {
  return server(path.resolve(process.cwd(), "static"), {
    index: false,
    hidden: false,
    defer: false,
  });
};
