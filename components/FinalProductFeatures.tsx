import { MediaVideo } from "./MediaVideo";

type Feature = {
  number: string;
  title: string;
  body: string;
  videoSrc: string;
  videoDescription: string;
};

type Props = {
  features: Feature[];
};

export function FinalProductFeatures({ features }: Props) {
  return (
    <div className="border-y border-ink/10">
      {features.map((feature, index) => (
        <article
          key={feature.number}
          className={[
            "py-12 md:py-16",
            index > 0 ? "border-t border-ink/10" : "",
          ].join(" ")}
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
              Feature {feature.number}
            </p>
            <h3 className="mt-3 t-h3">{feature.title}</h3>
            <p className="mt-4 t-body">{feature.body}</p>
          </div>

          <div className="mt-8 min-w-0 md:mt-10">
              <MediaVideo
                src={feature.videoSrc}
                description={feature.videoDescription}
                ratio="16/9"
                controls
                objectFit="contain"
              />
          </div>
        </article>
      ))}
    </div>
  );
}
