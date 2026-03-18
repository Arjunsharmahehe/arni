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

export function LinearCardPreview() {
  return (
    <div className="mx-auto flex w-fit gap-2 overflow-x-auto md:gap-0">
      <LinearCard>
        <LinearCardHeader>FIG 0.1</LinearCardHeader>
        <LinearCardImageContainer>
          <Image
            src="/Linear-card-image.png"
            alt="Linear Card Image"
            fill
            className="cover"
          />
        </LinearCardImageContainer>
        <LinearCardBody>
          <LinearCardHeading>Built for purpose</LinearCardHeading>
          <LinearCardSubheading>
            Linear is shaped by the practices and principles of world-class
            product teams.
          </LinearCardSubheading>
        </LinearCardBody>
      </LinearCard>
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
