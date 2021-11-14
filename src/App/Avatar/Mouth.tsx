import { styled } from "@linaria/react";
import { Props } from "./type";

export const Mouth = ({ pose, className, transform }: Props) => (
  <g className={className} transform={transform}>
    <Jitter className={pose}>
      <path
        d={mouthPaths[pose]}
        fill="#333"
        transform="matrix( 1.48944091796875, 0, 0, 1.48944091796875, -74,-155)"
      />
    </Jitter>
  </g>
);

const Jitter = styled.g`
  &.afternoon {
    animation: afternoon 1s linear infinite;
  }
  &.day {
    animation: day 600ms linear infinite;
  }
  &.night {
    transform: rotate(-122deg) scale(3, 1) rotate(122deg);
    animation: night 2.5s linear infinite;
  }
  &.morning {
    transform: scale(0.3);
  }

  @keyframes afternoon {
    0% {
      transform: scale(0.9);
    }
    60% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(0.9);
    }
  }

  @keyframes day {
    0% {
      transform: translate(0, 0) scale(1);
    }
    60% {
      transform: translate(-1px, 3px) scale(0.95);
    }
    100% {
      transform: translate(0, 0) scale(1);
    }
  }

  @keyframes night {
    0% {
      transform: rotate(-110deg) scale(0.2, 1) rotate(110deg);
    }
    35% {
      transform: translate(4px, 0) rotate(-110deg) scale(1.2, 1) rotate(110deg);
    }
    42% {
      transform: rotate(-110deg) scale(0.4, 1) rotate(110deg);
    }
    48% {
      transform: rotate(-110deg) scale(1.05, 1) rotate(110deg);
    }
    55% {
      transform: rotate(-110deg) scale(0.34, 1) rotate(110deg);
    }
    100% {
      transform: rotate(-110deg) scale(0.2, 1) rotate(110deg);
    }
  }
`;

const mouthPaths = {
  afternoon:
    "M 41.35 89.85Q 40.6 91.85 41.15 95.15 41.8 99.2 41.5 101.6 41.3 102.85 40.45 104.7 40 105.75 38.9 107.9 37.2 111.85 38.7 114.3 40.85 117.75 46.6 118.5 49.05 118.85 51.15 118.45 53.3 118 54.3 116.95 57.25 113.85 57.9 112.9 60.05 109.9 60.65 105.75 61.3 101.5 60.85 97.95 60.25 93.8 58.25 91.65 54.4 87.6 48.65 86.95 46 86.6 44.55 87 42.25 87.65 41.35 89.85 Z",
  morning:
    "M 51.75 96.55Q 48.65 94.7 45.85 95.75 44.25 96.3 42.75 97.65 41.25 98.95 41.15 100.4 41 101.9 41.2 102.7 41.3 103.45 42.7 106.6 43.1 107.65 43.65 110.05 44.45 111.9 45.95 112.8 48.55 114.6 51.65 113.75 54.8 112.8 56.1 109.45 56.5 108.4 56.15 107.05 55.9 105.7 54.95 103.2 54.4 101 54.05 99.9 53.95 99.65 53.9 99.45 53.8 99.2 53.7 99 53 97.3 51.75 96.55 Z",
  day: "M 51.45 97.6Q 47.45 96.5 43.5 95.8 37.6 94.6 37.4 95.35 36.7 97.8 36.55 99.55 36.4 101.5 36.7 104.65 36.85 106.55 37.4 107.85 38.05 109.55 39.65 111.3 41.9 113.75 44.85 114.9 48.2 116.25 51.5 115.4 55.2 114.45 56.2 114 59.55 112.7 62.35 109.75 64.2 107.55 65 106.15 66.1 103.95 65.35 102.25 64.85 101.1 51.45 97.6 Z",
  night:
    "M 51.75 96.55Q 48.65 94.7 45.85 95.75 44.25 96.3 42.75 97.65 41.25 98.95 41.15 100.4 41 101.9 41.2 102.7 41.3 103.45 42.7 106.6 43.1 107.65 43.65 110.05 44.45 111.9 45.95 112.8 48.55 114.6 51.65 113.75 54.8 112.8 56.1 109.45 56.5 108.4 56.15 107.05 55.9 105.7 54.95 103.2 54.4 101 54.05 99.9 53.95 99.65 53.9 99.45 53.8 99.2 53.7 99 53 97.3 51.75 96.55 Z",
};
