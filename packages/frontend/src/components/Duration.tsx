import { Control, Controller } from "react-hook-form";
import { Box, MenuItem, Select, Typography, Checkbox, FormControlLabel, Tooltip, TextField } from "@mui/material";

type DurationProps = {
  control: Control<any>;
};

export function Duration({ control }: DurationProps) {
  return (
    <div className="duration">
      {/* @ts-ignore - Controller component type issue */}
      <Controller
        name="duration"
        control={control}
        defaultValue={{ enabled: false, days: 0, hours: 0, minutes: 0, seconds: 0 }}
        render={({ field }) => (
          <>
            <Tooltip placement="top" title="Select to add a timer to the quest. If not objectives are added, the quest will be automatically completed after the duration has passed.">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value.enabled}
                    onChange={(e) => {
                      field.onChange({ ...field.value, enabled: e.target.checked });
                    }}
                  />
                }
                label="Timed Quest"
              />
            </Tooltip>
            <Box display="flex" alignItems="center" gap={1}>
              <TimeBox
                value={field.value.days}
                onChange={(value) => field.onChange({ ...field.value, days: value })}
                disabled={!field.value.enabled}
                label="days"
                limit={100}
              />
              <TimeBox
                value={field.value.hours}
                onChange={(value) => field.onChange({ ...field.value, hours: value })}
                disabled={!field.value.enabled}
                label="hours"
                limit={24}
              />
              <TimeBox
                value={field.value.minutes}
                onChange={(value) => field.onChange({ ...field.value, minutes: value })}
                disabled={!field.value.enabled}
                label="mins"
                limit={60}
              />
              <TimeBox
                value={field.value.seconds}
                onChange={(value) => field.onChange({ ...field.value, seconds: value })}
                disabled={!field.value.enabled}
                label="secs"
                limit={60}
              />
            </Box>
            {field.value.enabled && (
              <p>
                Duration: {field.value.days}d {field.value.hours}h {field.value.minutes}m {field.value.seconds}s
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

function TimeBox({
  value,
  onChange,
  disabled,
  label,
  limit,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  label: string;
  limit: number;
}) {
  return (
    <>
      <TextField
        sx={{ display: disabled ? "none" : "block" }}
        label={label}
        select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {Array.from({ length: limit }, (_, i) => i).map((second) => (
          <MenuItem key={second} value={second}>
            {second}
          </MenuItem>
        ))}
      </TextField>
      {label !== "secs" && !disabled && <Typography>:</Typography>}
    </>
  );
}
