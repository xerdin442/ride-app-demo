import { CarPackageSlug } from "@/lib/types";
import { Truck, Crown, Car } from "lucide-react";

export const CarPackageDetails: Record<
  CarPackageSlug,
  {
    name: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  [CarPackageSlug.SEDAN]: {
    name: "Sedan",
    icon: <Car />,
    description: "Economic and comfortable",
  },
  [CarPackageSlug.SUV]: {
    name: "SUV",
    icon: <Truck />,
    description: "Spacious ride for groups",
  },
  [CarPackageSlug.LUXURY]: {
    name: "Luxury",
    icon: <Crown />,
    description: "Premium experience",
  },
};
