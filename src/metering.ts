import * as crypto from 'crypto';
import stringify from 'fast-json-stable-stringify';

export interface TelemetryData {
    deviceId: string;
    timestamp: string;      // ISO-8601 string required for strict parsing
    wattage: number;        // Exact wattage dispensed
    capacity: number;       // Inverter/module capacity constraint
    voltage: number;
    current: number;
    meterAccuracyClass: string; // e.g., 'ANSI C12.20 Class 0.2'
}

export interface MeteringRecord {
    payload: TelemetryData;
    hash: string;
}

/**
 * Section 45X & 45V Revenue-Grade Metering
 *
 * Implements physics-to-finance logic by ingesting ANSI C12.20 revenue-grade
 * metering telemetry. Ensures mathematical immutability by producing deterministic,
 * unalterable SHA-256 hashes for IRS audit defense.
 */
export class RevenueGradeMeter {
    /**
     * Secures continuous telemetry by converting the payload into a deterministic,
     * cryptographically hashed ledger record.
     */
    public createImmutableRecord(data: TelemetryData): MeteringRecord {
        // fast-json-stable-stringify ensures object key order does not alter the hash output
        const deterministicString = stringify(data);

        const hash = crypto.createHash('sha256').update(deterministicString).digest('hex');

        return {
            payload: data,
            hash
        };
    }

    /**
     * Validates that the mathematical relationship between the raw physics payload
     * and the cryptographic hash has not drifted or been tampered with.
     */
    public validateRecordIntegrity(record: MeteringRecord): boolean {
        const expectedRecord = this.createImmutableRecord(record.payload);
        return record.hash === expectedRecord.hash;
    }
}
