import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageBlock } from "@/components/ImageBlock";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";
import { getProjectBySlug, projects, type ProjectImage, type ProjectSection } from "@/data/projects";

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

  const moodboardImages = getImagesByRole(project.detailImages, "moodboard");
  const processImages = getImagesByRole(project.detailImages, "process");
  const finalImages = getImagesByRole(project.detailImages, "final");
  const work = siteConfig.sections.work;

  return (
    <main>
      <section className="page-shell pb-14 pt-32 md:pb-20 md:pt-40">
        <Reveal>
          <Link href="/#work" className="button-shell mb-8 px-5 py-3 text-sm font-semibold">
            {work.backButtonZh}
            <span className="ml-2 font-en text-xs uppercase tracking-[0.12em]">{work.backButtonEn}</span>
          </Link>
          <p className="mb-4 font-en text-xs uppercase tracking-[0.16em] text-muted">{project.order}</p>
          <h1 className="max-w-5xl text-[clamp(3rem,10vw,7rem)] leading-[1.06] tracking-[0.02em] text-primary">
            {project.title.zh}
          </h1>
          <p className="mt-4 font-en text-sm uppercase tracking-[0.14em] text-muted">{project.title.en}</p>
        </Reveal>

        <Reveal delay={80} className="mt-10 flex flex-wrap gap-3">
          <ProjectMeta labelZh={work.yearLabelZh} labelEn={work.yearLabelEn} value={project.year} />
          <ProjectMeta labelZh={work.categoryLabelZh} labelEn={work.categoryLabelEn} value={project.category.zh} />
          <ProjectMeta labelZh={work.categoryEnLabelZh} labelEn={work.categoryEnLabelEn} value={project.category.en} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 md:px-6">
        <Reveal>
          <ImageBlock
            src={project.imageSlots.cover.src}
            alt={project.imageSlots.cover.alt}
            captionZh={work.coverLabelZh}
            captionEn={work.coverLabelEn}
            placeholderText={project.imageSlots.cover.placeholder}
            priority
          />
        </Reveal>
      </section>

      <ProjectTextSection section={project.background} index="01" />
      <ProjectTextSection section={project.goals} index="02" ordered />

      {moodboardImages.length > 0 ? (
        <ProjectImageSection
          titleZh={work.moodboardLabelZh}
          titleEn={work.moodboardLabelEn}
          index="03"
          images={moodboardImages}
        />
      ) : null}

      <ProjectTextSection section={project.process} index="04" />

      <ProjectImageSection
        titleZh={work.processImagesTitleZh}
        titleEn={work.processImagesTitleEn}
        index="05"
        images={processImages}
      />

      <ProjectImageSection
        titleZh={work.finalImagesTitleZh}
        titleEn={work.finalImagesTitleEn}
        index="06"
        images={finalImages}
      />

      <ProjectTextSection section={project.applications} index="07" />
      <ProjectTextSection section={project.conclusion} index="08" />
    </main>
  );
}

function ProjectMeta({ labelZh, labelEn, value }: { labelZh: string; labelEn: string; value: string }) {
  return (
    <span className="tag-pill">
      <span className="font-en text-[0.65rem] uppercase tracking-[0.12em] text-muted">{labelEn}</span>
      <span className="ml-2 text-sm">{labelZh}：{value}</span>
    </span>
  );
}

function ProjectTextSection({
  section,
  index,
  ordered = false,
}: {
  section: ProjectSection;
  index: string;
  ordered?: boolean;
}) {
  return (
    <section className="page-shell section-space grid gap-10 md:grid-cols-[0.58fr_1fr]">
      <Reveal>
        <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">
          {index} / {section.titleEn}
        </p>
        <h2 className="text-3xl leading-tight md:text-5xl">{section.titleZh}</h2>
      </Reveal>
      <Reveal delay={80}>
        {ordered ? (
          <ol className="grid gap-4 text-lg leading-8">
            {section.items.map((item, itemIndex) => (
              <li key={item} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="archive-label font-en text-[0.65rem] uppercase tracking-[0.12em]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="space-y-4 text-lg leading-8">
            {section.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}

function ProjectImageSection({
  titleZh,
  titleEn,
  index,
  images,
}: {
  titleZh: string;
  titleEn: string;
  index: string;
  images: ProjectImage[];
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="page-shell section-space">
      <Reveal className="mb-8">
        <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">
          {index} / {titleEn}
        </p>
        <h2 className="text-3xl leading-tight md:text-5xl">{titleZh}</h2>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-2">
        {images.map((image, imageIndex) => (
          <Reveal key={image.src} delay={imageIndex * 60}>
            <ImageBlock
              src={image.src}
              alt={image.alt}
              captionZh={image.captionZh}
              captionEn={image.captionEn}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function getImagesByRole(images: ProjectImage[], role: NonNullable<ProjectImage["role"]>) {
  return images.filter((image) => image.role === role);
}
