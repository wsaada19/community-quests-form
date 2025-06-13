import { parse } from "yaml";
import { QuestConfig, RankedReward } from "../../types/formSchema";
import { Material } from "../../types/minecraftMaterials";
import { NoConstraintQuests } from "../../types/questTypes";

interface ParsedDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseDuration(durationStr: string): ParsedDuration {
  const duration: ParsedDuration = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const matches = durationStr.match(/(\d+)d|(\d+)h|(\d+)m|(\d+)s/g) || [];
  matches.forEach((match: string) => {
    const value = parseInt(match.slice(0, -1));
    const unit = match.slice(-1);
    switch (unit) {
      case 'd': duration.days = value; break;
      case 'h': duration.hours = value; break;
      case 'm': duration.minutes = value; break;
      case 's': duration.seconds = value; break;
    }
  });
  
  return duration;
}

function normalizeMaterial(material: string): Material {
  const upperMaterial = material.toUpperCase();
  return Object.values(Material).find(m => m.toUpperCase() === upperMaterial) || Material.NONE;
}

function normalizeEntity(entity: string): string {
  return entity.toUpperCase();
}

export function parseQuestConfig(yamlString: string): Partial<QuestConfig> {
  try {
    const parsed = parse(yamlString);
    const questId = Object.keys(parsed.Quests)[0];
    const quest = parsed.Quests[questId];

    if (!quest) {
      throw new Error("Invalid quest config: No quest found");
    }

    const config: Partial<QuestConfig> = {
      id: questId,
      name: quest.displayName,
      displayItem: quest.displayItem ? normalizeMaterial(quest.displayItem) : Material.NONE,
      worlds: quest.worlds || [],
      objectives: [],
      rewards: {
        rewardsDisplay: quest.rewards?.rewardsDisplay || [],
        rewardsLimit: quest.rewards?.rewardsLimit,
        rankedRewards: [],
      },
    };

    // Parse duration if present
    if (quest.questDuration) {
      const duration = parseDuration(quest.questDuration);
      config.duration = {
        enabled: true,
        ...duration,
      };
    }

    // Parse objectives
    if (quest.objectives) {
      config.objectives = quest.objectives.map((obj: any) => {
        const objective: any = {
          type: obj.type,
          goal: obj.goal,
          description: obj.description || "",
          constraints: [],
        };

        // Handle constraints based on quest type
        if (!Object.values(NoConstraintQuests).includes(obj.type)) {
          if (obj.entities) {
            objective.constraints = obj.entities.map(normalizeEntity);
          } else if (obj.materials) {
            objective.constraints = obj.materials.map(normalizeEntity);
          } else if (obj.customNames) {
            objective.constraints = obj.customNames;
          }
        }

        return objective;
      });
    }

    // Parse ranked rewards
    if (quest.rewards?.rankedRewards) {
      const rankedRewards: RankedReward[] = [];
      Object.entries(quest.rewards.rankedRewards).forEach(([rank, reward]: [string, any]) => {
        rankedRewards.push({
          rank,
          experience: reward.experience || 0,
          money: reward.money || 0,
          commands: reward.commands || [],
          items: reward.items || [],
          rewardMessage: reward.rewardMessage || "",
        });
      });
      config.rewards!.rankedRewards = rankedRewards;
    }

    return config;
  } catch (err) {
    throw new Error(`Failed to parse quest config: ${err instanceof Error ? err.message : String(err)}`);
  }
} 