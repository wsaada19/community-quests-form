import { IconButton, InputAdornment, SxProps, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function TextFieldButton({ onChange, label, sx = {}, tooltip = "" }: { onChange: (values: string[]) => void, label: string, sx?: SxProps, tooltip?: string }) {
  const [values, setValues] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const addValue = () => {
    if (value === "") return;
    const newValues = [...values, `"${value}"`];
    setValues(newValues);
    onChange(newValues);
    setValue("");
  };

  return (
    <Tooltip title={tooltip} placement="top">
    <TextField
      size="small"
      type="standard"
      label={label}
      value={value}
      sx={sx}
      onChange={(event) => setValue(event.target.value)}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="Add value" onClick={addValue} edge="end">
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
    </Tooltip>
  );
}
