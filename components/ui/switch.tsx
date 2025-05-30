"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface CustomSwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  thumbClassName?: string;
  label?: string;
}

function Switch({
  className,
  thumbClassName,
  label,
  ...props
}: CustomSwitchProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}

      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(
          "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
          "data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            // make bg-white default and override dark mode styles carefully
            "block size-4 rounded-full ring-0 transition-transform",
            "translate-x-0 data-[state=checked]:translate-x-[calc(100%-2px)]",
            "bg-white", // force this as default background
            thumbClassName
          )}
        />
      </SwitchPrimitive.Root>
    </label>
  );
}

export { Switch };
