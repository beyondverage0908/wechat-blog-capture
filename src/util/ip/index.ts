import ip from "ip";

// 获取ip
export function getIp() {
  return ip.address();
}
