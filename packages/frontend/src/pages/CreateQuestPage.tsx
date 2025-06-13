import { useEffect, useState } from "react";
import "./CreateQuestPage.css";
import { Button, MenuItem, Snackbar, TextField, Tooltip } from "@mui/material";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { QuestConfig, validationSchema, defaultQuestConfig } from "../types/formSchema";
import { ObjectiveForm } from "../features/objectives/ObjectiveForm";
import { Duration } from "../components/Duration";
import { Rewards } from "../features/rewards/Rewards";
import QuestConfigComponent from "../features/viewConfig/QuestConfig";
import { useConfetti } from "../hooks/useConfetti";
import { Material } from "../types/minecraftMaterials";
import { yupResolver } from "@hookform/resolvers/yup";
import TextFieldButton from "../components/TextFieldButton";
import { LoadQuestConfig } from "../features/loadConfig/LoadQuestConfig";

export function CreateQuestPage() {
  const resolver = yupResolver(validationSchema);
  const confetti = useConfetti();
  const methods = useForm<QuestConfig>({
    resolver: resolver as Resolver<QuestConfig>,
    defaultValues: defaultQuestConfig,
  });

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const [showSnack, setShowSnack] = useState(false);
  const [showErrorSnack, setShowErrorSnack] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem("questConfig");
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setValue("id", parsedConfig.id);
      setValue("name", parsedConfig.name);
      setValue("displayItem", parsedConfig.displayItem);
      setValue("worlds", parsedConfig.worlds);
      setValue("duration", parsedConfig.duration);
      setValue("objectives", parsedConfig.objectives);
      setValue("rewards", parsedConfig.rewards);
    }
  }, []);

  useEffect(() => {
    // For debugging
    console.log(errors);
  }, [errors]);

  const submitData = (data: QuestConfig) => {
    console.log(data);
    confetti();
    localStorage.setItem("questConfig", JSON.stringify(data));
    const savedConfigs = JSON.parse(localStorage.getItem("savedConfigs") || "[]");
    const filteredConfigs = savedConfigs.filter((config: QuestConfig) => config.id !== data.id);
    localStorage.setItem("savedConfigs", JSON.stringify([...filteredConfigs, data]));
  };

  return (
    <div className="quest-page">
      <div className="grid-element">
        <FormProvider {...methods}>
          <div className="header">
            <h1>Community Quests Config</h1>
            <LoadQuestConfig />
          </div>
          <form onSubmit={handleSubmit(submitData)}>
            <div className="center">
              <div className="fields-container">
                <TextField
                  sx={{ backgroundColor: "white", width: "100%" }}
                  size="small"
                  variant="standard"
                  label="Quest ID"
                  helperText={errors.id?.message || ""}
                  error={errors.id != null}
                  {...register("id")}
                  name="id"
                />
                <TextField
                  sx={{ backgroundColor: "white", width: "100%" }}
                  size="small"
                  variant="standard"
                  label="Quest Name"
                  helperText={errors.name?.message || ""}
                  error={errors.name != null}
                  {...register("name")}
                  name="name"
                />
              </div>
              <div className="fields-container">
                <TextField
                  size="small"
                  select
                  {...register("displayItem")}
                  id="display-item"
                  label="Display Item"
                  sx={{ marginRight: "4px", width: "100%" }}
                >
                  <MenuItem value="none">None</MenuItem>
                  {Object.values(Material)
                    .sort((a, b) => a.localeCompare(b))
                    .map((material) => {
                      return (
                        <MenuItem key={material} value={material}>
                          {material}
                        </MenuItem>
                      );
                    })}
                </TextField>
                <Tooltip
                  title="Worlds to run the quest in. If not specified, the quest will run in all worlds."
                  placement="top"
                >
                  <TextFieldButton
                    label="Worlds"
                    sx={{ width: "100%" }}
                    onChange={(values) => {
                      setValue("worlds", values);
                    }}
                  />
                </Tooltip>
              </div>
              <Duration control={control} />
              <h3>Objectives</h3>
              <p>
                Add objectives to your quest. You can add multiple objectives to your quest that must be completed to
                finish the quest.
              </p>
              <ObjectiveForm control={control} />
              <h3>Rewards</h3>
              <p>
                Add rewards to your quest. You can add multiple rewards to your quest that will be given to the player
                when the quest is completed.
              </p>
              <Rewards control={control} />
            </div>
            <Button sx={{ marginTop: "12px", marginLeft: "auto", display: "block" }} type="submit" variant="contained">
              VALIDATE
            </Button>
          </form>
        </FormProvider>
      </div>
      <QuestConfigComponent control={control} />
      <Snackbar
        open={showSnack}
        autoHideDuration={3000}
        onClose={() => setShowSnack(false)}
        message="Incentive Created!"
      />
      <Snackbar
        open={showErrorSnack}
        autoHideDuration={5000}
        onClose={() => setShowErrorSnack(false)}
        message="Incentive creation failed!"
      />
    </div>
  );
}
