import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Project } from "@/data/projects";
import { ImageBlock } from "./ImageBlock";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const work = siteConfig.sections.work;

  return (
    <article className="grid gap-6 py-8 md:grid-cols-[0.72fr_1fr] md:gap-8 md:py-10">
      <Link href={`/projects/${project.slug}`} aria-label={project.title.zh}>
        <ImageBlock
          src={project.imageSlots.cover.src}
          alt={project.imageSlots.cover.alt}
          captionZh={project.order}
          captionEn={project.category.en}
          placeholderText={project.imageSlots.cover.placeholder}
          priority={index === 0}
        />
      </Link>

      <div className="flex flex-col justify-between gap-8">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="tag-pill">{project.year}</span>
            <span className="tag-pill">{project.category.zh}</span>
          </div>
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-3xl leading-tight md:text-5xl">{project.title.zh}</h3>
            <p className="mt-2 font-en text-sm uppercase tracking-[0.12em] text-muted">{project.title.en}</p>
          </Link>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{project.summary.zh}</p>
          <p className="mt-2 max-w-2xl font-en text-sm leading-6 text-muted">{project.summary.en}</p>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="button-shell w-fit px-5 py-3 text-sm font-semibold"
        >
          {work.detailButtonZh}
          <span className="ml-2 font-en text-xs uppercase tracking-[0.12em]">{work.detailButtonEn}</span>
        </Link>
      </div>
    </article>
  );
}
