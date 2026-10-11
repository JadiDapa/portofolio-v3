import { Code2, Cpu, Gauge, Zap, type LucideIcon } from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "software-development": Code2,
  "iot-ai-systems": Cpu,
  "electrical-engineering": Zap,
  "process-control-engineering": Gauge,
};

export const DEFAULT_SERVICE_ICON = Code2;
