import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Driver } from "@/lib/types";

interface DriverCardProps {
  driver?: Driver | null;
}

export const DriverCard = ({ driver }: DriverCardProps) => {
  if (!driver) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{driver.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-center">
        <Image
          className="rounded-full"
          src={driver.profilePicture}
          alt={`${driver.name}`}
          width={50}
          height={50}
        />

        <p className="text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 font-mono tracking-wider">
            {driver.carPlate.toUpperCase()}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
