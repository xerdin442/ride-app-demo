import { Clock } from "lucide-react";
import { TripPreview, RouteFare } from "@/lib/types";
import {
  convertMetersToKilometers,
  convertSecondsToMinutes,
  cn,
} from "@/lib/utils";
import { Button } from "./ui/button";
import { CarPackageDetails } from "./CarPackageDetails";

interface DriverListProps {
  trip: TripPreview | null;
  onPackageSelect: (fare: RouteFare) => void;
  onCancel: () => void;
}

export function DriverList({
  trip,
  onPackageSelect,
  onCancel,
}: DriverListProps) {
  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-black/20">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">Select your desired ride</h2>
        <p className="text-sm text-gray-500 mb-6">
          Routing for {convertMetersToKilometers(trip?.distance ?? 0)}
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <Clock className="w-4 h-4" />
          <span>
            You&apos;ll arrive in:{" "}
            {convertSecondsToMinutes(trip?.duration ?? 0)}
          </span>
        </div>
        <div className="space-y-4">
          {trip?.rideFares.map((fare) => {
            const Icon = CarPackageDetails[fare.packageSlug].icon;
            const price =
              fare.totalPriceInCents &&
              `$${(fare.totalPriceInCents / 100).toFixed(2)}`;

            return (
              <div
                key={fare.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer",
                  "hover:border-primary hover:bg-primary/5",
                )}
                onClick={() => onPackageSelect(fare)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">{Icon}</div>
                  <div>
                    <h3 className="font-medium">
                      {CarPackageDetails[fare.packageSlug].name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {CarPackageDetails[fare.packageSlug].description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{price}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onCancel()}
          >
            Back to Map
          </Button>
        </div>
      </div>
    </div>
  );
}
