export type UserType = "driver" | "rider"

export interface Trip {
	id: string;
	userId: string;
	driverId?: string;
	status: string;
	selectedFare: RideFare;
	route: Route;
}

export interface Coordinate {
	latitude: number,
	longitude: number,
}

export interface Route {
	geometry: {
		coordinates: Coordinate[]
	}[],
	duration: number,
	distance: number,
}

export enum CarPackageSlug {
	SEDAN = "sedan",
	SUV = "suv",
	LUXURY = "luxury",
}

export enum DriverTier {
	BRONZE = "bronze",
	SILVER = "silver",
	GOLD = "gold",
}

export interface RideFare {
	id: string,
	packageSlug: CarPackageSlug,
	amount: number,
	route: Route,
}

export interface TripPreview {
	tripID: string,
	route: [number, number][],
	rideFares: RideFare[],
	duration: number,
	distance: number,
}

export interface Driver {
	id: string;
	name: string;
	profilePicture: string;
	carPlate: string;
	currentRating: number;
	totalCompletedTrips: number;
	tier: DriverTier;
}

export interface Rider {
	id: string;
	name: string;
	email: string;
	profilePicture: string;
}
