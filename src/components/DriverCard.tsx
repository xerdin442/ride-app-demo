import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CarPackageSlug, Driver } from "@/lib/types";

interface DriverCardProps {
  driver?: Driver | null;
  packageSlug?: CarPackageSlug;
}

export const DriverCard = ({ driver, packageSlug }: DriverCardProps) => {
  if (!driver) return null;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{driver.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-center">
        {driver.profilePicture && (
          <Image
            className="rounded-full"
            src={driver.profilePicture}
            alt={`${driver.name}'s profile picture`}
            width={50}
            height={50}
          />
        )}

        {driver.carPlate && (
          <p className="text-sm">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 font-mono tracking-wider">
              {driver.carPlate.toUpperCase()}
            </span>
          </p>
        )}

        {packageSlug && (
          <p className="text-sm">
            <span className="font-mono">{packageSlug}</span> driver
          </p>
        )}
      </CardContent>
    </Card>
  );
};
