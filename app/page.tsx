import Link from "next/link";
import { ImageBlock } from "@/components/ImageBlock";
import { ManagedImage } from "@/components/ManagedImage";
import { Reveal } from "@/components/Reveal";
import { StyledHero } from "@/components/StyledHero";
import { siteConfig } from "@/config/site";
import {
  projects,
  type Project,
  type ProjectImage,
  type ProjectImageSlot,
  type ProjectSection,
  type ProjectWorkChapter,
} from "@/data/projects";

export default function HomePage() {
  return (
    <main className="portfolio-page">
      <StyledHero />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

function AboutSection() {
  const about = siteConfig.sections.about;

  return (
    <section id="about" className="page-shell section-space about-profile">
      <Reveal className="mb-12 grid gap-6 md:grid-cols-[0.55fr_0.45fr] md:items-end">
        <div>
          <p className="mb-4 font-en text-xs uppercase tracking-[0.18em] text-muted">{about.titleEn}</p>
          <h2 className="text-4xl leading-tight tracking-[0.04em] text-primary md:text-7xl">{about.titleZh}</h2>
        </div>
      </Reveal>

      <div className="grid gap-12">
        <div className="grid gap-10 xl:grid-cols-[0.34fr_0.66fr] xl:items-stretch">
          <Reveal>
            <ProfilePhoto />
          </Reveal>
          <div className="grid gap-10">
            <Reveal delay={60}>
              <ProfileIntro />
            </Reveal>
            <Reveal delay={100}>
              <DirectionGrid />
            </Reveal>
          </div>
        </div>

        <div className="about-record-grid grid gap-10 lg:grid-cols-[0.34fr_0.33fr_0.33fr]">
          <Reveal delay={120}>
            <ProfileRecordGroup titleZh={about.educationTitleZh} titleEn={about.educationTitleEn} items={siteConfig.about.education} />
          </Reveal>
          <Reveal className="experience-record-align" delay={150}>
            <ProfileRecordGroup titleZh={about.experienceTitleZh} titleEn={about.experienceTitleEn} items={siteConfig.about.experience} />
          </Reveal>
          <Reveal delay={180}>
            <ProfileRecordGroup titleZh={about.awardsTitleZh} titleEn={about.awardsTitleEn} items={siteConfig.about.awards} />
          </Reveal>
        </div>

        <div className="about-bottom-grid grid gap-10 lg:grid-cols-[0.34fr_0.66fr]">
          <Reveal delay={210}>
            <AboutContact />
          </Reveal>
          <Reveal delay={240}>
            <SoftwareGrid />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const work = siteConfig.sections.work;

  return (
    <section id="work" className="work-section section-space">
      <div className="page-shell">
        <Reveal className="work-heading mx-auto mb-20 max-w-4xl text-center">
          <p className="mb-5 font-en text-xs uppercase tracking-[0.22em]">{work.titleEn}</p>
          <h2 className="text-5xl leading-tight tracking-[0.06em] md:text-8xl">{work.titleZh}</h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8">{work.introZh}</p>
          <p className="mx-auto mt-3 max-w-3xl font-en text-sm leading-7">{work.introEn}</p>
        </Reveal>
      </div>

      <div className="grid gap-32 md:gap-44">
        {projects.map((project, index) => (
          <ProjectChapter key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProjectChapter({ project, index }: { project: Project; index: number }) {
  const work = siteConfig.sections.work;
  const [coverChapter, ...chapters] = project.workChapters;

  return (
    <article className="work-project page-shell">
      <Reveal delay={index * 70}>
        <header className="work-project-cover mx-auto max-w-5xl text-center">
          <span className="work-project-number corner-label font-en text-xs uppercase tracking-[0.16em]">{project.order}</span>
          <h1 className="work-project-title mt-9 text-5xl leading-[1.18] tracking-[0.05em] md:text-8xl">
            {project.title.zh}
          </h1>
          <p className="mt-6 font-en text-sm uppercase tracking-[0.2em]">{project.title.en}</p>
          <p className="mx-auto mt-9 max-w-3xl text-xl leading-9">{project.summary.zh}</p>
          <p className="mx-auto mt-4 max-w-3xl font-en text-sm leading-7">{project.summary.en}</p>
        </header>
      </Reveal>

      <div className="mt-16 grid gap-20 md:mt-24 md:gap-28">
        {coverChapter ? (
          <ProjectWorkChapterBlock
            project={project}
            chapter={coverChapter}
            priority={index === 0}
            delay={index * 70 + 60}
          />
        ) : null}

        <Reveal delay={index * 70 + 90}>
          <ProjectInfoTriptych project={project} />
        </Reveal>

        <Reveal delay={index * 70 + 120}>
          <ProjectMetaList project={project} />
        </Reveal>

        {chapters.map((chapter, chapterIndex) => (
          <ProjectWorkChapterBlock
            key={`${project.slug}-${chapter.titleEn}`}
            project={project}
            chapter={chapter}
            delay={index * 70 + 150 + chapterIndex * 45}
          />
        ))}

        <Reveal delay={index * 70 + 250}>
          <div className="flex justify-center">
            <Link href={`/projects/${project.slug}`} className="work-detail-link px-7 py-4 text-sm font-semibold">
              {work.detailButtonZh}
              <span className="ml-2 font-en text-xs uppercase tracking-[0.12em]">{work.detailButtonEn}</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function ContactSection() {
  const contact = siteConfig.sections.contact;

  return (
    <section id="contact" className="page-shell section-space">
      <Reveal>
        <p className="mb-4 font-en text-xs uppercase tracking-[0.18em] text-muted">{contact.titleEn}</p>
        <h2 className="text-4xl leading-tight tracking-[0.04em] text-primary md:text-7xl">{contact.titleZh}</h2>
        <p className="mt-7 max-w-4xl text-xl leading-9">{contact.introZh}</p>
        <p className="mt-4 max-w-4xl font-en text-sm leading-7 text-muted">{contact.introEn}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          {contactItems().map((item) => (
            <p key={item} className="contact-chip text-base">
              {item}
            </p>
          ))}
        </div>

        <div className="mt-12">
          <p className="text-2xl font-semibold text-primary">{contact.endingZh}</p>
          <p className="mt-3 font-en text-xs uppercase tracking-[0.14em] text-muted">{contact.endingEn}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {siteConfig.socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="tag-pill text-sm text-primary">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ProfilePhoto() {
  const portrait = siteConfig.about.portrait;
  const about = siteConfig.sections.about;

  return (
    <div
      className="profile-photo grid min-h-[520px] content-between overflow-hidden rounded-[var(--radius)] p-8"
      style={{
        backgroundImage: `url(${portrait.src})`,
      }}
      role="img"
      aria-label={portrait.alt}
    >
      <span className="archive-label corner-label font-en text-xs uppercase tracking-[0.16em]">{about.photoTitleEn}</span>
      <div className="photo-caption">
        <p className="font-en text-xs uppercase tracking-[0.2em] text-muted">{portrait.placeholderEn}</p>
        <p className="mt-2 text-2xl font-semibold text-primary">{portrait.placeholderZh}</p>
      </div>
    </div>
  );
}

function ProfileIntro() {
  return (
    <section className="profile-intro">
      <p className="mb-4 font-en text-xs uppercase tracking-[0.18em] text-muted">
        {siteConfig.sections.about.eyebrowEn}
      </p>
      <h3 className="text-5xl leading-tight tracking-[0.03em] text-primary md:text-7xl">
        {siteConfig.authorName}
      </h3>
      <p className="mt-3 font-en text-lg uppercase tracking-[0.24em] text-muted">{siteConfig.authorNameEn}</p>
      <p className="mt-8 max-w-4xl text-xl leading-9 md:text-2xl md:leading-10">{siteConfig.about.bioZh}</p>
      <p className="mt-5 max-w-4xl font-en text-sm leading-7 text-muted">{siteConfig.about.bioEn}</p>
    </section>
  );
}

function DirectionGrid() {
  const about = siteConfig.sections.about;

  return (
    <section className="direction-panel">
      <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">{about.directionTitleEn}</p>
      <h3 className="mb-5 text-2xl text-primary">{about.directionTitleZh}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {siteConfig.about.designDirections.map((item) => (
          <article key={item.titleZh} className="direction-item">
            <span className="linear-icon font-en text-xs font-bold uppercase">{item.icon}</span>
            <h4 className="mt-4 text-base leading-6 text-primary">{item.titleZh}</h4>
            <p className="mt-2 font-en text-[0.68rem] uppercase leading-4 tracking-[0.12em] text-muted">
              {item.titleEn}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileRecordGroup({
  titleZh,
  titleEn,
  items,
}: {
  titleZh: string;
  titleEn: string;
  items: Array<{ period: string; titleZh: string; titleEn: string }>;
}) {
  return (
    <section className="profile-record">
      <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">{titleEn}</p>
      <h3 className="mb-5 text-2xl text-primary">{titleZh}</h3>
      <div className="grid gap-5">
        {items.map((item) => (
          <article key={`${item.period}-${item.titleZh}`} className="profile-entry">
            <p className="archive-label font-en text-[0.65rem] uppercase tracking-[0.12em]">{item.period}</p>
            <h4 className="mt-3 text-lg leading-7 text-primary">{item.titleZh}</h4>
            <p className="mt-1 font-en text-xs uppercase leading-5 tracking-[0.12em] text-muted">{item.titleEn}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SoftwareGrid() {
  const about = siteConfig.sections.about;

  return (
    <section className="tools-panel">
      <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">{about.skillsTitleEn}</p>
      <h3 className="mb-5 text-2xl text-primary">{about.skillsTitleZh}</h3>
      <div className="software-icon-grid">
        {siteConfig.about.softwareSkills.map((skill) => (
          <div key={skill.name} className="tool-chip">
            <span className="tool-icon font-en text-sm font-bold uppercase">
              <ManagedImage
                src={skill.src}
                alt={`${skill.name} icon`}
                placeholder={skill.icon}
                fit="contain"
                imageClassName="p-5"
              />
            </span>
            <span className="font-en text-xs uppercase tracking-[0.12em]">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutContact() {
  const about = siteConfig.sections.about;

  return (
    <section className="about-contact">
      <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">{about.contactTitleEn}</p>
      <h3 className="mb-5 text-2xl text-primary">{about.contactTitleZh}</h3>
      <div className="contact-method-list">
        {siteConfig.about.contactMethods.map((item) => (
          <article key={item.value} className="contact-method">
            <span className="linear-icon font-en text-xs font-bold uppercase">{item.icon}</span>
            <div>
              <p className="text-base font-semibold text-primary">{item.labelZh}</p>
              <p className="font-en text-[0.65rem] uppercase tracking-[0.12em] text-muted">{item.labelEn}</p>
              <p className="mt-1 text-sm leading-5">{item.value}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectWorkChapterBlock({
  project,
  chapter,
  priority = false,
  delay = 0,
}: {
  project: Project;
  chapter: ProjectWorkChapter;
  priority?: boolean;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <section className="work-h2-block">
        <header className="work-h2-heading mx-auto max-w-4xl text-center">
          <p className="mb-4 font-en text-xs uppercase tracking-[0.22em]">{chapter.titleEn}</p>
          <h2 className="work-h2-title text-4xl leading-tight tracking-[0.05em] md:text-6xl">{chapter.titleZh}</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8">{chapter.descriptionZh}</p>
          <p className="mx-auto mt-3 max-w-3xl font-en text-sm leading-7">{chapter.descriptionEn}</p>
        </header>
        <WorkSquareImage project={project} chapter={chapter} priority={priority} />
      </section>
    </Reveal>
  );
}

function ProjectInfoTriptych({ project }: { project: Project }) {
  return (
    <section className="work-h3-grid">
      {project.infoPoints.map((point) => (
        <article key={point.titleEn} className={`work-h3-point ${point.emphasis ? "is-emphasis" : ""}`}>
          <p className="font-en text-xs uppercase tracking-[0.2em]">{point.titleEn}</p>
          <h3 className="work-h3-title mt-4 leading-tight tracking-[0.03em]">{point.titleZh}</h3>
          <p className="mt-5 text-base leading-8">{point.descriptionZh}</p>
          <p className="mt-3 font-en text-xs leading-6">{point.descriptionEn}</p>
        </article>
      ))}
    </section>
  );
}

function ProjectMetaList({ project }: { project: Project }) {
  const work = siteConfig.sections.work;
  const metaItems = [
    {
      labelZh: work.yearLabelZh,
      labelEn: work.yearLabelEn,
      value: project.year,
    },
    {
      labelZh: work.categoryLabelZh,
      labelEn: work.categoryLabelEn,
      value: project.category.zh,
    },
    {
      labelZh: work.toolsLabelZh,
      labelEn: work.toolsLabelEn,
      value: project.tools.join(" / "),
    },
    {
      labelZh: work.keywordsLabelZh,
      labelEn: work.keywordsLabelEn,
      value: project.keywords.join(" / "),
    },
  ];

  return (
    <div className="work-meta-list">
      {metaItems.map((item) => (
        <WorkMetaItem key={item.labelEn} labelZh={item.labelZh} labelEn={item.labelEn} value={item.value} />
      ))}
    </div>
  );
}

function WorkMetaItem({ labelZh, labelEn, value }: { labelZh: string; labelEn: string; value: string }) {
  return (
    <span className="work-meta-chip">
      <span className="font-en text-[0.65rem] uppercase tracking-[0.14em]">{labelEn}</span>
      <span className="text-sm font-semibold">{labelZh}</span>
      <span className="text-sm">{value}</span>
    </span>
  );
}

function WorkSquareImage({
  project,
  chapter,
  priority = false,
}: {
  project: Project;
  chapter: ProjectWorkChapter;
  priority?: boolean;
}) {
  const image = getChapterImage(project, chapter);

  if (!image) {
    return (
      <div className="work-square-image work-square-placeholder mt-10">
        <div>
          <p className="font-en text-xs uppercase tracking-[0.2em]">{chapter.placeholderEn}</p>
          <p className="mt-3 text-2xl font-semibold">{chapter.titleZh}</p>
        </div>
      </div>
    );
  }

  return (
    <ImageBlock
      src={image.src}
      alt={image.alt}
      className="work-square-image mt-10"
      priority={priority}
      placeholderText={image.placeholder}
      variant="square"
      aspectClassName="aspect-square"
    />
  );
}

function getChapterImage(project: Project, chapter: ProjectWorkChapter): ProjectImageSlot | null {
  return project.imageSlots[chapter.imageSlot] ?? null;
}

function ProjectMeta({ labelZh, labelEn, value }: { labelZh: string; labelEn: string; value: string }) {
  return (
    <span className="tag-pill">
      <span className="font-en text-[0.65rem] uppercase tracking-[0.12em] text-muted">{labelEn}</span>
      <span className="ml-2 text-sm">{labelZh}：{value}</span>
    </span>
  );
}

function ProjectTextStack({ sections, columns = false }: { sections: ProjectSection[]; columns?: boolean }) {
  return (
    <div className={`project-text-stack grid gap-7 ${columns ? "lg:grid-cols-2" : ""}`}>
      {sections.map((section) => (
        <section key={section.titleEn} className="project-text-block">
          <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">{section.titleEn}</p>
          <h4 className="text-2xl text-primary">{section.titleZh}</h4>
          <div className="mt-4 grid gap-3 text-lg leading-8">
            {section.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ImageStack({
  titleZh,
  titleEn,
  images,
  columns = false,
}: {
  titleZh: string;
  titleEn: string;
  images: ProjectImage[];
  columns?: boolean;
}) {
  const work = siteConfig.sections.work;

  return (
    <section className="image-stack grid gap-5">
      <div>
        <p className="mb-3 font-en text-xs uppercase tracking-[0.16em] text-muted">{titleEn}</p>
        <h4 className="text-2xl text-primary">{titleZh}</h4>
      </div>
      {images.length > 0 ? (
        <div className={`grid gap-6 ${columns ? "lg:grid-cols-2" : ""}`}>
          {images.map((image) => (
            <ImageBlock
              key={image.src}
              src={image.src}
              alt={image.alt}
              captionZh={image.captionZh}
              captionEn={image.captionEn}
              placeholderText={work.imagePlaceholderEn}
            />
          ))}
        </div>
      ) : (
        <div className="empty-frame grid aspect-[4/3] place-items-center rounded-[var(--radius)] px-8 text-center">
          <div>
            <p className="font-en text-xs uppercase tracking-[0.18em] text-muted">{work.imagePlaceholderEn}</p>
            <p className="mt-3 text-2xl font-semibold text-primary">{titleZh}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function getImagesByRole(images: ProjectImage[], role: NonNullable<ProjectImage["role"]>) {
  return images.filter((image) => image.role === role);
}

function contactItems() {
  return [
    siteConfig.contact.email,
    siteConfig.contact.phone,
    siteConfig.contact.wechat,
    siteConfig.contact.location,
  ];
}
