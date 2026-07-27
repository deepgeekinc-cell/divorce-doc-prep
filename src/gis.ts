import * as turf from '@turf/turf';
import { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

export interface GpsCoordinates {
    latitude: number;
    longitude: number;
}

export interface AssetLocationData {
    assetId: string;
    timestamp: string;
    coordinates: GpsCoordinates;
}

/**
 * Section 30C & 48 GIS Mapping & Geofencing
 *
 * Enforces hardware location strict compliance by cross-referencing continuous GPS telemetry
 * against the Department of Energy's approved low-income or non-urban 11-digit census tracts.
 */
export class GisShield {
    private approvedTracts: FeatureCollection<Polygon | MultiPolygon> | null = null;

    /**
     * Loads the exact DOE-approved census tracts as a GeoJSON FeatureCollection.
     * These polygons represent the statutory boundaries (e.g., 11-digit GEOIDs).
     */
    public loadApprovedCensusTracts(geoJson: FeatureCollection<Polygon | MultiPolygon>) {
        this.approvedTracts = geoJson;
    }

    /**
     * Verifies if the asset's current GPS location falls strictly within an approved census tract.
     */
    public verifyLocationCompliance(locationData: AssetLocationData): {
        compliant: boolean;
        geoid?: string;
        error?: string;
    } {
        if (!this.approvedTracts) {
            return { compliant: false, error: "CRITICAL: Approved Census Tracts (GeoJSON) not loaded into GIS Shield." };
        }

        // Create a GeoJSON Point for the asset's current telemetry coordinates
        const assetPoint = turf.point([locationData.coordinates.longitude, locationData.coordinates.latitude]);

        // Cross-reference against all approved polygons
        for (const feature of this.approvedTracts.features) {
            // Note: booleanPointInPolygon strictly evaluates if a point resides inside the geometry
            const isInside = turf.booleanPointInPolygon(assetPoint, feature);

            if (isInside) {
                // If the tract has properties (like an 11-digit GEOID), extract it for the audit log
                const geoid = feature.properties ? feature.properties['GEOID'] : 'UNKNOWN_GEOID';
                return {
                    compliant: true,
                    geoid
                };
            }
        }

        // If the loop completes without a match, the asset has breached statutory boundaries.
        return {
            compliant: false,
            error: "STATUTORY BREACH: Asset telemetry reports location outside of approved IRS Section 30C/48 census tracts."
        };
    }
}
