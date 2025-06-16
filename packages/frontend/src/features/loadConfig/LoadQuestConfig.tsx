import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism.css";
import { parseQuestConfig } from "./questConfigParser.ts";
import { useFormContext } from "react-hook-form";


export function LoadQuestConfig() {
  const [open, setOpen] = useState(false);
  const [yamlInput, setYamlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setValue } = useFormContext();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setYamlInput("");
  };

  const handleLoad = () => {
    try {
      const parsedConfig = parseQuestConfig(yamlInput);
      
      // Update form values
      setValue("name", parsedConfig.name);
      setValue("id", parsedConfig.id);
      setValue("displayItem", parsedConfig.displayItem);
      setValue("worlds", parsedConfig.worlds || []);
      
      if (parsedConfig.duration) {
        setValue("duration", {
          enabled: true,
          days: parsedConfig.duration.days || 0,
          hours: parsedConfig.duration.hours || 0,
          minutes: parsedConfig.duration.minutes || 0,
          seconds: parsedConfig.duration.seconds || 0,
        });
      }

      if (parsedConfig.objectives) {
        setValue("objectives", parsedConfig.objectives);
      }

      if (parsedConfig.rewards) {
        setValue("rewards", {
          rewardsDisplay: parsedConfig.rewards.rewardsDisplay || [],
          rewardsLimit: parsedConfig.rewards.rewardsLimit,
          rankedRewards: parsedConfig.rewards.rankedRewards || [],
        });
      }

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse quest config");
    }
  };

  return (
    <>
      <Button 
        variant="outlined" 
        onClick={handleOpen}
        sx={{ marginBottom: 2, float: "right" , display: "inline-block"}}
      > 
        Import YAML
      </Button>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Load Quest Config</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: 16 }}>
            Paste your quest config YAML below:
          </div>
          {/* @ts-ignore - Editor component type issue */}
          <Editor
            value={yamlInput}
            onValueChange={setYamlInput}
            highlight={(code) => highlight(code, languages.yaml)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              minHeight: "300px",
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
            }}
          />
          {error && (
            <div style={{ color: "#d32f2f", marginTop: 8 }}>
              {error}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLoad} variant="contained">
            Load Config
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
