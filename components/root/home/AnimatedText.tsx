import { motion } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  outline?: boolean;
  color?: string;
  delay?: number;
}

export function AnimatedText({
  text,
  className = "",
  outline = false,
  color,
  delay = 0,
}: AnimatedTextProps) {
  return (
    <span className={`inline-flex ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{
            y: "120%",
            opacity: 0,
          }}
          animate={{
            y: "0%",
            opacity: 1,
          }}
          transition={{
            duration: 0.65,
            delay: delay + index * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={outline ? "outline-text text-transparent" : ""}
          style={{
            ...(color && {
              color,
            }),
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
