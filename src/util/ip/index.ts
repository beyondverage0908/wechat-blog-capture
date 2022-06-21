import os from "os";

// 获取ip
export function getIp() {
  const networkInterfaces = os.networkInterfaces();
  return networkInterfaces.eth1!![0].address;
}
