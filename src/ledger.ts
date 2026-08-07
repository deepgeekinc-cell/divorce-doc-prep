import { RevenueGradeMeter, TelemetryData, MeteringRecord } from './metering';
import { GisShield, AssetLocationData } from './gis';
import { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

export interface SIEMS1Event {
    assetId: string;
    telemetry: TelemetryData;
    location: AssetLocationData;
}

export interface IRSAuditLog {
    eventId: string;
    assetId: string;
    processingTimestamp: string;
    statutoryStatus: 'COMPLIANT' | 'BREACH';
    validatedCredits: ('30C' | '48' | '45X' | '45V')[];
    meteringLedgerEntry?: MeteringRecord;
    locationGeoidContext?: string;
    complianceViolations: string[];
}

/**
 * The Continuous Compliance Ledger (SIEMS-1 Production Posture)
 *
 * Functions as an automated, preemptive statutory auditor. Integrates raw,
 * hardware-level physics and geospatial telemetry into a unified, cryptographically
 * verified ledger. Replaces manual retroactive reporting with mathematically
 * unassailable audit defense.
 */
export class ContinuousComplianceLedger {
    private meter: RevenueGradeMeter;
    private gisShield: GisShield;

    constructor() {
        this.meter = new RevenueGradeMeter();
        this.gisShield = new GisShield();
    }

    /**
     * Injects the authoritative statutory boundaries (e.g., DOE low-income census tracts)
     * strictly bound by GeoJSON definitions.
     */
    public initializeGeospatialBoundaries(tracts: FeatureCollection<Polygon | MultiPolygon>) {
        this.gisShield.loadApprovedCensusTracts(tracts);
    }

    /**
     * Executes the statutory evaluation pipeline on an incoming telemetry event.
     */
    public processEvent(event: SIEMS1Event): IRSAuditLog {
        const auditLog: IRSAuditLog = {
            eventId: `EVT-${Date.now()}-${event.assetId}`,
            assetId: event.assetId,
            processingTimestamp: new Date().toISOString(),
            statutoryStatus: 'BREACH',
            validatedCredits: [],
            complianceViolations: []
        };

        // 1. Evaluate Subtitle F / Section 30C & 48 (Location & Geospatial Constraints)
        const locationStatus = this.gisShield.verifyLocationCompliance(event.location);
        if (!locationStatus.compliant) {
            auditLog.complianceViolations.push(`Section 30C/48 Failure: ${locationStatus.error}`);
        } else {
            auditLog.locationGeoidContext = locationStatus.geoid;
            auditLog.validatedCredits.push("30C", "48");
        }

        // 2. Evaluate Section 45X & 45V (Production, Dispensation, and Hourly Matching Constraints)
        const immutableRecord = this.meter.createImmutableRecord(event.telemetry);

        // Strict IRS Production Constraint: Power must be physically generated (wattage > 0)
        // Strict Integrity Constraint: Data cannot be tampered with between hardware and ledger
        if (event.telemetry.wattage <= 0) {
            auditLog.complianceViolations.push("Section 45X/45V Failure: Power generation telemetry indicates zero or negative load. Statutorily invalid for production credit.");
        } else if (!this.meter.validateRecordIntegrity(immutableRecord)) {
             auditLog.complianceViolations.push("Section 45X/45V Failure: Cryptographic validation failed. Physics telemetry payload tampered with post-extraction.");
        } else if (event.telemetry.meterAccuracyClass.indexOf('ANSI C12.20') === -1) {
             auditLog.complianceViolations.push("Section 45X/45V Failure: Telemetry payload lacks certified ANSI C12.20 revenue-grade accuracy class metadata.");
        } else {
            auditLog.meteringLedgerEntry = immutableRecord;
            auditLog.validatedCredits.push("45X", "45V");
        }

        // 3. Final Preemptive Adjudication
        if (auditLog.complianceViolations.length === 0) {
            auditLog.statutoryStatus = 'COMPLIANT';
        }

        return auditLog;
    }
}
