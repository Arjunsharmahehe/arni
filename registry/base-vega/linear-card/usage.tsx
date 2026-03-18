import Image from "next/image";
import CardWave from "@/registry/base-vega/card-wave/card-wave";
import {
  LinearCard,
  LinearCardBody,
  LinearCardHeader,
  LinearCardHeading,
  LinearCardImageContainer,
  LinearCardSubheading,
  LinearCardSVGContainer,
} from "@/registry/base-vega/linear-card/linear-card";

// Image variant
<LinearCard>
  <LinearCardHeader>FIG 0.1</LinearCardHeader>
  <LinearCardImageContainer>
    <Image
      src="/your-image.png"
      alt="Card image"
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="cover"
    />
  </LinearCardImageContainer>
  <LinearCardBody>
    <LinearCardHeading>Designed for speed</LinearCardHeading>
    <LinearCardSubheading>
      Reduces noise and restores momentum.
    </LinearCardSubheading>
  </LinearCardBody>
</LinearCard>;

// SVG variant
<LinearCard isLast>
  <LinearCardHeader>FIG 0.2</LinearCardHeader>
  <LinearCardSVGContainer>
    <CardWave cardWidth={140} defaultHoverIndex={5} />
  </LinearCardSVGContainer>
  <LinearCardBody>
    <LinearCardHeading>Designed for speed</LinearCardHeading>
    <LinearCardSubheading>
      Reduces noise and restores momentum.
    </LinearCardSubheading>
  </LinearCardBody>
</LinearCard>;
