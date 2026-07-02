import Link from "next/link";
import type { ReactNode } from "react";
import { HeroMarquee } from "@/components/HeroMarquee";
import { ImageBlock } from "@/components/ImageBlock";
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
import { assetPath } from "@/lib/assetPath";

const workVisualAssets = {
  designWorksTitle: assetPath("/assets/work/design-works-title.png"),
  letterZooTitle: assetPath("/assets/work/letter-zoo/letter-zoo-title.png"),
  letterZooBubble: assetPath("/assets/work/letter-zoo/bubble-wrap.png"),
  letterZooAnimals: [
    {
      key: "a",
      src: assetPath("/assets/work/letter-zoo/animal-a.png"),
      alt: "A letter animal",
      className: "letter-zoo-animal-a letter-zoo-animal-hop",
    },
    {
      key: "b",
      src: assetPath("/assets/work/letter-zoo/bear-letter.png"),
      alt: "B bear letter",
      className: "letter-zoo-animal-b letter-zoo-animal-wave",
    },
    {
      key: "c",
      src: assetPath("/assets/work/letter-zoo/animal-c.png"),
      alt: "C cat letter",
      className: "letter-zoo-animal-c letter-zoo-animal-hop",
    },
    {
      key: "z",
      src: assetPath("/assets/work/letter-zoo/animal-z.png"),
      alt: "Z zebra letter",
      className: "letter-zoo-animal-z letter-zoo-animal-wobble",
    },
    {
      key: "o",
      src: assetPath("/assets/work/letter-zoo/animal-o.svg"),
      alt: "O owl letter",
      className: "letter-zoo-animal-o letter-zoo-animal-float",
    },
  ],
};

export default function HomePage() {
  return (
    <main className="portfolio-page">
      <StyledHero />
      <AboutSection />
      <AboutWorkRibbon />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

function AboutWorkRibbon() {
  return <HeroMarquee src={siteConfig.hero.marquee.top} direction="left" className="section-divider-marquee" />;
}

function AboutSection() {
  const about = siteConfig.sections.about;

  return (
    <section id="about" className="about-board-section">
      <div className="page-shell about-board-shell">
        <Reveal className="about-board-screen about-profile-screen">
          <div className="about-profile-info">
            <AboutModule label="PROFILE" className="about-profile-module">
              <p className="about-module-kicker font-en">ABOUT PROFILE</p>
              <h2 className="about-profile-name text-primary">{siteConfig.authorName}</h2>
              <p className="about-profile-en font-en">{siteConfig.authorNameEn}</p>
              <p className="about-profile-line">{siteConfig.about.profileLine}</p>
              <p className="about-profile-bio">{siteConfig.about.bioZh}</p>
              <div className="about-keyword-row">
                {siteConfig.about.designDirections.slice(0, 3).map((item) => (
                  <span key={item.titleZh} className="about-soft-highlight">
                    {item.titleZh}
                  </span>
                ))}
              </div>
            </AboutModule>

            <div className="about-profile-grid">
              <ContactModule />
              <EducationModule />
              <DirectionModule />
            </div>
          </div>

          <div className="about-visual-zone" aria-label={siteConfig.about.portrait.alt}>
            <AboutVisual />
          </div>
        </Reveal>

        <Reveal className="about-board-screen about-index-screen" delay={120}>
          <div className="about-index-top">
            <WorkExperienceGroup />
            <ProjectExperienceGroup />
            <ObjectiveModule />
          </div>

          <div className="about-index-bottom">
            <TagCloudModule label={about.designSkillsTitleEn} titleZh={about.designSkillsTitleZh} items={siteConfig.about.designSkills} />
            <ToolIconModule label={about.toolsTitleEn} titleZh={about.toolsTitleZh} items={siteConfig.about.tools} />
            <TagCloudModule label={about.aigcToolsTitleEn} titleZh={about.aigcToolsTitleZh} items={siteConfig.about.aigcTools} />
            <TagCloudModule label={about.softSkillsTitleEn} titleZh={about.softSkillsTitleZh} items={siteConfig.about.softSkills} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const work = siteConfig.sections.work;

  return (
    <section id="work" className="work-section section-space">
      <div className="page-shell">
        <Reveal className="work-heading mx-auto mb-20 max-w-6xl text-center">
          <p className="mb-5 font-en text-xs uppercase tracking-[0.22em]">{work.titleEn}</p>
          <h2 className="sr-only">{work.titleZh}</h2>
          <img className="work-section-title-image" src={workVisualAssets.designWorksTitle} alt={work.titleZh} loading="lazy" />
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
        <header className={`work-project-cover mx-auto max-w-5xl text-center ${index === 0 ? "is-letter-zoo-project" : ""}`}>
          {index === 0 ? (
            <LetterZooProjectTitle title={project.title.zh} />
          ) : (
            <h1 className="work-project-title mt-9 text-5xl leading-[1.18] tracking-[0.05em] md:text-8xl">
              {project.title.zh}
            </h1>
          )}
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

function LetterZooProjectTitle({ title }: { title: string }) {
  return (
    <div className="letter-zoo-title-card mt-9" aria-label={title}>
      <h1 className="sr-only">{title}</h1>
      <img className="letter-zoo-bubble" src={workVisualAssets.letterZooBubble} alt="" aria-hidden="true" loading="lazy" />
      <img className="letter-zoo-title-image" src={workVisualAssets.letterZooTitle} alt="字母动物园" loading="lazy" />
      <div className="letter-zoo-animal-layer" aria-hidden="true">
        {workVisualAssets.letterZooAnimals.map((animal) => (
          <img key={animal.key} className={`letter-zoo-animal ${animal.className}`} src={animal.src} alt={animal.alt} loading="lazy" />
        ))}
      </div>
    </div>
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

function AboutVisual() {
  const portrait = siteConfig.about.portrait;

  return (
    <div className="about-visual about-visual-photo">
      <img className="about-visual-photo-image" src={portrait.src} alt={portrait.alt} loading="lazy" />
    </div>
  );
}

function AboutModule({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`about-info-module ${className}`}>
      <p className="about-module-label font-en">{label}</p>
      {children}
    </section>
  );
}

function ContactModule() {
  return (
    <AboutModule label={siteConfig.sections.about.contactTitleEn}>
      <h3 className="about-module-title">{siteConfig.sections.about.contactTitleZh}</h3>
      <div className="about-line-list">
        {siteConfig.about.profileContact.map((item) => (
          <p key={item.label} className="about-info-line">
            <span className="about-line-label font-en">{item.label}</span>
            <span>{item.value}</span>
          </p>
        ))}
      </div>
    </AboutModule>
  );
}

function EducationModule() {
  const education = siteConfig.about.education[0];

  return (
    <AboutModule label={siteConfig.sections.about.educationTitleEn}>
      <h3 className="about-module-title">{siteConfig.sections.about.educationTitleZh}</h3>
      <div className="about-line-list">
        <p className="about-strong-line">{education.titleZh}</p>
        <p>{education.titleEn}</p>
        <p className="about-highlight-line font-en">{education.period}</p>
      </div>
    </AboutModule>
  );
}

function DirectionModule() {
  return (
    <AboutModule label={siteConfig.sections.about.directionTitleEn} className="about-direction-module">
      <h3 className="about-module-title">{siteConfig.sections.about.directionTitleZh}</h3>
      <div className="about-mini-tags">
        {siteConfig.about.designDirections.map((item) => (
          <span key={item.titleZh} className="about-mini-tag">
            {item.titleZh}
          </span>
        ))}
      </div>
    </AboutModule>
  );
}

function WorkExperienceGroup() {
  const about = siteConfig.sections.about;

  return (
    <AboutModule label={about.workExperienceTitleEn} className="about-index-module">
      <h3 className="about-module-title">{about.workExperienceTitleZh}</h3>
      <div className="about-index-list">
        {siteConfig.about.workExperience.map((item) => (
          <article key={`${item.period}-${item.organizationZh}`} className="about-experience-item">
            <p className="about-highlight-line font-en">{item.period}</p>
            <h4>{item.organizationZh}</h4>
            <p>{item.roleZh}</p>
          </article>
        ))}
      </div>
    </AboutModule>
  );
}

function ProjectExperienceGroup() {
  const about = siteConfig.sections.about;

  return (
    <AboutModule label={about.projectExperienceTitleEn} className="about-index-module">
      <h3 className="about-module-title">{about.projectExperienceTitleZh}</h3>
      <div className="about-index-list">
        {siteConfig.about.projectExperience.map((item) => (
          <article key={item.index} className="about-project-item">
            <p className="about-project-index font-en">{item.index}</p>
            <h4>{item.titleZh}</h4>
            <p className="font-en">{item.titleEn}</p>
          </article>
        ))}
      </div>
    </AboutModule>
  );
}

function ObjectiveModule() {
  const about = siteConfig.sections.about;

  return (
    <AboutModule label={about.objectiveTitleEn} className="about-objective-module about-index-module">
      <h3 className="about-module-title">{about.objectiveTitleZh}</h3>
      <p className="about-objective-text">{siteConfig.about.objective}</p>
      <div className="about-keyword-row">
        <span className="about-soft-highlight">品牌视觉</span>
        <span className="about-soft-highlight">图案系统</span>
        <span className="about-soft-highlight">儿童消费场景</span>
      </div>
    </AboutModule>
  );
}

function TagCloudModule({ label, titleZh, items }: { label: string; titleZh: string; items: string[] }) {
  return (
    <AboutModule label={label} className="about-tag-module">
      <h3 className="about-module-title">{titleZh}</h3>
      <div className="about-mini-tags">
        {items.map((item) => (
          <span key={item} className="about-mini-tag">
            {item}
          </span>
        ))}
      </div>
    </AboutModule>
  );
}

function ToolIconModule({
  label,
  titleZh,
  items,
}: {
  label: string;
  titleZh: string;
  items: Array<{ name: string; icon: string }>;
}) {
  return (
    <AboutModule label={label} className="about-tag-module about-tool-icon-module">
      <h3 className="about-module-title">{titleZh}</h3>
      <div className="about-tool-icon-grid">
        {items.map((item) => (
          <article key={item.name} className="about-tool-icon-item">
            <img src={item.icon} alt={`${item.name} icon`} loading="lazy" />
            <span className="font-en">{item.name}</span>
          </article>
        ))}
      </div>
    </AboutModule>
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
        <WorkSquareImage project={project} chapter={chapter} />
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
}: {
  project: Project;
  chapter: ProjectWorkChapter;
}) {
  const image = getChapterImage(project, chapter);

  return (
    <div className="work-square-image work-square-placeholder mt-10" role="img" aria-label={image?.alt ?? chapter.titleZh}>
      <div>
        <p className="font-en text-xs uppercase tracking-[0.2em]">{chapter.placeholderEn}</p>
        <p className="mt-3 text-2xl font-semibold">{chapter.titleZh}</p>
        <p className="mt-3 text-base font-semibold">项目图像整理中</p>
      </div>
    </div>
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
