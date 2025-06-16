import { Button, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import "./ObjectiveForm.css";
import { Controller, useFieldArray } from "react-hook-form";
import { MinecraftEntity } from "../../types/minecraftEntities";
import { allQuests, MaterialQuests, NoConstraintQuests, PotionQuests } from "../../types/questTypes";
import { Material } from "../../types/minecraftMaterials";
import { PotionType } from "../../types/potionTypes";
import { useState } from "react";
import TextFieldButton from "../../components/TextFieldButton";
import { useCustomName } from "../../providers/CustomNameProvider";

export function ObjectiveForm({ control }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "objectives",
  });

  const addObjective = () => {
    append({
      type: "mobkill",
      description: "",
      goal: 0,
      constraints: [],
    });
  };

  return (
    <div className="metric">
      {fields.map((m, i) => {
        return <Objective key={i} index={i} removeObjective={remove} control={control} />;
      })}
      <Button
        sx={{
          fontWeight: "bold",
          gridColumn: "1 / -1",
          width: "20%"
        }}
        size="small"
        onClick={addObjective}
        variant="contained"
      >
        ADD MORE
      </Button>
    </div>
  );
}

export function Objective({ index, removeObjective, control }) {
  const removeMetric = () => {
    removeObjective(index);
  };

  const { customName, setCustomName } = useCustomName();
  const [questEntities, setQuestEntities] = useState<string[]>(Object.values(MinecraftEntity));

  return (
    // @ts-ignore - Controller component type issue
    <Controller
      control={control}
      name={`objectives.${index}`}
      render={({ field }) => {
        const hasConstraints = !Object.values(NoConstraintQuests).includes(field.value.type as any);
        return (
          <div className={`objective-row ${hasConstraints ? 'with-constraints' : 'without-constraints'}`}>
            <div className="first-row">
              <TextField
                id="metric-id"
                select
                label="Objective"
                value={field.value.type}
                size="small"
                fullWidth
                onChange={(event) => {
                  const value = event.target.value;
                  const oldType = questEntities[0] === Object.values(Material)[0] ? "material" : "entities";
                  let newType = Object.values(MaterialQuests).includes(value as any) ? "material" : "entities";
                  newType = Object.values(PotionQuests).includes(value as any) ? "potions" : newType;
                  const didTypeChange = oldType !== newType;

                  if (newType === "material") {
                    setQuestEntities(Object.values(Material));
                  } else if (newType === "potions") {
                    setQuestEntities(Object.values(PotionType));
                  } else {
                    setQuestEntities(Object.values(MinecraftEntity));
                  }
                  field.onChange({
                    ...field.value,
                    type: value,
                    constraints: Object.values(NoConstraintQuests).includes(value as any) ? [] : field.value.constraints,
                  });
                }}
              >
                {allQuests.map((type) => {
                  return (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                type="number"
                size="small"
                label="Goal"
                value={field.value.goal}
                fullWidth
                onChange={(event) => field.onChange({ ...field.value, goal: event.target.value })}
              />
              <TextField
                size="small"
                label="Description"
                value={field.value.description || ""}
                fullWidth
                onChange={(event) => field.onChange({ ...field.value, description: event.target.value })}
              />
            </div>
            {hasConstraints && (
              <div className="second-row">
                {!customName[index] && (
                  <TextField
                    id="entity-id"
                    label="Entities"
                    value={field.value.constraints || []}
                    size="small"
                    select
                    fullWidth
                    onChange={(event) => {
                      const value = event.target.value;
                      console.log(value);
                      field.onChange({ ...field.value, constraints: value });
                    }}
                  >
                    {Object.values(questEntities)
                      .sort((a, b) => a.localeCompare(b))
                      .map((entity) => {
                        return (
                          <MenuItem key={entity} value={entity}>
                            {entity}
                          </MenuItem>
                        );
                      })}
                  </TextField>
                )}
                {customName[index] && (
                  <TextFieldButton
                    label="Names"
                    onChange={(values) => {
                      field.onChange({ ...field.value, constraints: values });
                    }}
                  />
                )}
                <Tooltip
                  title={
                    customName[index]
                      ? "Select to use Spigot names of items and entities."
                      : "Select to use display names of items and entities instead of their Spigot names."
                  }
                  placement="top"
                >
                  <Button
                    variant="contained"
                    sx={{ fontWeight: "bold", height: "40px" }}
                    onClick={() => {
                      const newCustomName = [...customName];
                      newCustomName[index] = !newCustomName[index];
                      setCustomName(newCustomName);
                      field.onChange({ ...field.value, constraints: newCustomName[index] ? [] : field.value.constraints });
                    }}
                  >
                    {customName[index] ? "Spigot" : "Custom"}
                  </Button>
                </Tooltip>
              </div>
            )}
            <div className="clear-icon" onClick={removeMetric}>
              <ClearIcon />
            </div>
          </div>
        );
      }}
    />
  );
}
