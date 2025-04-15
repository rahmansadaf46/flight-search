// RawFlight represents the structure of the flight data from the JSON
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

export interface RawFlight {
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

// Flight represents the simplified structure expected by FlightAccordion and FlightDetailsPage
export interface Flight {
  id: string; // uId from RawFlight
  airline: string; // careerName from RawFlight
  flightNumber: string; // marketingflight from segments
  departure: string; // departureAirport from segments
  departureTime: string; // departureTime from segments
  arrival: string; // arrivalAirport from segments
  arrivalTime: string; // arrivalTime from segments
  duration: string; // flightduration from segments
  price: number; // customerPrice from RawFlight
  stops: number; // derived from transit
  classType: string; // class from RawFlight
  returnFlight?: Flight; // For round-trip flights, populated from segments.back
}

export interface SearchParams {
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  tripType: 'roundtrip' | 'oneway' | 'multicity';
  legs?: Array<{
    from: string;
    to: string;
    departureDate: string;
    tripType: string;
    legNumber: number;
  }>;
}