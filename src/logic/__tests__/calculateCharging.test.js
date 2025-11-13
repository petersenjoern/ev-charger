import { describe, it, expect } from 'vitest'
import {
  kmToPercentage,
  percentageToKm,
  currentPercAsMissingKwh,
  getChargingMilliseconds,
  getChargingStartTime,
  computeChargingDetails,
} from '../calculateCharging'
import { millisecondsToHours, secondsToMilliseconds } from 'date-fns'


describe('computeChargingDetails', () => {
  it('should calculate charging amount and charging time with valid inputs', () => {
    const currentRemainingPercentage = 50
    const maxBatteryCapacityInKwh = 40
    const maxChargingRateInKwh = 10

    const expectedChargingAmount =
      ((100 - currentRemainingPercentage) / 100) * maxBatteryCapacityInKwh // 0.50 * 40 = 20 kWh
    const expectedChargingTimeInHours = expectedChargingAmount / maxChargingRateInKwh // 20 kWh / 10 kWh/hr = 2 hours
    const expectedChargingTimeInMilliseconds = expectedChargingTimeInHours * 60 * 60 * 1000 // 2 * 3600 * 1000 = 7,200,000 ms

    const [actualChargingAmount, actualChargingTimeMilliseconds] = computeChargingDetails(
      currentRemainingPercentage,
      maxBatteryCapacityInKwh,
      maxChargingRateInKwh,
    )

    expect(actualChargingAmount).toBeCloseTo(expectedChargingAmount)
    expect(actualChargingTimeMilliseconds).toBeCloseTo(expectedChargingTimeInMilliseconds)
  })
})

describe('kmToPercentage', () => {
  it('should convert kilometers to percentage correctly for a partial range', () => {
    const km = 50
    const maxRange = 100
    const expectedPercentage = 50
    expect(kmToPercentage(km, maxRange)).toBe(expectedPercentage)
  })

  it('should handle floating point numbers accurately', () => {
    const km = 33.33
    const maxRange = 100
    const expectedRoundedPercentage = 33
    expect(kmToPercentage(km, maxRange)).toBe(expectedRoundedPercentage)
  })

  it('should return Infinity when maxRange is 0 and km is positive', () => {
    const km = 50
    const maxRange = 0
    expect(kmToPercentage(km, maxRange)).toBe(Infinity)
  })

  it('should return NaN when maxRange is 0 and km is 0', () => {
    const km = 0
    const maxRange = 0
    expect(kmToPercentage(km, maxRange)).toBeNaN()
  })
})

describe('percentageToKm', () => {
  it('should convert percentage to km correctly for partial range', () => {
    const percentage = 50
    const maxRange = 200
    const expectedKm = 100
    expect(percentageToKm(percentage, maxRange)).toBe(expectedKm)
  })

  it('should return 0 km when maxRange is 0 and percentage is 0', () => {
    const percentage = 0
    const maxRange = 0
    const expectedKm = 0
    expect(percentageToKm(percentage, maxRange)).toBe(expectedKm)
  })
})

describe('currentPercAsMissingKwh', () => {
  it('should convert percentage to missing kWh for partial range', () => {
    const percentage = 50
    const maxKwh = 200
    const expectedMissingKwh = 100
    expect(currentPercAsMissingKwh(percentage, maxKwh)).toBe(expectedMissingKwh)
  })

  it('should return 0 missing kWh if maxKwh is 0', () => {
    const percentage = 23
    const maxKwh = 0
    const expectedMissingKwh = 0
    expect(currentPercAsMissingKwh(percentage, maxKwh)).toBe(expectedMissingKwh)
  })
})

describe('getChargingMilliseconds', () => {
  it('should calculate charging time correctly when charging rate is equal to kwh', () => {
    const kwh = 6
    const chargingRateKwh = 6
    const expectedChargingHours = 1
    expect(millisecondsToHours(getChargingMilliseconds(kwh, chargingRateKwh))).toBe(
      expectedChargingHours,
    )
  })

  it('should calculate charging time to be 0 if the requested kwh is 0', () => {
    const kwh = 0
    const chargingRateKwh = 6
    const expectedChargingMilliseconds = 0
    expect(getChargingMilliseconds(kwh, chargingRateKwh)).toBe(expectedChargingMilliseconds)
  })

  it('should should throw an error if the chargingRateKwh is not greater than 0', () => {
    const kwh = 10
    const chargingRateKwh = 0
    expect(() => getChargingMilliseconds(kwh, chargingRateKwh)).toThrow(
      'Charging rate must be greater than zero.',
    )
  })
})

describe('getCharingStartTime', () => {
  it('should calculate when to begin charging with valid starttime', () => {
    // finish time is 2024-06-01 06:00; it takes 1 hour to charge; starting time should be 2024-06-01 05:00
    const targetDate = new Date("2024-06-01");
    const targetFinishTime = "6:00"
    const millisecondsToCharge = secondsToMilliseconds(1 * 60 * 60)
    const expectedStartTime = new Date("2024-06-01T05:00:00").getTime()
    expect(getChargingStartTime(millisecondsToCharge, targetDate, targetFinishTime)).toBe(expectedStartTime)
  })
})
