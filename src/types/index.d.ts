export interface Dictionary {
  [key: string]: any;
}

declare module "koa" {
  // DefaultContext 可以扩展 context
  interface DefaultContext {
    success: (data?: Dictionary, code?: string, message?: string) => void;
    error: (code?: string, message?: string) => void;
  }
  // DefaultState 可以扩展 state
  interface DefaultState {}
}
