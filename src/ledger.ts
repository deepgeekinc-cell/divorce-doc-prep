import { RevenueGradeMeter, TelemetryData, MeteringRecord } from './metering';
import { GisShield, AssetLocationData, Geofence } from './gis';

export interface SIEMS1Payload {
    assetId: string;
    telemetry: TelemetryData;
    location: AssetLocationData;
}

export interface ComplianceResult {
    assetId: string;
    timestamp: Date;
    isCompliant: boolean;
    creditsValidated: string[];
    meteringRecord?: MeteringRecord;
    locationDetails?: any;
    errors: string[];
}

/**
 * The Continuous Compliance Ledger (SIEMS-1 Simulation)
 *
 * Acts as a preemptive auditor. Ingests time-stamped metering and GPS data,
 * runs it against current IRC statutes, and validates green credits ONLY when
 * 100% compliance is mathematically proven.
 */
export class ContinuousComplianceLedger {
    private meter: RevenueGradeMeter;
    private gisShield: GisShield;

    constructor() {
        this.meter = new RevenueGradeMeter();
        this.gisShield = new GisShield();
    }

    /**
     * Configuration method to set up the authorized geofences (DOE approved tracts).
     */
    public configureGeofences(geofences: Geofence[]) {
        this.gisShield.loadApprovedGeofences(geofences);
    }

    /**
     * The core pipeline: Ingest physics & location data, evaluate statutory compliance.
     */
    public evaluateCompliance(payload: SIEMS1Payload): ComplianceResult {
        const result: ComplianceResult = {
            assetId: payload.assetId,
            timestamp: new Date(),
            isCompliant: false,
            creditsValidated: [],
            errors: []
        };

        // 1. Evaluate Section 30C & 48 (Location / GIS Shielding)
        const locationStatus = this.gisShield.verifyLocationCompliance(payload.location);
        if (!locationStatus.compliant) {
            result.errors.push(`Section 30C/48 Violation: ${locationStatus.error}`);
        } else {
            result.locationDetails = {
                geofenceId: locationStatus.matchedGeofenceId,
                distanceToCenter: locationStatus.distanceToCenter
            };
            result.creditsValidated.push("30C", "48");
        }

        // 2. Evaluate Section 45X & 45V (Physics-to-Finance / Metering)
        // Ensure data is immutable by hashing it
        const record = this.meter.logTelemetry(payload.telemetry);

        // In a real scenario, we might check that wattage > 0, or hourly matching logic.
        // For this simulation, valid hashing and positive generation = compliance.
        if (payload.telemetry.wattage <= 0) {
            result.errors.push("Section 45X/45V Violation: Zero or negative power generation logged.");
        } else if (!this.meter.validateRecord(record)) {
             result.errors.push("Section 45X/45V Violation: Cryptographic hash validation failed (Tampering detected).");
        } else {
            result.meteringRecord = record;
            result.creditsValidated.push("45X", "45V");
        }

        // 3. Final Determination
        // 100% compliance is required to validate the green credit fully.
        if (result.errors.length === 0) {
            result.isCompliant = true;
        }

        return result;
    }
}
