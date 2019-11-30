'use strict';

const COLLAR_BT_NAME = "PetSafe Smart Dog Trainer";
const COLLAR_COMMAND_SERVICE = "0bd51666-e7cb-469b-8e4d-2742f1ba77cc";
const COLLAR_COMMAND_CHARACTERISTIC = "e7add780-b042-4876-aae1-112855353cc1";
const COLLAR_TONE_COMMAND = [0x55, 0x36, 0x31, 0x31, 0x31, 0x30];
const COLLAR_VIBRATE_COMMAND = [0x55, 0x36, 0x31, 0x33, 0x33, 0x30];
// Last byte is command strength (0-15) + 0x48. We set it to 0 here.
const COLLAR_STATIC_COMMAND = [0x55, 0x36, 0x31, 0x32, 0x33, 0x30];

class PetsafeSmartDogTrainingCollar {
  constructor() {
    this.device = null;
    this.service = null;
    this.tx = null;
  }

  async connect() {
    console.log("Starting connect");
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{
        name: COLLAR_BT_NAME
      }],
      optionalServices: [COLLAR_COMMAND_SERVICE]
    });
    let server = await this.device.gatt.connect();
    this.service = await server.getPrimaryService(COLLAR_COMMAND_SERVICE);
    this.tx = await this.service.getCharacteristic(COLLAR_COMMAND_CHARACTERISTIC);
    console.log("Connected");
  }

  async disconnect() {
    await this.device.gatt.disconnect();
  }

  async runTone() {
    console.log("Running tone");
    this.tx.writeValue(new Uint8Array(COLLAR_TONE_COMMAND));
  }

  async runVibrate() {
    console.log("Running vibration");
    this.tx.writeValue(new Uint8Array(COLLAR_VIBRATE_COMMAND));
  }

  async runStatic(power) {
    console.log("Running static");
    if (power < 0 || power > 15) {
      throw Error("power not in range 0-15");
    }
    let r = new Uint8Array(COLLAR_STATIC_COMMAND);
    r[5] += power;
    console.log(r);
    this.tx.writeValue(r);
  }
};
