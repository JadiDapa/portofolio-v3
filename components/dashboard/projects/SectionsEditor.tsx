"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Film,
  GripVertical,
  Images,
  LayoutTemplate,
  ListChecks,
  Plus,
  Trash2,
  Type,
  Wrench,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GalleryEditor from "@/components/dashboard/projects/GalleryEditor";
import type {
  Section,
  SectionType,
} from "@/servers/validators/project.validator";

const META: Record<
  SectionType,
  { label: string; hint?: string; icon: React.ComponentType<{ className?: string }> }
> = {
  hero: {
    label: "Hero",
    hint: "Shows the cover image or hero video set above.",
    icon: Film,
  },
  intro: {
    label: "Intro",
    hint: "Category, title, short description, description and website link, taken from the fields above.",
    icon: LayoutTemplate,
  },
  gallery: { label: "Images", icon: Images },
  features: { label: "Features", icon: ListChecks },
  tools: { label: "Tools", icon: Wrench },
  results: { label: "Results", icon: BarChart3 },
  text: { label: "Text", icon: Type },
};

/** Hero and intro read the project's own fields, so each can only appear once. */
const SINGLE: SectionType[] = ["hero", "intro"];

const newId = () => Math.random().toString(36).slice(2, 10);

function create(type: SectionType): Section {
  const id = newId();
  switch (type) {
    case "gallery":
      return { id, type, blocks: [] };
    case "features":
      return { id, type, items: [{ title: "", description: "" }] };
    case "tools":
      return { id, type, items: [] };
    case "results":
      return { id, type, items: [{ value: "", label: "" }] };
    case "text":
      return { id, type, body: "" };
    default:
      return { id, type };
  }
}

function TitleField({
  value,
  placeholder,
  onChange,
}: {
  value?: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <Input
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function RowRemove({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Remove row"
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}

function ToolsField({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder="Add a tool, e.g. Next.js"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((tool, i) => (
          <span
            key={`${tool}-${i}`}
            className="bg-muted flex items-center gap-1 rounded-md py-1 pr-1 pl-2.5 text-sm"
          >
            {tool}
            <button
              type="button"
              aria-label={`Remove ${tool}`}
              className="hover:bg-background rounded p-0.5"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionBody({
  section,
  onChange,
}: {
  section: Section;
  onChange: (s: Section) => void;
}) {
  switch (section.type) {
    case "hero":
    case "intro":
      return (
        <p className="text-muted-foreground text-sm">
          {META[section.type].hint}
        </p>
      );

    case "gallery":
      return (
        <GalleryEditor
          value={section.blocks}
          onChange={(blocks) => onChange({ ...section, blocks })}
        />
      );

    case "features":
      return (
        <div className="space-y-3">
          <TitleField
            value={section.title}
            placeholder="Heading (default: Features)"
            onChange={(title) => onChange({ ...section, title })}
          />
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <Input
                  value={item.title}
                  placeholder="Feature title"
                  onChange={(e) =>
                    onChange({
                      ...section,
                      items: section.items.map((it, idx) =>
                        idx === i ? { ...it, title: e.target.value } : it,
                      ),
                    })
                  }
                />
                <Textarea
                  value={item.description}
                  placeholder="Short description"
                  className="min-h-9 resize-y"
                  onChange={(e) =>
                    onChange({
                      ...section,
                      items: section.items.map((it, idx) =>
                        idx === i ? { ...it, description: e.target.value } : it,
                      ),
                    })
                  }
                />
              </div>
              <RowRemove
                onClick={() =>
                  onChange({
                    ...section,
                    items: section.items.filter((_, idx) => idx !== i),
                  })
                }
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...section,
                items: [...section.items, { title: "", description: "" }],
              })
            }
          >
            <Plus className="h-4 w-4" /> Add feature
          </Button>
        </div>
      );

    case "tools":
      return (
        <div className="space-y-3">
          <TitleField
            value={section.title}
            placeholder="Heading (default: Tools)"
            onChange={(title) => onChange({ ...section, title })}
          />
          <ToolsField
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
          />
        </div>
      );

    case "results":
      return (
        <div className="space-y-3">
          <TitleField
            value={section.title}
            placeholder="Heading (default: Results)"
            onChange={(title) => onChange({ ...section, title })}
          />
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-[10rem_1fr]">
                <Input
                  value={item.value}
                  placeholder="+42%"
                  onChange={(e) =>
                    onChange({
                      ...section,
                      items: section.items.map((it, idx) =>
                        idx === i ? { ...it, value: e.target.value } : it,
                      ),
                    })
                  }
                />
                <Input
                  value={item.label}
                  placeholder="What it measures, e.g. checkout conversion"
                  onChange={(e) =>
                    onChange({
                      ...section,
                      items: section.items.map((it, idx) =>
                        idx === i ? { ...it, label: e.target.value } : it,
                      ),
                    })
                  }
                />
              </div>
              <RowRemove
                onClick={() =>
                  onChange({
                    ...section,
                    items: section.items.filter((_, idx) => idx !== i),
                  })
                }
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...section,
                items: [...section.items, { value: "", label: "" }],
              })
            }
          >
            <Plus className="h-4 w-4" /> Add metric
          </Button>
        </div>
      );

    case "text":
      return (
        <div className="space-y-3">
          <TitleField
            value={section.title}
            placeholder="Heading (optional)"
            onChange={(title) => onChange({ ...section, title })}
          />
          <Textarea
            value={section.body}
            placeholder="Write anything: process, challenges, lessons… Blank line = new paragraph."
            className="min-h-32 resize-y"
            onChange={(e) => onChange({ ...section, body: e.target.value })}
          />
        </div>
      );
  }
}

/** A reorderable row that only starts a drag from its grip, so inputs inside stay selectable. */
function DragItem({
  section,
  children,
}: {
  section: Section;
  children: (startDrag: (e: React.PointerEvent) => void) => React.ReactNode;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className="db-section space-y-3 p-3"
      whileDrag={{ scale: 1.01, boxShadow: "0.6rem -0.6rem 0 #0f0f0f" }}
    >
      {children((e) => controls.start(e))}
    </Reorder.Item>
  );
}

/** Ordered list of page sections. The order here is the order on the public project page. */
export default function SectionsEditor({
  value,
  onChange,
}: {
  value: Section[];
  onChange: (sections: Section[]) => void;
}) {
  const update = (i: number, section: Section) =>
    onChange(value.map((s, idx) => (idx === i ? section : s)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Drag a section by its grip to reorder; the arrows stay for keyboard use */}
      <Reorder.Group
        axis="y"
        values={value}
        onReorder={onChange}
        className="space-y-4"
      >
      {value.map((section, i) => {
        const { label, icon: Icon } = META[section.type];
        return (
          <DragItem key={section.id} section={section}>
           {(startDrag) => (
            <>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium">
                <GripVertical
                  aria-label="Drag to reorder"
                  onPointerDown={startDrag}
                  style={{ touchAction: "none" }}
                  className="db-grip text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing"
                />
                <Icon className="text-muted-foreground h-4 w-4" />
                {i + 1}. {label}
              </p>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Move section up"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Move section down"
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Remove section"
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <SectionBody section={section} onChange={(s) => update(i, s)} />
            </>
           )}
          </DragItem>
        );
      })}
      </Reorder.Group>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(META) as SectionType[]).map((type) => {
          const { label, icon: Icon } = META[type];
          const taken = SINGLE.includes(type) && value.some((s) => s.type === type);
          return (
            <Button
              key={type}
              type="button"
              variant="outline"
              size="sm"
              disabled={taken}
              onClick={() => onChange([...value, create(type)])}
            >
              <Icon className="h-4 w-4" /> Add {label.toLowerCase()}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
