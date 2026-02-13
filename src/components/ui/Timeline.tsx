"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import type { LucideIcon } from "lucide-react";

export interface TimelineItem {
  label: string;
  description: string;
  icon: LucideIcon;
  active?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <VerticalTimeline layout="1-column-left" lineColor="rgba(124,110,250,0.25)">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <VerticalTimelineElement
            key={item.label}
            contentStyle={{
              background: item.active
                ? "rgba(124,110,250,0.12)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${item.active ? "rgba(124,110,250,0.4)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: "1rem",
              boxShadow: "none",
              color: "#fff",
              padding: "1.25rem 1.5rem",
            }}
            contentArrowStyle={{ borderRight: "7px solid rgba(255,255,255,0.07)" }}
            iconStyle={{
              background: item.active ? "#7C6EFA" : "#1A1A2E",
              color: item.active ? "#fff" : "#7C6EFA",
              width: "2.5rem",
              height: "2.5rem",
              marginLeft: "-1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<Icon className="w-4 h-4" />}
          >
            <h3 className="text-white font-semibold text-sm mb-1">{item.label}</h3>
            <p className="text-white/50 text-sm leading-relaxed m-0">{item.description}</p>
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
}
