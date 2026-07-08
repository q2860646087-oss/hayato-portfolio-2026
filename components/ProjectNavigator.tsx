"use client";

import { useEffect, useState, useCallback } from "react";
import { projects } from "@/data/projects";

export default function ProjectNavigator() {
  const [visible, setVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // 检测是否为触屏设备（无 hover 能力）
  const isTouchOnly = typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  const checkVisibility = useCallback(() => {
    const hero = document.getElementById("hero");
    if (hero) {
      const rect = hero.getBoundingClientRect();
      setVisible(rect.bottom < window.innerHeight * 0.35);
    } else {
      setVisible(window.scrollY > window.innerHeight * 0.75);
    }
  }, []);

  useEffect(() => {
    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [checkVisibility]);

  const scrollToProject = (slug: string) => {
    const target = document.getElementById(`project-${slug}`);
    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // 触屏端：点击切换展开/收起
  const handleItemClick = (index: number) => {
    if (isTouchOnly) {
      setExpandedIndex((prev) => (prev === index ? null : index));
    }
  };

  return (
    <nav
      className={`project-rail ${visible ? "is-visible" : ""}`}
      aria-label="项目导航"
    >
      {projects.map((project, index) => (
        <button
          key={project.slug}
          type="button"
          className={`project-rail__item${expandedIndex === index ? " expanded" : ""}`}
          onClick={() => {
            scrollToProject(project.slug);
            handleItemClick(index);
          }}
          aria-label={project.title.zh}
        >
          <span className="project-rail__index">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="project-rail__content">
            <span className="project-rail__title">
              {project.title.zh}
            </span>
            <span className="project-rail__subtitle">
              {project.title.en}
            </span>
          </span>

          <span className="project-rail__dot" />
        </button>
      ))}
    </nav>
  );
}
