"use client";

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

export function CardWavePreview() {
  return (
    <div className="mx-auto flex w-fit gap-2 overflow-x-auto md:gap-0">
      <LinearCard isLast={true}>
        <LinearCardHeader>FIG 0.2</LinearCardHeader>
        <LinearCardSVGContainer>
          <CardWave
            cardWidth={140}
            defaultHoverIndex={5}
            startX={220}
            startY={100}
          />
        </LinearCardSVGContainer>
        <LinearCardBody>
          <LinearCardHeading>Designed for speed</LinearCardHeading>
          <LinearCardSubheading>
            Reduces noise and restores momentum to help teams ship with high
            velocity and focus.
          </LinearCardSubheading>
        </LinearCardBody>
      </LinearCard>
    </div>
  );
}
