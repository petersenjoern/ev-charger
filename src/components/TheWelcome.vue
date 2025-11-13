<script setup>
import { ref, computed } from 'vue'
import { percentageToKm, kmToPercentage, computeChargingDetails, getChargingStartTime} from '@/logic/calculateCharging.js'
import { useDate } from 'vuetify'

const adapter = useDate()
const date = ref(new Date(Date.now()));


const initialRemainingDistanceInput = ref(10);
const initialRemainingBatteryInput = ref(10);

const maxRange = ref(310);
const maxBatteryCapacity = ref(38);
const maxChargingRate = ref(3.6);
const chargeFinishTime = ref('06:30');

const allowedStep = (m) => m % 5 === 0


const calculatedCarState = computed(() => {
  if (!initialRemainingDistanceInput && !initialRemainingBatteryInput) {
    throw new Error('You have to at least provide remaining kilometers or remaining percentage')
  }

  const distance = percentageToKm(initialRemainingBatteryInput.value, maxRange.value);
  const percentage = kmToPercentage(initialRemainingDistanceInput.value, maxRange.value);

  return { distance, percentage };
})

const calculatedChargeStartTime = computed(() => {
  const [_, chargingTimeMilliseconds] = computeChargingDetails(
    calculatedCarState.value.percentage,
    maxBatteryCapacity.value,
    maxChargingRate.value
  );
  
  const chargingStartTime = getChargingStartTime(
    chargingTimeMilliseconds,
    date.value,
    chargeFinishTime.value
  );

  return adapter.format(new Date(chargingStartTime), 'fullDateTime24h');
})

const updateRemainingDistanceInput = (value) => {
  initialRemainingDistanceInput.value = value;
  initialRemainingBatteryInput.value = kmToPercentage(value, maxRange.value);
};

const updateRemainingBatteryInput = (value) => {
  initialRemainingBatteryInput.value = value;
  initialRemainingDistanceInput.value = percentageToKm(value, maxRange.value);
};

</script>

<template>
  <v-container>
    <br />
    <h2>Start Charge at</h2>
    <hr />
    <br />
    <p>{{ calculatedChargeStartTime }}</p>
    <br />
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start" cols="4"> Charge Amount </v-col>
              <v-col class="text-grey" cols="8">
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-number-input
            :model-value="initialRemainingDistanceInput"
            @update:model-value="updateRemainingDistanceInput"
            :reverse="false"
            controlVariant="split"
            label="Remaining distance (km)"
            :hideInput="false"
            :inset="false"
            variant="outlined"
            :max="1000"
            :min="0"
            :step="5"
            :precision="0"
          ></v-number-input>
          <v-number-input
            :model-value="initialRemainingBatteryInput"
            @update:model-value="updateRemainingBatteryInput"
            :reverse="false"
            controlVariant="split"
            label="Remaining Battery (%)"
            :hideInput="false"
            :inset="false"
            variant="outlined"
            :max="100"
            :min="0"
            :step="1"
            :precision="0"
          ></v-number-input>
        </v-expansion-panel-text>
      </v-expansion-panel>
  </v-expansion-panels>


    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start" cols="4"> Car Specifications </v-col>
              <v-col class="text-grey" cols="8">
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-number-input
            v-model:model-value="maxRange"
            :reverse="false"
            controlVariant="split"
            label="Max. Range (km)"
            :hideInput="false"
            :inset="false"
            variant="outlined"
            :max="1000"
            :min="0"
            :step="5"
            :precision="0"
          ></v-number-input>

          <v-number-input
            v-model:model-value="maxBatteryCapacity"
            :reverse="false"
            controlVariant="split"
            label="Max. Battery Capacity (kWh)"
            :hideInput="false"
            :inset="false"
            variant="outlined"
            :max="100"
            :min="0"
            :step="1"
            :precision="1"
          ></v-number-input>

          <v-number-input
            v-model:model-value="maxChargingRate"
            :reverse="false"
            controlVariant="split"
            label="Max. Charging Rate (kW)"
            :hideInput="false"
            :inset="false"
            variant="outlined"
            :max="21"
            :min="1"
            :step="0.1"
            :precision="1"
          ></v-number-input>
        </v-expansion-panel-text>
      </v-expansion-panel>
  </v-expansion-panels>


    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start" cols="4"> End Time </v-col>
              <v-col class="text-grey" cols="8">
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-date-picker
            v-model="date"
          ></v-date-picker>
          <v-time-picker
            v-model:model-value="chargeFinishTime"
            :allowed-minutes="allowedStep"
            format="24hr"
            scrollable
            color="#00bd7e"
          ></v-time-picker>
        </v-expansion-panel-text>
      </v-expansion-panel>
  </v-expansion-panels>

  </v-container>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h2 {
  font-size: 1.2rem;
  position: relative;
  text-align: left;
  color: #20c490;
}

hr {
  height: 0.25px;
  color: #20c490;
  background: #20c490;
  font-size: 0;
  border: 0;
}
</style>
