import { useMemo } from "react";
import { Control, useWatch } from "react-hook-form";
import type { QuestConfig } from "../../types/formSchema";
import { getQuestType, NoConstraintQuests, QuestType } from "../../types/questTypes";
import { useCustomName } from "../../providers/CustomNameProvider";

interface UseQuestConfigProps {
  control: Control<QuestConfig>;
}

export function useQuestConfig({ control }: UseQuestConfigProps) {
  const watchedValue = useWatch({ control });
  const { customName } = useCustomName();

  const getType = (index: number) => {
    return customName[index] ? "customNames" : getQuestType(watchedValue.objectives[index].type as QuestType);
  };

  const getEntities = (index: number) => {
    const objective = watchedValue.objectives[index];
    if (Object.values(NoConstraintQuests).includes(objective.type as QuestType)) {
      return null;
    }
    return objective.constraints
      ?.map((entity) => {
        return `      - ${entity}`;
      })
      .join("\n");
  };

  const getCommands = (commands: string[]) => {
    return commands
      ?.map((command) => {
        return `      - ${command}`;
      })
      .join("\n");
  };

  const formatDuration = (duration: NonNullable<QuestConfig['duration']>) => {
    if (!duration.enabled) return "";
    const parts = [];
    if (duration.days) parts.push(`${duration.days}d`);
    if (duration.hours) parts.push(`${duration.hours}h`);
    if (duration.minutes) parts.push(`${duration.minutes}m`);
    if (duration.seconds) parts.push(`${duration.seconds}s`);
    return parts.join("");
  };

  const yamlConfig = useMemo(() => {
    return `Quests:
  ${watchedValue.id}:
    displayName: "${watchedValue.name}"${
      watchedValue.displayItem && watchedValue.displayItem !== "none"
        ? `\n    displayItem: ${watchedValue.displayItem}`
        : ""
    }${
      watchedValue.worlds && watchedValue.worlds.length > 0
        ? `\n    worlds:\n${watchedValue.worlds.map(world => `      - ${world}`).join('\n')}`
        : ""
    }${
      watchedValue.duration?.enabled && watchedValue.duration
        ? `\n    questDuration: "${formatDuration(watchedValue.duration)}"`
        : ""
    }
    objectives:${watchedValue.objectives
      .map(
        (objective, index) => {
          const entities = getEntities(index);
          return `
    - type: ${objective.type}
      description: "${objective.description}"
      goal: ${objective.goal}${
            entities
              ? `\n      ${getType(index)}:\n${entities}`
              : ""
          }`;
        }
      )
      .join("")}
    rewards:${
      watchedValue.rewards.rewardsDisplay?.length > 0
        ? `\n    rewardsDisplay:\n${watchedValue.rewards.rewardsDisplay.map(msg => `      - "${msg}"`).join('\n')}`
        : ""
    }${
      watchedValue.rewards.rewardsLimit
        ? `\n    rewardsLimit: ${watchedValue.rewards.rewardsLimit}`
        : ""
    }${
      Object.keys(watchedValue.rewards.rankedRewards).length > 0
        ? `\n      rankedRewards:${
            watchedValue.rewards.rankedRewards
              .map((reward) => {
                const rewardLines = [
                  `        "${reward.rank}":`,
                  reward.experience ? `        experience: ${reward.experience}` : null,
                  reward.money ? `        money: ${reward.money}` : null,
                  reward.commands?.length ? `        commands:\n${getCommands(reward.commands).split('\n').map(line => `          ${line.trim()}`).join('\n')}` : null,
                  reward.items?.length ? `        items:\n${reward.items.map(item => `          - ${item}`).join('\n')}` : null,
                  reward.rewardMessage ? `        rewardMessage: "${reward.rewardMessage}"` : null
                ].filter(Boolean).join('\n');
                return `\n${rewardLines}`;
              })
              .join("")}`
        : ""
    }`;
  }, [watchedValue, customName]);

  return {
    yamlConfig,
    watchedValue,
  };
}
