import { ContinuousComplianceLedger, SIEMS1Event } from './ledger';
import { FeatureCollection, Polygon } from 'geojson';

describe('Continuous Compliance Ledger (Production Posture)', () => {
    let ledger: ContinuousComplianceLedger;

    // A mock 11-digit GEOID tract (Square polygon spanning coordinates around Torrance)
    const productionTracts: FeatureCollection<Polygon> = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {
                    GEOID: '06037651001' // Standard 11-digit Census Tract Format
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-118.35, 33.82],
                        [-118.33, 33.82],
                        [-118.33, 33.85],
                        [-118.35, 33.85],
                        [-118.35, 33.82] // Close the polygon
                    ]]
                }
            }
        ]
    };

    beforeEach(() => {
        ledger = new ContinuousComplianceLedger();
        ledger.initializeGeospatialBoundaries(productionTracts);
    });

    test('should return a COMPLIANT audit log when physics and geospatial parameters align', () => {
        const event: SIEMS1Event = {
            assetId: 'HW-ASSET-001',
            telemetry: {
                deviceId: 'ANSI-METER-X1',
                timestamp: new Date().toISOString(),
                wattage: 15000,
                capacity: 50000,
                voltage: 480,
                current: 31.25,
                meterAccuracyClass: 'ANSI C12.20 Class 0.2' // IRS Production requirement
            },
            location: {
                assetId: 'HW-ASSET-001',
                timestamp: new Date().toISOString(),
                coordinates: { latitude: 33.84, longitude: -118.34 } // Inside Polygon
            }
        };

        const log = ledger.processEvent(event);

        expect(log.statutoryStatus).toBe('COMPLIANT');
        expect(log.complianceViolations.length).toBe(0);
        expect(log.validatedCredits).toEqual(expect.arrayContaining(['30C', '48', '45X', '45V']));
        expect(log.locationGeoidContext).toBe('06037651001');
        expect(log.meteringLedgerEntry).toBeDefined();
        expect(log.meteringLedgerEntry?.hash).toBeDefined();
    });

    test('should flag a STATUTORY BREACH when asset telemetry falls outside the 11-digit GEOID boundary', () => {
        const event: SIEMS1Event = {
            assetId: 'HW-ASSET-001',
            telemetry: {
                deviceId: 'ANSI-METER-X1',
                timestamp: new Date().toISOString(),
                wattage: 15000,
                capacity: 50000,
                voltage: 480,
                current: 31.25,
                meterAccuracyClass: 'ANSI C12.20 Class 0.2'
            },
            location: {
                assetId: 'HW-ASSET-001',
                timestamp: new Date().toISOString(),
                coordinates: { latitude: 34.05, longitude: -118.25 } // Outside Polygon (Downtown LA)
            }
        };

        const log = ledger.processEvent(event);

        expect(log.statutoryStatus).toBe('BREACH');
        expect(log.complianceViolations[0]).toContain('STATUTORY BREACH');
        expect(log.validatedCredits).not.toContain('30C');
        expect(log.validatedCredits).toContain('45X');
    });

    test('should flag a BREACH when physics telemetry fails validation (e.g. non-ANSI metadata)', () => {
        const event: SIEMS1Event = {
            assetId: 'HW-ASSET-001',
            telemetry: {
                deviceId: 'MOCK-METER',
                timestamp: new Date().toISOString(),
                wattage: 15000,
                capacity: 50000,
                voltage: 480,
                current: 31.25,
                meterAccuracyClass: 'Generic Smart Meter' // Fails IRS ANSI strictness
            },
            location: {
                assetId: 'HW-ASSET-001',
                timestamp: new Date().toISOString(),
                coordinates: { latitude: 33.84, longitude: -118.34 }
            }
        };

        const log = ledger.processEvent(event);

        expect(log.statutoryStatus).toBe('BREACH');
        expect(log.complianceViolations[0]).toContain('lacks certified ANSI C12.20');
        expect(log.validatedCredits).toContain('30C');
        expect(log.validatedCredits).not.toContain('45X');
    });
});
