import * as crypto from 'crypto';

export interface TelemetryData {
    deviceId: string;
    timestamp: Date;
    wattage: number;      // Exact wattage produced/dispensed
    capacity: number;     // Capacity of the unit
    voltage: number;
    current: number;
}

export interface MeteringRecord {
    data: TelemetryData;
    hash: string;
}

/**
 * Section 45X & 45V Revenue-Grade Metering Simulator
 *
 * Implements physics-to-finance compliance by taking exact continuous telemetry data,
 * and cryptographically hashing it at the device level to create an immutable ledger entry.
 */
export class RevenueGradeMeter {
    /**
     * Hashes telemetry data to create an immutable record.
     * @param data The exact, time-stamped physics data from the asset.
     */
    public logTelemetry(data: TelemetryData): MeteringRecord {
        const dataString = JSON.stringify({
            deviceId: data.deviceId,
            timestamp: data.timestamp.toISOString(),
            wattage: data.wattage,
            capacity: data.capacity,
            voltage: data.voltage,
            current: data.current
        });

        const hash = crypto.createHash('sha256').update(dataString).digest('hex');

        return {
            data,
            hash
        };
    }

    /**
     * Validates that a metering record has not been tampered with.
     * @param record The metering record to validate.
     */
    public validateRecord(record: MeteringRecord): boolean {
        const expectedHash = this.logTelemetry(record.data).hash;
        return record.hash === expectedHash;
    }
}
