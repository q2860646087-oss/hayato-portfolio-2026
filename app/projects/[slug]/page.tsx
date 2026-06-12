import Link from "next/link";
import { notFound } from "next/navigation";
import { FreeCanvas } from "@/components/FreeCanvas";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";
import { createProjectCanvas } from "@/data/projectCanvas";
import { getProjectBySlug, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: siteConfig.notFoundTitle,
    };
  }

  return {
    title: project.title.zh,
    description: project.summary.zh,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const work = siteConfig.sections.work;
  const canvas = createProjectCanvas(project);

  return (
    <main className="project-free-page">
      <section className="page-shell pb-8 pt-32 md:pt-40">
        <Reveal>
          <Link href="/#work" className="button-shell px-5 py-3 text-sm font-semibold">
            {work.backButtonZh}
            <span className="ml-2 font-en text-xs uppercase tracking-[0.12em]">{work.backButtonEn}</span>
          </Link>
        </Reveal>
      </section>

      <FreeCanvas page={canvas} className="pb-20" />
    </main>
  );
}
