import { WEBSOCKET_URL } from '@/lib/constants';
import { TripEvents, BackendEndpoints, ServerWsMessage, isValidWsMessage, ClientWsMessage } from '@/lib/contracts';
import { Driver, PaymentSession, Trip } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useRiderStreamConnection(userID: string) {
  const [tripStatus, setTripStatus] = useState<TripEvents | null>(null);
  const [requestedTrip, setRequestedTrip] = useState<Trip | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [assignedDriver, setAssignedDriver] = useState<Driver>();
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!userID) return;

    const ws = new WebSocket(`${WEBSOCKET_URL}${BackendEndpoints.WS_RIDERS}?userID=${userID}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWs(ws)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerWsMessage;

      if (!message || !isValidWsMessage(message)) {
        setError(`Unknown message type "${message}", allowed types are: ${Object.values(TripEvents).join(', ')}`);
        return;
      }

      switch (message.type) {
        case TripEvents.PaymentSessionCreated:
          setPaymentSession(message.data);
          setTripStatus(message.type);
          break;
        case TripEvents.DriverAssigned:
          setAssignedDriver(message.data.driver);
          setRequestedTrip(message.data.trip);
          setTripStatus(message.type);
          break;
        case TripEvents.DriverArrival:
          setTripStatus(message.type);
          break;
        case TripEvents.NoDriversFound:
          setTripStatus(message.type);
          break;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    ws.onerror = (event) => {
      setError('WebSocket error occurred');
      console.error('WebSocket error:', event);
    };

    return () => {
      console.log('Closing WebSocket...');
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userID]);

  const sendMessage = (message: ClientWsMessage) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      setError('WebSocket is not connected');
    }
  };

  const resetTripStatus = () => {
    setTripStatus(null);
    setPaymentSession(null);
  }

  return {
    assignedDriver,
    requestedTrip,
    tripStatus,
    paymentSession,
    setTripStatus,
    resetTripStatus,
    sendMessage,
    error
  };
}