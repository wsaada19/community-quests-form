import { Button, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import "../objectives/ObjectiveForm.css";
import { Control, Controller, useFieldArray } from "react-hook-form";
import TextFieldButton from "../../components/TextFieldButton";
import { QuestConfig } from "../../types/formSchema";

interface RewardsProps {
  control: Control<QuestConfig>;
}

interface RewardProps {
  index: number;
  removeReward: (index: number) => void;
  control: Control<QuestConfig>;
}

export function Rewards({ control }: RewardsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rewards.rankedRewards",
  });

  const addReward = () => {
    const existingRanks = fields.map(field => field.rank);
    let nextRank = "1";
    while (existingRanks.includes(nextRank)) {
      nextRank = (parseInt(nextRank) + 1).toString();
    }

    append({
      rank: nextRank,
      commands: [],
      items: [],
      money: 0,
      experience: 0,
      rewardMessage: "",
    });
  };

  return (
    <div>
      <div className="rewards-header">
        <div className="fields-container">
          <Controller
            control={control}
            name="rewards.rewardsDisplay"
            render={({ field }) => (
              <TextFieldButton
                label="Rewards Display"
                onChange={(values) => field.onChange(values)}
                sx={{ width: "100%" }}
                tooltip="This list of messages will be used to display the rewards to the player in the GUIs and chat messages."
              />
            )}
          />
          <Controller
            control={control}
            name="rewards.rewardsLimit"
            render={({ field }) => (
              <Tooltip title="This is the lowest rank someone can achieve that will receive rewards. Useful when setting rewards for all memebers.">
              <TextField
                type="number"
                size="small"
                label="Rewards Limit"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                sx={{ width: "100%" }}
              />
               </Tooltip>
            )}
          />
        </div>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
          Ranked Rewards
        </Typography>
        {fields.map((field, index) => (
          <Reward 
            key={field.id} 
            index={index} 
            removeReward={remove} 
            control={control} 
          />
        ))}
        <Button
          sx={{
            fontWeight: "bold",
            gridColumn: "1 / -1",
            width: "20%",
            mt: 2,
          }}
          size="small"
          onClick={addReward}
          variant="contained"
        >
          ADD MORE
        </Button>
      </div>
    </div>
  );
}

export function Reward({ index, removeReward, control }: RewardProps) {
  return (
    <div className="rewards">
      <Controller
        control={control}
        name={`rewards.rankedRewards.${index}`}
        render={({ field }) => {
          return (
            <>
              <Select
                labelId="reward-rank"
                id="reward-rank"
                label="Rank"
                value={field.value.rank}
                size="small"
                sx={{ marginRight: "4px" }}
                onChange={(event) => {
                  field.onChange({
                    ...field.value,
                    rank: event.target.value
                  });
                }}
              >
                <MenuItem value="*">All</MenuItem>
                {[...Array(50)].map((_, i) => (
                  <MenuItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                type="number"
                size="small"
                label="Experience"
                value={field.value.experience}
                sx={{ marginRight: "8px" }}
                onChange={(event) => field.onChange({ ...field.value, experience: Number(event.target.value) })}
              />
              <TextField
                type="number"
                size="small"
                label="Money"
                value={field.value.money}
                sx={{ marginRight: "8px" }}
                onChange={(event) => field.onChange({ ...field.value, money: Number(event.target.value) })}
              />
              <div className="clear-icon" onClick={() => removeReward(index)}>
                <ClearIcon />
              </div>
              <TextFieldButton
                label="Commands"
                onChange={(values) => {
                  field.onChange({ ...field.value, commands: values });
                }}
              />
            </>
          );
        }}
      />
    </div>
  );
}
