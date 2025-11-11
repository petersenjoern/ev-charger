import { secondsToMilliseconds } from 'date-fns'

export function computeRemainingCarState(remainingKm, remainingPercentage, maxKmRange) {
  if (!remainingKm && !remainingPercentage) {
    throw new Error('You have to at least provide remaining kilometers or remaining percentage')
  }

  remainingKm = percentageToKm(remainingPercentage, maxKmRange)
  remainingPercentage = kmToPercentage(remainingKm, maxKmRange)

  return [remainingKm, remainingPercentage]
}

export function computeChargingDetails(
  currentRemainingPercentage,
  maxBatteryCapacityKwh,
  maxChargingRateKwh,
) {
  const percentagePointsToCharge = percentageToFull(currentRemainingPercentage)
  const chargingAmountInKwh = currentPercAsMissingKwh(
    percentagePointsToCharge,
    maxBatteryCapacityKwh,
  )
  const totalChargingTimeInMilliseconds = getChargingMilliseconds(
    chargingAmountInKwh,
    maxChargingRateKwh,
  )
  return [chargingAmountInKwh, totalChargingTimeInMilliseconds]
}

export function kmToPercentage(km, maxKmRange) {
  return Math.round((km / maxKmRange) * 100, 1)
}

export function percentageToKm(percentage, maxKmRange) {
  return Math.round((maxKmRange * percentage) / 100, 0)
}

export function percentageToFull(percentage) {
  return 100 - percentage
}

export function currentPercAsMissingKwh(percentage, maxKwh) {
  return (percentage / 100) * maxKwh
}

export function getChargingMilliseconds(kwh, chargingRateKwh) {
  if (chargingRateKwh <= 0) {
    throw new Error('Charging rate must be greater than zero.')
  }

  const timeInHours = kwh / chargingRateKwh
  const timeInSeconds = timeInHours * 3600
  return secondsToMilliseconds(timeInSeconds)
}

export function getChargingStartTime(millisecondsToCharge, targetFinishTime) {
  return targetFinishTime - millisecondsToCharge
}
