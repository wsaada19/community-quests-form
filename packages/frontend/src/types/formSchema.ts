import * as yup from "yup";
import { Material } from "./minecraftMaterials";
import { Objective } from "./questTypes";
import { InferType } from "yup";

export interface RankedReward {
  rank: string;
  experience: number;
  money: number;
  commands: string[];
  items: string[];
  rewardMessage: string;
}


export const defaultQuestConfig: QuestConfig = {
  name: "",
  id: "UniqueQuestID",
  displayItem: Material.NONE,
  worlds: [],
  duration: {
    enabled: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  objectives: [
    {
      type: "mobkill",
      goal: 5,
      constraints: [],
      description: "",
    },
  ],
  rewards: {
    rewardsDisplay: [],
    rewardsLimit: undefined,
    rankedRewards: [
      {
        rank: "1",
        experience: 0,
        money: 0,
        rewardMessage: "",
        commands: [],
        items: [],
      },
    ],
  },
}

const rankedRewardSchema = yup.object({
  rank: yup.string().required("Required"),
  experience: yup.number().optional(),
  money: yup.number().optional(),
  commands: yup.array(yup.string()).optional(),
  items: yup.array(yup.string()).optional(),
  rewardMessage: yup.string().optional(),
});

export const validationSchema = yup.object({
  name: yup.string().required("Required"),
  id: yup.string()
    .required("ID is required")
    .matches(/^\S+$/, "ID cannot contain spaces"),
  displayItem: yup.string().required("Required"),
  worlds: yup.array(yup.string()),
  duration: yup.object({
    enabled: yup.boolean().required("Required"),
    days: yup.number(),
    hours: yup.number(),
    minutes: yup.number(),
    seconds: yup.number(),
  }).required("Required"),
  objectives: yup.array(yup.object({
    type: yup.string().required("Required"),
    goal: yup.number().required("Required"),
    constraints: yup.array(yup.string()),
    description: yup.string(),
  })).required("Required"),
  rewards: yup.object({
    rewardsDisplay: yup.array(yup.string()),
    rewardsLimit: yup.number().optional(),
    rankedRewards: yup.array(rankedRewardSchema),
  }).required("Required"),
});

export type QuestConfig = InferType<typeof validationSchema>;