import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism.css";
import { Control } from "react-hook-form";
import type { QuestConfig as QuestConfigType } from "../../types/formSchema";
import { useQuestConfig } from "./useQuestConfig";
import { Button } from "@mui/material";

function QuestConfig({ control }: { control: Control<QuestConfigType> }) {
  const { yamlConfig } = useQuestConfig({ control });

  return (
    <div className="grid-element">
      {/* @ts-ignore - Editor component type issue */}
      <Editor
        value={yamlConfig}
        onValueChange={() => {}}
        highlight={(code) => highlight(code, languages.yaml)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
      <Button size="small" variant="contained" color="primary" onClick={() => {
        navigator.clipboard.writeText(yamlConfig);
      }}>
        Copy
      </Button>
    </div>
  );
}

export default QuestConfig;
