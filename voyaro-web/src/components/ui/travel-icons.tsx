"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const iconBase = (props: IconProps) => ({
  width: props.size || 24,
  height: props.size || 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: cn("shrink-0", props.className),
  ...props,
});

// Beach & Water
export const BeachIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 3v2M5.5 7.5l1.5 1.5M18.5 7.5l-1.5 1.5M4 14h16M6 14c0-3.5 2.5-6 6-6s6 2.5 6 6" />
    <path d="M9 18l1-4M15 18l-1-4M7 21h10" />
  </svg>
);

export const SwimmingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M2 18c1.5-1 3-1.5 4.5-1s3 1.5 4.5 1 3-.5 4.5-1 3 0 4.5 1" />
    <path d="M2 14c1.5-1 3-1.5 4.5-1s3 1.5 4.5 1 3-.5 4.5-1 3 0 4.5 1" />
    <circle cx="12" cy="7" r="2" />
    <path d="M9 10l3 2 3-2" />
  </svg>
);

export const SurfingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M2 20c2-2 4-3 7-3 4 0 6.5 2 9 3" />
    <path d="M5 17l2-8c.5-2 2-3 4-3s3.5 1 4 3l2 8" />
    <circle cx="11" cy="8" r="1.5" />
  </svg>
);

export const DivingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v4M8 17c0-2 2-4 4-4s4 2 4 4" />
    <path d="M6 21c1-1.5 2-2 3-2M18 21c-1-1.5-2-2-3-2" />
    <path d="M3 13h3M18 13h3" />
  </svg>
);

export const BoatIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M4 18l1-5h14l1 5" />
    <path d="M2 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
    <path d="M12 4v4M9 8h6" />
    <path d="M12 8l4 5H8l4-5" />
  </svg>
);

export const YachtIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M2 20l2-2h16l2 2" />
    <path d="M4 18l2-10h12l2 10" />
    <path d="M12 4v4M10 8h4" />
    <path d="M12 8l3 6H9l3-6" />
  </svg>
);

// Mountains & Adventure
export const MountainIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M8 21l4-10 4 10" />
    <path d="M2 21l5-8 3 4" />
    <path d="M22 21l-5-8-3 4" />
    <path d="M12 11l-1.5-2L12 7l1.5 2L12 11z" />
  </svg>
);

export const HikingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="4" r="2" />
    <path d="M7 21l3-9M17 21l-3-9" />
    <path d="M12 6v4l-2 3h4l-2-3" />
    <path d="M5 14l2-2M19 14l-2-2" />
    <path d="M14 10l4-4M10 10l-4-4" />
  </svg>
);

export const CampingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 3l8 15H4l8-15z" />
    <path d="M12 18v-6" />
    <path d="M9 18h6" />
    <circle cx="18" cy="5" r="1" />
    <circle cx="20" cy="8" r="0.5" />
  </svg>
);

export const ClimbingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M4 21l6-14 4 8 6-12" />
    <circle cx="10" cy="5" r="2" />
    <path d="M14 9l2-2M8 13l-2 2" />
  </svg>
);

export const SkiingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="4" r="2" />
    <path d="M6 21l6-9 6 9" />
    <path d="M4 15l16 4M4 19l16-4" />
    <path d="M12 6v3" />
  </svg>
);

export const SnowboardingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="14" cy="4" r="2" />
    <path d="M6 20l12-4" />
    <path d="M10 8l-2 6 4 2 4-4" />
    <path d="M8 14l-3 2M16 12l3-1" />
  </svg>
);

// City & Urban
export const CityIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <rect x="3" y="9" width="5" height="12" rx="0.5" />
    <rect x="10" y="3" width="4" height="18" rx="0.5" />
    <rect x="16" y="7" width="5" height="14" rx="0.5" />
    <path d="M5 12h1M5 15h1M12 6h0M12 9h0M12 12h0M12 15h0M18 10h1M18 13h1M18 16h1" />
  </svg>
);

export const ShoppingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M6 6h15l-1.5 9h-12z" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
    <path d="M6 6l-1-4H2" />
  </svg>
);

export const NightlifeIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 3c-1.5 2-2 4-2 6 0 3 2 5 2 5s2-2 2-5c0-2-.5-4-2-6z" />
    <path d="M8 21h8" />
    <path d="M10 14l2 7 2-7" />
    <circle cx="6" cy="6" r="1" />
    <circle cx="18" cy="8" r="1" />
    <circle cx="4" cy="12" r="0.5" />
    <circle cx="20" cy="4" r="0.5" />
  </svg>
);

export const CasinoIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <rect x="4" y="4" width="7" height="10" rx="1" />
    <rect x="13" y="4" width="7" height="10" rx="1" />
    <circle cx="7.5" cy="7" r="1" />
    <circle cx="7.5" cy="11" r="1" />
    <circle cx="16.5" cy="9" r="1" />
    <path d="M6 17h12l-1 4H7l-1-4z" />
  </svg>
);

// Culture & History
export const MuseumIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M3 21h18" />
    <path d="M5 21v-8M9 21v-8M15 21v-8M19 21v-8" />
    <path d="M3 13h18" />
    <path d="M12 3l9 7H3l9-7z" />
  </svg>
);

export const TempleIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 2l8 6v2H4V8l8-6z" />
    <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
    <path d="M4 18h16" />
    <path d="M2 21h20" />
  </svg>
);

export const CastleIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M4 21v-10l2-2v-4l2 1v-3h2v3l2-1v-3h2v3l2 1v-3h2v3l2-1v4l2 2v10" />
    <path d="M4 21h16" />
    <rect x="9" y="15" width="6" height="6" />
  </svg>
);

export const ArtIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M7 15l3-4 2 2 4-5 4 5" />
    <circle cx="8" cy="10" r="1.5" />
  </svg>
);

export const TheaterIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="8" cy="9" r="5" />
    <circle cx="16" cy="9" r="5" />
    <path d="M5 11c1 2 2 3 3 3M11 11c-1 2-2 3-3 3" />
    <path d="M13 7c1-1 2-1 3 0M19 7c-1-1-2-1-3 0" />
    <path d="M14 11c.5 1 1 1.5 2 1.5M18 11c-.5 1-1 1.5-2 1.5" />
    <path d="M4 19h16" />
  </svg>
);

export const MusicIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

// Food & Drink
export const FoodIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M3 6h18M3 6c0 3-1 6 0 9h18c1-3 0-6 0-9" />
    <path d="M5 15v6M19 15v6" />
    <path d="M12 6v-3M9 6c0-2 1-3 3-3s3 1 3 3" />
  </svg>
);

export const WineIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M8 2h8l-1 8c0 2-1.5 3-3 3s-3-1-3-3l-1-8z" />
    <path d="M12 13v5" />
    <path d="M8 21h8" />
    <path d="M7 6h10" />
  </svg>
);

export const CoffeeIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M17 8h1a3 3 0 010 6h-1" />
    <path d="M3 8h14v9a3 3 0 01-3 3H6a3 3 0 01-3-3V8z" />
    <path d="M6 2v3M10 2v3M14 2v3" />
  </svg>
);

export const BeerIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M17 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2" />
    <rect x="5" y="6" width="12" height="15" rx="1" />
    <path d="M5 10h12" />
    <path d="M8 2c0 2 2 4 4 4s4-2 4-4" />
  </svg>
);

export const LocalCuisineIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <ellipse cx="12" cy="16" rx="8" ry="4" />
    <path d="M4 16c0-4 3.5-8 8-8s8 4 8 8" />
    <path d="M12 8V5M9 6l3-1 3 1" />
    <path d="M8 14h0M12 14h0M16 14h0" />
  </svg>
);

// Nature & Wildlife
export const WildlifeIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M8 6l-2-3M16 6l2-3" />
    <path d="M12 12v3" />
    <ellipse cx="12" cy="18" rx="6" ry="3" />
    <path d="M10 8h0M14 8h0M11 10h2" />
  </svg>
);

export const SafariIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M4 18h16" />
    <path d="M6 18v-6l6-8 6 8v6" />
    <circle cx="12" cy="10" r="2" />
    <path d="M12 12v2M10 14h4" />
  </svg>
);

export const ForestIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 3l-4 6h8l-4-6z" />
    <path d="M12 7l-5 8h10l-5-8z" />
    <path d="M12 12l-6 9h12l-6-9z" />
    <path d="M12 21v-4" />
  </svg>
);

export const GardenIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 21v-8" />
    <path d="M12 13c-3 0-5-2-5-5 0-2 2-5 5-5s5 3 5 5c0 3-2 5-5 5z" />
    <path d="M8 16c-2 0-4 1-4 3M16 16c2 0 4 1 4 3" />
  </svg>
);

export const BirdwatchingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M16 8c3 0 5 2 5 5l-4 1" />
    <ellipse cx="10" cy="11" rx="7" ry="5" />
    <path d="M3 11l3 1" />
    <circle cx="8" cy="10" r="1" />
    <path d="M12 16l-1 5M8 16l1 5" />
  </svg>
);

// Wellness & Relaxation
export const SpaIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 21c-4 0-7-3-7-7 0-3 2-6 5-8 1 3 2 5 2 8 0-3 1-5 2-8 3 2 5 5 5 8 0 4-3 7-7 7z" />
    <path d="M12 13v4" />
  </svg>
);

export const YogaIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="5" r="2" />
    <path d="M4 17l8-5 8 5" />
    <path d="M12 12v5" />
    <path d="M8 21h8" />
  </svg>
);

export const MeditationIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v3" />
    <path d="M7 21c0-3 2-5 5-5s5 2 5 5" />
    <path d="M5 16l2 1M19 16l-2 1" />
    <path d="M12 16c-1-2-1-3 0-4" />
  </svg>
);

export const HotSpringIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <ellipse cx="12" cy="17" rx="8" ry="4" />
    <path d="M4 17c0-2 3.5-4 8-4s8 2 8 4" />
    <path d="M8 8c0-2 1-3 1-5M12 8c0-2 1-3 1-5M16 8c0-2 1-3 1-5" />
  </svg>
);

// Active & Sports
export const GolfIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="18" cy="18" r="3" />
    <path d="M4 4l14 10-4 1 4 1" />
    <path d="M4 4v17" />
    <path d="M4 8l6 4" />
  </svg>
);

export const TennisIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5 5c4 4 4 10 0 14" />
    <path d="M19 5c-4 4-4 10 0 14" />
    <path d="M3 12h18" />
  </svg>
);

export const CyclingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M6 17l4-7h4l2 3h2" />
    <path d="M10 10l4 7" />
    <circle cx="12" cy="7" r="2" />
  </svg>
);

export const RunningIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="14" cy="4" r="2" />
    <path d="M4 17l4-2 3 2 4-4" />
    <path d="M15 13l4-2" />
    <path d="M7 21l4-6M17 21l-2-8" />
  </svg>
);

export const FishingIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M18 3l-3 18" />
    <path d="M15 6c-4 1-6 4-6 8" />
    <path d="M4 14c2-1 4 0 5 2s1 4-1 5" />
    <circle cx="6" cy="17" r="1" />
  </svg>
);

export const GymIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M3 12h18" />
    <rect x="1" y="9" width="4" height="6" rx="0.5" />
    <rect x="19" y="9" width="4" height="6" rx="0.5" />
    <rect x="5" y="7" width="3" height="10" rx="0.5" />
    <rect x="16" y="7" width="3" height="10" rx="0.5" />
  </svg>
);

// Special Interest
export const PhotographyIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <circle cx="12" cy="13" r="4" />
    <path d="M6 6V4h4l1 2" />
    <circle cx="12" cy="13" r="1.5" />
  </svg>
);

export const RoadTripIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M5 17h14l2-7-3-4H6L3 10l2 7z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M5 10h14" />
    <path d="M10 6h4" />
  </svg>
);

export const TrainIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <rect x="4" y="4" width="16" height="14" rx="2" />
    <path d="M4 11h16" />
    <path d="M12 4v7" />
    <circle cx="8" cy="15" r="1" />
    <circle cx="16" cy="15" r="1" />
    <path d="M8 18l-2 3M16 18l2 3" />
  </svg>
);

export const CruiseIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M2 19c3-2 6-2 10-2s7 0 10 2" />
    <path d="M4 17l2-8h12l2 8" />
    <path d="M8 9V6h8v3" />
    <path d="M12 3v3" />
    <rect x="6" y="11" width="4" height="3" />
    <rect x="14" y="11" width="4" height="3" />
  </svg>
);

export const HelicopterIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M4 6h16" />
    <ellipse cx="12" cy="12" rx="5" ry="3" />
    <path d="M12 6v3" />
    <path d="M17 12h4l-1 2h-3" />
    <path d="M9 15l-2 4M15 15l2 4" />
  </svg>
);

export const HotAirBalloonIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 2c-4 0-7 4-7 8 0 3 2 5 4 6l1 2h4l1-2c2-1 4-3 4-6 0-4-3-8-7-8z" />
    <rect x="9" y="18" width="6" height="4" rx="0.5" />
    <path d="M12 2v8" />
    <path d="M8 6c2 2 6 2 8 0" />
  </svg>
);

// Family & Social
export const FamilyIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="8" cy="6" r="2" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="12" cy="14" r="2" />
    <path d="M8 8v4c0 1 1 2 2 2M16 8v4c0 1-1 2-2 2" />
    <path d="M12 16v5M8 21h8" />
  </svg>
);

export const RomanticIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 21C12 21 3 13 3 8c0-3 2-5 5-5 2 0 3 1 4 3 1-2 2-3 4-3 3 0 5 2 5 5 0 5-9 13-9 13z" />
  </svg>
);

export const SoloIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="12" cy="7" r="4" />
    <path d="M12 11v10" />
    <path d="M8 14h8" />
    <path d="M9 21h6" />
  </svg>
);

export const GroupIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <circle cx="12" cy="16" r="3" />
    <path d="M5 14c0-2 1-3 3-3M19 14c0-2-1-3-3-3" />
    <path d="M9 21c0-1 1-2 3-2s3 1 3 2" />
  </svg>
);

export const PetFriendlyIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <ellipse cx="12" cy="14" rx="6" ry="5" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="6" r="2" />
    <circle cx="5" cy="11" r="1.5" />
    <circle cx="19" cy="11" r="1.5" />
    <path d="M10 14h0M14 14h0M11 16h2" />
  </svg>
);

// Luxury & Premium
export const LuxuryIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" />
  </svg>
);

export const PrivateJetIcon = (props: IconProps) => (
  <svg {...iconBase(props)}>
    <path d="M21 15l-6-2-3-9-3 9-6 2 6 2v4l3-2 3 2v-4l6-2z" />
    <path d="M12 4v5" />
  </svg>
);

// Map of all icons by slug
export const travelIcons: Record<string, React.FC<IconProps>> = {
  // Beach & Water
  beach: BeachIcon,
  swimming: SwimmingIcon,
  surfing: SurfingIcon,
  diving: DivingIcon,
  boat: BoatIcon,
  yacht: YachtIcon,
  cruise: CruiseIcon,

  // Mountains & Adventure
  mountain: MountainIcon,
  adventure: MountainIcon,
  hiking: HikingIcon,
  camping: CampingIcon,
  climbing: ClimbingIcon,
  skiing: SkiingIcon,
  snowboarding: SnowboardingIcon,

  // City & Urban
  city: CityIcon,
  shopping: ShoppingIcon,
  nightlife: NightlifeIcon,
  casino: CasinoIcon,

  // Culture & History
  culture: MuseumIcon,
  museum: MuseumIcon,
  temple: TempleIcon,
  castle: CastleIcon,
  art: ArtIcon,
  theater: TheaterIcon,
  music: MusicIcon,

  // Food & Drink
  food: FoodIcon,
  food_wine: WineIcon,
  wine: WineIcon,
  coffee: CoffeeIcon,
  beer: BeerIcon,
  local_cuisine: LocalCuisineIcon,

  // Nature & Wildlife
  wildlife: WildlifeIcon,
  safari: SafariIcon,
  forest: ForestIcon,
  garden: GardenIcon,
  birdwatching: BirdwatchingIcon,

  // Wellness & Relaxation
  relax: SpaIcon,
  spa: SpaIcon,
  yoga: YogaIcon,
  meditation: MeditationIcon,
  hot_spring: HotSpringIcon,

  // Active & Sports
  golf: GolfIcon,
  tennis: TennisIcon,
  cycling: CyclingIcon,
  running: RunningIcon,
  fishing: FishingIcon,
  gym: GymIcon,
  activities: RunningIcon,

  // Special Interest
  photography: PhotographyIcon,
  road_trip: RoadTripIcon,
  train: TrainIcon,
  helicopter: HelicopterIcon,
  hot_air_balloon: HotAirBalloonIcon,

  // Family & Social
  family: FamilyIcon,
  romantic: RomanticIcon,
  solo: SoloIcon,
  group: GroupIcon,
  pet_friendly: PetFriendlyIcon,

  // Luxury
  luxury: LuxuryIcon,
  private_jet: PrivateJetIcon,
};

// Get icon component by slug
export function getTravelIcon(slug: string): React.FC<IconProps> | null {
  return travelIcons[slug] || null;
}

// Travel Icon component that renders by slug
export function TravelIcon({
  slug,
  size = 24,
  className,
  ...props
}: IconProps & { slug: string }) {
  const IconComponent = travelIcons[slug];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
}
