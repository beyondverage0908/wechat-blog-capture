export interface Dictionary {
  [key: string]: any;
}

declare module "koa" {
  // DefaultContext 可以扩展 context
  interface DefaultContext {
    success: (
      data?: Dictionary | string | number | boolean | null,
      code?: string | number,
      message?: string
    ) => void;
    error: (message?: string, code?: string | number, url?: string) => void;
    compress?: boolean;
  }
  // DefaultState 可以扩展 state
  interface DefaultState {}
}
