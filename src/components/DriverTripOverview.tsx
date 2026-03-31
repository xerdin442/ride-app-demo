import { TripEvents } from "@/lib/contracts";
import { Trip } from "@/lib/types";
import { Button } from "./ui/button";
import { TripOverviewCard } from "./TripOverviewCard";

interface DriverTripOverviewProps {
  trip?: Trip | null;
  status?: TripEvents | null;
  onAcceptTrip?: () => void;
  onDeclineTrip?: () => void;
  onConfirmPickup?: () => void;
}

export const DriverTripOverview = ({
  trip,
  status,
  onAcceptTrip,
  onDeclineTrip,
  onConfirmPickup,
}: DriverTripOverviewProps) => {
  if (!trip) {
    return (
      <TripOverviewCard
        title="Waiting for a rider..."
        description="Waiting for a rider to request a trip..."
      />
    );
  }

  if (status === TripEvents.DriverTripRequest) {
    return (
      <TripOverviewCard
        title="Trip request received!"
        description="A trip has been requested, check the route and accept the trip if you can take it."
      >
        <div className="flex flex-col gap-2">
          <Button onClick={onAcceptTrip}>Accept trip</Button>
          <Button variant="outline" onClick={onDeclineTrip}>
            Decline trip
          </Button>
        </div>
      </TripOverviewCard>
    );
  }

  // Cancelled trip status

  // Completed trip status

  // Confirm pickup status (amount to receive and timer)

  if (status === TripEvents.DriverTripAccept) {
    return (
      <TripOverviewCard
        title="All set!"
        description="You can now start the trip"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Trip details</h3>
            <p className="text-sm text-gray-500">
              Trip ID: {trip.id}
              <br />
              Rider ID: {trip.userID}
            </p>
          </div>
        </div>
      </TripOverviewCard>
    );
  }

  return null;
};
