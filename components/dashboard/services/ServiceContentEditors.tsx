"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Faq, ProcessStep } from "@/servers/validators/service.validator";

/** Drops blank outcomes and steps the editor left empty. */
export function cleanProcess(steps: ProcessStep[] | undefined): ProcessStep[] {
  return (steps ?? [])
    .map((s) => ({
      title: s.title.trim(),
      text: s.text.trim(),
      outcomes: s.outcomes.map((o) => o.trim()).filter(Boolean),
    }))
    .filter((s) => s.title && s.text);
}

export function cleanFaqs(faqs: Faq[] | undefined): Faq[] {
  return (faqs ?? [])
    .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
    .filter((f) => f.question && f.answer);
}

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function RowTools({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Move up"
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Move down"
        disabled={index === count - 1}
        onClick={() => onMove(index + 1)}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Remove"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ProcessEditor({
  value,
  onChange,
}: {
  value: ProcessStep[];
  onChange: (next: ProcessStep[]) => void;
}) {
  const set = (i: number, patch: Partial<ProcessStep>) =>
    onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-3">
      {value.map((step, i) => (
        <div key={i} className="space-y-3 rounded-md border p-4">
          <div className="flex items-center justify-between gap-2">
            <Label>Step {i + 1}</Label>
            <RowTools
              index={i}
              count={value.length}
              onMove={(to) => onChange(move(value, i, to))}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
            />
          </div>
          <Input
            value={step.title}
            onChange={(e) => set(i, { title: e.target.value })}
            placeholder="Title, e.g. Scoping"
          />
          <Textarea
            value={step.text}
            onChange={(e) => set(i, { text: e.target.value })}
            placeholder="What happens in this step"
            className="min-h-20 resize-y"
          />
          <Textarea
            value={step.outcomes.join("\n")}
            onChange={(e) => set(i, { outcomes: e.target.value.split("\n") })}
            placeholder="Outcomes, one per line"
            className="min-h-20 resize-y"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { title: "", text: "", outcomes: [] }])}
      >
        <Plus className="h-4 w-4" /> Add step
      </Button>
    </div>
  );
}

export function FaqEditor({
  value,
  onChange,
}: {
  value: Faq[];
  onChange: (next: Faq[]) => void;
}) {
  const set = (i: number, patch: Partial<Faq>) =>
    onChange(value.map((f, j) => (j === i ? { ...f, ...patch } : f)));

  return (
    <div className="space-y-3">
      {value.map((faq, i) => (
        <div key={i} className="space-y-3 rounded-md border p-4">
          <div className="flex items-center justify-between gap-2">
            <Label>Question {i + 1}</Label>
            <RowTools
              index={i}
              count={value.length}
              onMove={(to) => onChange(move(value, i, to))}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
            />
          </div>
          <Input
            value={faq.question}
            onChange={(e) => set(i, { question: e.target.value })}
            placeholder="Question"
          />
          <Textarea
            value={faq.answer}
            onChange={(e) => set(i, { answer: e.target.value })}
            placeholder="Answer"
            className="min-h-20 resize-y"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { question: "", answer: "" }])}
      >
        <Plus className="h-4 w-4" /> Add question
      </Button>
    </div>
  );
}
