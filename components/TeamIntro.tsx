import Image from "next/image";

type Member = {
  name: string;
  role: string;
  photo: string;
};

export function TeamIntro({ members }: { members: Member[] }) {
  return (
    <div className="not-prose">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10 lg:gap-x-14">
        {members.map((m) => (
          <div key={m.name} className="flex flex-col items-center text-center">
            <div
              className="relative overflow-hidden rounded-full"
              style={{
                width: "100%",
                maxWidth: 128,
                aspectRatio: "1 / 1",
              }}
            >
              <Image
                src={m.photo}
                alt={m.name}
                fill
                className="object-cover grayscale"
                sizes="(min-width: 768px) 128px, 34vw"
              />
            </div>
            <p
              className="mt-4 text-[14px] font-normal leading-snug md:text-[15px]"
              style={{ color: "rgba(245,245,245,0.95)" }}
            >
              {m.name}
            </p>
            <p
              className="mt-1 text-[11px] md:text-[12px]"
              style={{ color: "rgba(203,203,203,0.75)" }}
            >
              {m.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
