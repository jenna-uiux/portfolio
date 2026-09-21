import { Hero } from "@/components/Hero";
import { CaseStudyTeaser } from "@/components/CaseStudyTeaser";
import { HomeFunSection } from "@/components/HomeFunSection";
import { getFeatured } from "@/lib/projects";

export default function HomePage() {
  const featured = getFeatured();

  return (
    <>
      <Hero />

      <div id="work" className="mt-[52px] md:mt-[100px]">
        {featured.map((project, index) => (
          <CaseStudyTeaser
            key={project.slug}
            project={project}
            index={index}
          />
        ))}
      </div>

      <HomeFunSection />
    </>
  );
}
