import { CarPackageSlug } from "@/lib/types";
import { Bus, Truck, Crown, Car } from "lucide-react";

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
  [CarPackageSlug.VAN]: {
    name: "Van",
    icon: <Bus />,
    description: "Perfect for larger groups",
  },
  [CarPackageSlug.LUXURY]: {
    name: "Luxury",
    icon: <Crown />,
    description: "Premium experience",
  },
};
