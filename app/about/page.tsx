import type { Metadata } from "next";
import Image from "next/image";
import { WorldEntrance } from "./WorldEntrance";
import { PhotoCollage } from "./PhotoCollage";

import s from "./about.module.css";
import a from "./summary.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jihyeon Jang is an AI Product Designer working from concept to product, creating clear, human-centered experiences for emerging technology.",
};

const experience = [
  { role: "Creative Partner", org: "Reve", period: "Apr 2026 – Present" },
  {
    role: "UI/UX Designer",
    org: "Autodesk × Academy of Art University",
    period: "Sep 2025 – Dec 2025",
  },
  {
    role: "UI/UX Design Intern",
    org: "nibnab",
    period: "Aug 2025 – Nov 2025",
  },
  {
    role: "Associate UI/UX Designer",
    org: "Heritage PACE",
    period: "Apr 2025 – Aug 2025",
  },
  {
    role: "UI/UX Designer",
    org: "Seeds of Empowerment · Stanford University",
    period: "Dec 2023 – Aug 2024",
  },
  { role: "Graphic Designer", org: "Foothill College", period: "Feb 2023 – Aug 2024" },
];

const education = [
  {
    degree: "M.A. Interaction & UI/UX Design",
    org: "Academy of Art University",
    period: "2026",
  },
  {
    degree: "Graphic & Interactive Design",
    org: "Foothill College",
    period: "2024",
  },
  {
    degree: "B.S. Home Economics Education",
    org: "Kyungpook National University",
    period: "2022",
  },
];

export default function AboutPage() {
  return (
    <div className={s.page}>
      <WorldEntrance />

      <section id="about-summary" tabIndex={-1} aria-labelledby="about-heading" className={`${a.summary} container-ultra`}>
        <div className={a.bio}>
          <div>
            <h2 id="about-heading">
              I design and build
              <br />
              new ways to interact with AI.
            </h2>
            <div className={a.body}>
              <p>I like trying things before I know exactly what I&apos;m doing. I was building with ChatGPT before “vibe coding” had a name, and that pretty much sums up how I learn: try it, make something, figure it out along the way.</p>
              <p>Before design, I was a teacher. Working with students taught me that people can see the same thing and understand it completely differently. I learned to notice where someone gets stuck, change how I explain something, and try again until it clicks.</p>
              <p>These days, I&apos;m usually making something. A product, a prototype, or occasionally something that started with, “wait, what if...?”</p>
            </div>
          </div>
          <PhotoCollage />
        </div>

        <div className={a.notes}>
          <article className={a.note}>
            <span className={a.noteNumber}>01</span>
            <div className={a.noteMedia}>
              <Image src="/images/about/memories/learn/2.jpg" alt="Jihyeon at AMD AI DevDay" fill sizes="(max-width: 767px) 100vw, 33vw" />
            </div>
            <h3>I love learning, and I learn by doing</h3>
            <p>Hackathons, workshops, and side projects constantly pull me into unfamiliar spaces. I&apos;m happiest when I&apos;m learning, experimenting, and turning ideas into something real.</p>
          </article>
          <article className={a.note}>
            <span className={a.noteNumber}>02</span>
            <div className={a.noteMedia}>
              <Image src="/images/about/memories/interest/1.jpg" alt="A physical AI robot interface" fill sizes="(max-width: 767px) 100vw, 33vw" />
            </div>
            <h3>Interested in Physical AI</h3>
            <p>I want to explore Physical AI and multi-sensory interaction more deeply. I&apos;m curious about interfaces that move beyond screens and become part of the physical world through vision, sound, movement, and space.</p>
          </article>
          <article className={a.note}>
            <span className={a.noteNumber}>03</span>
            <div className={a.noteMedia}>
              <Image src="/images/about/memories/visual/about-figma.jpg" alt="Jihyeon refining an interface in Figma" fill sizes="(max-width: 767px) 100vw, 33vw" />
            </div>
            <h3>Crafting the details</h3>
            <p>I bring visual design and prototyping together, shaping typography, composition, motion, and interaction into polished experiences. As a Creative Partner at Reve, I explore AI as a tool for extending that craft.</p>
          </article>
        </div>

      <div className={a.credentials}>
        <div className={a.credentialColumn}>
          <h2>Experience</h2>
          <ul>
            {experience.map((item) => (
              <li key={`${item.org}-${item.role}`}>
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.org}</p>
                </div>
                <span>{item.period}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={a.credentialColumn}>
          <h2>Education</h2>
          <ul>
            {education.map((item) => (
              <li key={`${item.org}-${item.degree}`}>
                <div>
                  <h3>{item.degree}</h3>
                  <p>{item.org}</p>
                </div>
                <span>{item.period}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </section>
    </div>
  );
}
