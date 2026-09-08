import Image from "next/image";
import { AeonWireframePanorama } from "./AeonWireframePanorama";

export function AeonDesignDevelopmentFigures() {
  return (
    <div className="not-prose space-y-3 md:space-y-4">
      <AeonWireframePanorama />
      <figure className="relative m-0 aspect-[4517/2964] w-full overflow-hidden rounded-none bg-black">
        <Image
          src="/images/aeon/ia/overview.jpg"
          alt="AEON HMI design overview showing navigation, controls, and interaction concepts"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 80vw, 100vw"
        />
      </figure>
    </div>
  );
}
