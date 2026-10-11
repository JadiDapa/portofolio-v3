"use client";

import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/dashboard/ui/TagInput";
import type { Faq, ProcessStep, Skill } from "@/servers/validators/service.validator";

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

export const newSkillId = () => Math.random().toString(36).slice(2, 10);

function SkillItem({
  skill,
  index,
  onChange,
  onRemove,
}: {
  skill: Skill;
  index: number;
  onChange: (patch: Partial<Skill>) => void;
  onRemove: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={skill}
      dragListener={false}
      dragControls={controls}
      className="db-section space-y-3 p-3"
      whileDrag={{ scale: 1.01, boxShadow: "0.6rem -0.6rem 0 #0f0f0f" }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium">
          <GripVertical
            aria-label="Drag to reorder"
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="db-grip text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing"
          />
          Skill {index + 1}
        </p>
        <Button type="button" size="icon" variant="ghost" aria-label="Remove skill" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Input
        value={skill.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Skill, e.g. Frontend Development"
      />
      <Input
        value={skill.summary ?? ""}
        onChange={(e) => onChange({ summary: e.target.value })}
        placeholder="One-line summary (optional)"
      />
      <TagInput
        value={skill.tools}
        onChange={(tools) => onChange({ tools })}
        placeholder="Tools: Next.js, React, TypeScript…"
        label="tool"
      />
    </Reorder.Item>
  );
}

/** Service → skills → tools. Drag a card by its grip to reorder. */
export function SkillsEditor({
  value,
  onChange,
}: {
  value: Skill[];
  onChange: (next: Skill[]) => void;
}) {
  return (
    <div className="space-y-3">
      <Reorder.Group axis="y" values={value} onReorder={onChange} className="space-y-3">
        {value.map((skill, i) => (
          <SkillItem
            key={skill.id ?? i}
            skill={skill}
            index={i}
            onChange={(patch) =>
              onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)))
            }
            onRemove={() => onChange(value.filter((_, j) => j !== i))}
          />
        ))}
      </Reorder.Group>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { id: newSkillId(), name: "", tools: [] }])}
      >
        <Plus className="h-4 w-4" /> Add skill
      </Button>
    </div>
  );
}
