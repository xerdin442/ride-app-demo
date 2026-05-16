import { ClientWsMessage } from "@/lib/contracts/websocket";
import { RatingRequiredData } from "@/lib/types";

interface TripRatingModalProps {
  data: RatingRequiredData;
  confirmSubmit: (message: ClientWsMessage) => void;
  onClose: () => void;
}

export default function TripRatingModal({
  data,
  confirmSubmit,
  onClose,
}: TripRatingModalProps) {
  return <div>TripRatingModal</div>;
}
