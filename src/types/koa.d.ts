import { Context } from "koa";
import { Dictionary } from ".";

type ResponseType = {
  success: (data: Dictionary, message?: string, code?: string) => void;
  fail: (message?: string, code?: string) => void;
};

export type CtContext = Context & ResponseType;
