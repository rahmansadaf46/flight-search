export interface FlightSegment {
  marketingcareer: string;
  marketingcareerName: string;
  marketingflight: string;
  operatingcareer: string;
  operatingflight: string;
  departure: string;
  departureAirport: string;
  departureLocation: string;
  departureTime: string;
  arrival: string;
  arrivalTime: string;
  arrivalAirport: string;
  arrivalLocation: string;
  flightduration: string;
  bookingcode: string;
  seat: string;
}

export interface Flight {
  system: string;
  segment: string;
  uId: string;
  triptype: string;
  career: string;
  careerName: string;
  lastTicketTime: string;
  BasePrice: number;
  Taxes: number;
  netfare: string;
  agentprice: string;
  subagentprice: string;
  customerPrice: number;
  comission: string;
  comissiontype: string;
  comissionvalue: string;
  farecurrency: string;
  airlinescomref: string;
  pricebreakdown: Array<{
    BaseFare: string;
    Tax: string;
    PaxCount: string;
    PaxType: string;
    Discount: string;
    OtherCharges: string;
    ServiceFee: string;
  }>;
  godeparture: string;
  godepartureTime: string;
  godepartureDate: string;
  goarrival: string;
  goarrivalTime: string;
  goarrivalDate: string;
  backdeparture: string;
  backdepartureTime: string;
  backdepartureDate: string;
  backarrival: string;
  backarrivalTime: string;
  backarrivalDate: string;
  goflightduration: string;
  backflightduration: string;
  transit: {
    go: { transit1: string };
    back: { transit1: string };
  };
  bags: string;
  seat: string;
  class: string;
  refundable: string;
  segments: {
    go: FlightSegment[];
    back: FlightSegment[];
  };
  ischeap: boolean;
}

export interface SearchParams {
  from: string;
  to: string;
  departureDate: string;
  tripType: 'oneway' | 'roundtrip'| "multicity";
  returnDate?: string;
}