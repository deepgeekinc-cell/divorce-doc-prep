import { ContinuousComplianceLedger, SIEMS1Payload } from './ledger';
import { Geofence } from './gis';

describe('Continuous Compliance Ledger (SIEMS-1)', () => {
    let ledger: ContinuousComplianceLedger;
    const testGeofence: Geofence = {
        id: 'CENSUS-TRACT-123',
        description: 'DOE Low-Income Tract',
        center: { latitude: 33.8358, longitude: -118.3406 }, // Torrance roughly
        radiusMeters: 5000 // 5km radius
    };

    beforeEach(() => {
        ledger = new ContinuousComplianceLedger();
        ledger.configureGeofences([testGeofence]);
    });

    test('should validate compliance when asset is within geofence and generates positive wattage', () => {
        const payload: SIEMS1Payload = {
            assetId: 'ASSET-TORRANCE-01',
            telemetry: {
                deviceId: 'METER-01',
                timestamp: new Date(),
                wattage: 15000,
                capacity: 50000,
                voltage: 480,
                current: 31.25
            },
            location: {
                assetId: 'ASSET-TORRANCE-01',
                timestamp: new Date(),
                coordinates: { latitude: 33.8360, longitude: -118.3400 } // Well within 5km
            }
        };

        const result = ledger.evaluateCompliance(payload);

        expect(result.isCompliant).toBe(true);
        expect(result.errors.length).toBe(0);
        expect(result.creditsValidated).toContain('30C');
        expect(result.creditsValidated).toContain('45X');
        expect(result.meteringRecord).toBeDefined();
        expect(result.meteringRecord?.hash).toBeDefined();
    });

    test('should flag statutory breach when asset moves outside of approved geofence', () => {
        const payload: SIEMS1Payload = {
            assetId: 'ASSET-TORRANCE-01',
            telemetry: {
                deviceId: 'METER-01',
                timestamp: new Date(),
                wattage: 15000,
                capacity: 50000,
                voltage: 480,
                current: 31.25
            },
            location: {
                assetId: 'ASSET-TORRANCE-01',
                timestamp: new Date(),
                coordinates: { latitude: 34.0522, longitude: -118.2437 } // Los Angeles downtown (~25km away, out of bounds)
            }
        };

        const result = ledger.evaluateCompliance(payload);

        expect(result.isCompliant).toBe(false);
        expect(result.errors[0]).toContain('STATUTORY BREACH');
        expect(result.creditsValidated).not.toContain('30C');
        expect(result.creditsValidated).toContain('45X'); // Telemetry still fine
    });

    test('should flag violation when telemetry reports zero wattage', () => {
        const payload: SIEMS1Payload = {
            assetId: 'ASSET-TORRANCE-01',
            telemetry: {
                deviceId: 'METER-01',
                timestamp: new Date(),
                wattage: 0,
                capacity: 50000,
                voltage: 480,
                current: 0
            },
            location: {
                assetId: 'ASSET-TORRANCE-01',
                timestamp: new Date(),
                coordinates: { latitude: 33.8360, longitude: -118.3400 }
            }
        };

        const result = ledger.evaluateCompliance(payload);

        expect(result.isCompliant).toBe(false);
        expect(result.errors[0]).toContain('Zero or negative power generation');
        expect(result.creditsValidated).toContain('30C');
        expect(result.creditsValidated).not.toContain('45X');
    });
});
