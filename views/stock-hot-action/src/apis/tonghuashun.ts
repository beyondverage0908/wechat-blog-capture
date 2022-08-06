import http from "./http";

type LiangJiaTargetQuery = {
  monit?: string;
};

/**
 * 获取热门赛道量价关系(已经入库的数据)
 * @returns
 */
export const queryLiangJiaTarget = ({ monit }: LiangJiaTargetQuery) => {
  return http.get("/ths/ljtarget", {
    params: {
      monit,
    },
  });
};

/**
 * 获取热门赛道量价关系(已经入库的数据)
 * 1：监控中 2：已移除监控 3: 暂定
 * @returns
 */
export const updateLiangJiaMonit = (id: string, monit: "1" | "2" | "3") => {
  return http.put("/ths/ljtarget", {
    data: {
      id,
      monit,
    },
  });
};

/**
 * 触发量价分析，并入库
 * @returns
 */
export const triggerLiangJia = () => {
  return http.post("/ths/ljtarget");
};
