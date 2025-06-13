export type Objective = {
  type: string;
  goal: number;
  constraints?: string[];
  customNames?: string[];
  description?: string;
};

export const MobQuests = {
  MOBKILL: "mobkill",
  CATCHFISH: "catchfish",
  PROJECTILEKILL: "projectilekill",
  TAME: "tame",
  MILKCOW: "milkcow",
  PLAYERKILL: "playerkill",
} as const;

export const MaterialQuests = {
  BLOCKBREAK: "blockbreak",
  BLOCKPLACE: "blockplace",
  CRAFTITEM: "craftitem",
  FURNACE: "furnace",
  CONSUMEITEM: "consumeitem",
  ENCHANTITEM: "enchantitem",
  DONATE: "donate"
} as const;

export const NoConstraintQuests = {
  CARVEPUMPKIN: "carvepumpkin",
  MONEYQUEST: "money",
  LEVELQUEST: "level",
  XPQUEST: "experience",
  DISTANCE: "distance",
  PLAYERKILL: "playerkill",
  COMMAND: "command",
} as const;

export const PotionQuests = {
  BREW_POTION: "brewpotion",
//   DRINK_POTION: "drink_potion",
} as const;


export const allQuests = [...Object.values(MobQuests), ...Object.values(MaterialQuests), ...Object.values(PotionQuests), ...Object.values(NoConstraintQuests)];

export const getQuestType = (quest: QuestType) => {
    console.log(quest);
    if(Object.values(MobQuests).includes(quest as any)) {
        return "entities";
    }
    if(Object.values(MaterialQuests).includes(quest as any)) { 
        return "materials";
    }
    if(Object.values(PotionQuests).includes(quest as any)) {
        return "potions";
    }
    if(Object.values(NoConstraintQuests).includes(quest as any)) {
        return "no_constraints";
    }
}

export type QuestType = (typeof allQuests)[number];