"use client";
import CardWave from "@/components/reactive-svg/card-wave";
import {
  LinearCard,
  LinearCardBody,
  LinearCardHeader,
  LinearCardHeading,
  LinearCardImageContainer,
  LinearCardSubheading,
  LinearCardSVGContainer,
} from "@/components/ui/linear-card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-fit flex overflow-x-auto mx-auto gap-2 md:gap-0">
        <LinearCard>
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
        <LinearCard>
          <LinearCardHeader>FIG 0.1</LinearCardHeader>
          <LinearCardImageContainer>
            <Image
              src="/linear-card-image.png"
              alt="Linear Card Image"
              fill
              className="cover"
            />
          </LinearCardImageContainer>
          <LinearCardBody>
            <LinearCardHeading>Designed for speed</LinearCardHeading>
            <LinearCardSubheading>
              Reduces noise and restores momentum to help teams ship with high
              velocity and focus.
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
    </div>
  );
}
