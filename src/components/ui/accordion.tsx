"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps, type Transition } from "motion/react";

type AccordionValue = string | string[] | undefined;

const AccordionContext = React.createContext<AccordionValue>(undefined);
const AccordionItemContext = React.createContext<{ value: string; isOpen: boolean } | null>(null);

function useAccordionItem() {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionContent must be used within an AccordionItem");
  return ctx;
}

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

function Accordion(props: AccordionProps) {
  // Tracks the resolved value (controlled or uncontrolled) purely so descendant
  // AccordionItems know whether they're open, for the height/opacity animation.
  const [internalValue, setInternalValue] = React.useState<AccordionValue>(props.value ?? props.defaultValue);
  const resolvedValue = props.value !== undefined ? props.value : internalValue;

  const handleValueChange = (next: AccordionValue) => {
    setInternalValue(next);
    // @ts-expect-error -- next matches whichever single/multiple variant props picked
    props.onValueChange?.(next);
  };

  return (
    <AccordionContext.Provider value={resolvedValue}>
      <AccordionPrimitive.Root data-slot="accordion" {...props} onValueChange={handleValueChange} />
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;

function AccordionItem({ value, ...props }: AccordionItemProps) {
  const accordionValue = React.useContext(AccordionContext);
  const isOpen = Array.isArray(accordionValue) ? accordionValue.includes(value) : accordionValue === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <AccordionPrimitive.Item data-slot="accordion-item" value={value} {...props} />
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>;

function AccordionTrigger(props: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
      <AccordionPrimitive.Trigger data-slot="accordion-trigger" {...props} />
    </AccordionPrimitive.Header>
  );
}

type AccordionContentProps = Omit<React.ComponentProps<typeof AccordionPrimitive.Content>, "asChild" | "forceMount"> &
  HTMLMotionProps<"div"> & {
    keepRendered?: boolean;
  };

function AccordionContent({
  keepRendered = true,
  transition = { type: "spring", stiffness: 150, damping: 22 },
  children,
  ...props
}: AccordionContentProps) {
  const { isOpen } = useAccordionItem();
  const shouldReduceMotion = useReducedMotion();
  const resolvedTransition: Transition = shouldReduceMotion ? { duration: 0 } : transition;

  const openState = { height: "auto", opacity: 1, "--mask-stop": "100%", y: 0 } as const;
  const closedState = { height: 0, opacity: 0, "--mask-stop": "0%", y: shouldReduceMotion ? 0 : 20 } as const;

  const maskStyle = {
    maskImage: "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))",
    WebkitMaskImage: "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))",
    overflow: "hidden",
  } as const;

  return (
    <AnimatePresence>
      {keepRendered ? (
        <AccordionPrimitive.Content asChild forceMount>
          <motion.div
            key="accordion-content"
            data-slot="accordion-content"
            initial={closedState}
            animate={isOpen ? openState : closedState}
            transition={resolvedTransition}
            style={maskStyle}
            {...props}
          >
            {children}
          </motion.div>
        </AccordionPrimitive.Content>
      ) : (
        isOpen && (
          <AccordionPrimitive.Content asChild forceMount>
            <motion.div
              key="accordion-content"
              data-slot="accordion-content"
              initial={closedState}
              animate={openState}
              exit={closedState}
              transition={resolvedTransition}
              style={maskStyle}
              {...props}
            >
              {children}
            </motion.div>
          </AccordionPrimitive.Content>
        )
      )}
    </AnimatePresence>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps };
