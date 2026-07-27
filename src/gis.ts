export interface GpsCoordinates {
    latitude: number;
    longitude: number;
}

export interface Geofence {
    id: string;
    description: string;
    /**
     * For simplicity in this simulation, a geofence is defined by a central point and a radius (in meters).
     * In production, this would be complex polygons representing 11-digit Census Bureau GEOIDs.
     */
    center: GpsCoordinates;
    radiusMeters: number;
}

export interface AssetLocationData {
    assetId: string;
    timestamp: Date;
    coordinates: GpsCoordinates;
}

/**
 * Section 30C & 48 GIS Mapping & Geofencing Simulator
 *
 * Secures the statutory vulnerability of location by ensuring assets remain strictly
 * within approved Department of Energy census tracts.
 */
export class GisShield {
    private approvedGeofences: Geofence[] = [];

    /**
     * Loads the authorized geofences (e.g., DOE approved low-income/non-urban census tracts).
     */
    public loadApprovedGeofences(geofences: Geofence[]) {
        this.approvedGeofences = geofences;
    }

    /**
     * Calculates the distance between two GPS coordinates using the Haversine formula.
     * Returns the distance in meters.
     */
    private calculateDistance(coord1: GpsCoordinates, coord2: GpsCoordinates): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = coord1.latitude * Math.PI / 180;
        const φ2 = coord2.latitude * Math.PI / 180;
        const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
        const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Checks if the asset's current location strictly complies with approved geofences.
     * Flags a statutory breach if out of bounds.
     */
    public verifyLocationCompliance(locationData: AssetLocationData): {
        compliant: boolean;
        distanceToCenter?: number;
        matchedGeofenceId?: string;
        error?: string;
    } {
        if (this.approvedGeofences.length === 0) {
            return { compliant: false, error: "No approved geofences loaded." };
        }

        for (const geofence of this.approvedGeofences) {
            const distance = this.calculateDistance(locationData.coordinates, geofence.center);

            // If the asset is within the radius of this geofence, it is compliant.
            if (distance <= geofence.radiusMeters) {
                return {
                    compliant: true,
                    distanceToCenter: distance,
                    matchedGeofenceId: geofence.id
                };
            }
        }

        // Statutory Breach: The asset is outside all approved geofences.
        return {
            compliant: false,
            error: "STATUTORY BREACH: Asset located outside of approved census tracts."
        };
    }
}
