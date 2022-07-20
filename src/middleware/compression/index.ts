import compress from "koa-compress";
import { constants } from "zlib";

export const useCompress = () => {
  return compress({
    filter: (mineType) => {
      return /text/i.test(mineType);
    },
    threshold: 1024,
    gzip: {
      flush: constants.Z_SYNC_FLUSH,
    },
    deflate: {
      flush: constants.Z_SYNC_FLUSH,
    },
    br: false,
  });
};
