"use client";

import { AnimatePresence, motion } from "motion/react";
import ContactForm from "@/components/root/ContactForm";
import { useContactFormType } from "./ContactTabs";

/** Swaps the Enquiry / General forms: old one drops away, new one settles in from above. */
export default function ContactPanel() {
  const formType = useContactFormType();

  return (
    <div className="ct-form-outer">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={formType}
          initial={{ opacity: 0, y: "-0.75rem" }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              opacity: { duration: 0.2 },
              y: { duration: 1, ease: [0.19, 1, 0.22, 1] },
            },
          }}
          exit={{
            opacity: 0,
            y: "0.75rem",
            transition: {
              opacity: { duration: 0.1, delay: 0.05 },
              y: { duration: 0.15, ease: [0.55, 0.085, 0.68, 0.53] },
            },
          }}
        >
          <ContactForm formType={formType} framed />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
