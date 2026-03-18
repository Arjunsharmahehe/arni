import CardWave from "@/registry/base-vega/card-wave/card-wave";
import {
  LinearCard,
  LinearCardBody,
  LinearCardHeader,
  LinearCardHeading,
  LinearCardSubheading,
  LinearCardSVGContainer,
} from "@/registry/base-vega/linear-card/linear-card";

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
