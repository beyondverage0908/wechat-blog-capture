/**
 * 量价关系
 */

import mongoose from "mongoose";
import { t_ths_liangjia } from "@/mongodb/model";
import { LiangJiaSchema } from "@/mongodb/schema/tonghuashun";

const saveLiangJiaData = () => {
  const Model = mongoose.model(t_ths_liangjia, LiangJiaSchema);
};
