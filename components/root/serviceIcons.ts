import {
  Brain,
  CircuitBoard,
  Code2,
  Smartphone,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "web-development": Code2,
  "app-development": Smartphone,
  "ai-machine-learning": Brain,
  "iot-hardware": Wifi,
  "electronics-engineering": CircuitBoard,
};

export const DEFAULT_SERVICE_ICON = Code2;
