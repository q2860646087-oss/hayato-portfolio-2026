import { assetPath } from "@/lib/assetPath";

const RIBBON_SRC = assetPath("/images/abczoo/ribbons/project-one-ribbon.webp");

export function ProjectOneRibbon() {
  return (
    <div className="project-one-ribbon" aria-hidden="true">
      <div className="project-one-ribbon-track">
        {[0, 1, 2].map((copy) => (
          <img
            className="project-one-ribbon-image"
            src={RIBBON_SRC}
            alt=""
            draggable={false}
            key={copy}
          />
        ))}
      </div>
    </div>
  );
}
