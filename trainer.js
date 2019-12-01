'use strict';

const COLLAR_BT_NAME = "PetSafe Smart Dog Trainer";
const COLLAR_COMMAND_SERVICE = "0bd51666-e7cb-469b-8e4d-2742f1ba77cc";
const COLLAR_COMMAND_CHARACTERISTIC = "e7add780-b042-4876-aae1-112855353cc1";
const COLLAR_AUTH_CHARACTERISTIC = "0e7ad781-b043-4877-aae2-112855353cc2";
const COLLAR_TONE_COMMAND = [0x55, 0x36, 0x31, 0x31, 0x31, 0x30];
const COLLAR_VIBRATE_COMMAND = [0x55, 0x36, 0x31, 0x33, 0x33, 0x30];
// Last byte is command strength (0-15) + 0x48. We set it to 0 here.
const COLLAR_STATIC_COMMAND = [0x55, 0x36, 0x31, 0x32, 0x33, 0x30];
// Last four bytes are the ASCII values of the PIN digits
const COLLAR_AUTH_COMMAND = [0x55, 0x37, 0x37, 0x30, 0x30, 0x30, 0x30];

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
    this.auth = await this.service.getCharacteristic(COLLAR_AUTH_CHARACTERISTIC)
    console.log("Connected");
  }

  async disconnect() {
    await this.device.gatt.disconnect();
  }
  async authorize(d1,d2,d3,d4){
    console.log("Authenticating with ",d1,d2,d3,d4)
    let r = new Uint8Array(COLLAR_AUTH_COMMAND);
    r[3] += d1;
    r[4] += d2;
    r[5] += d3;
    r[6] += d4;
    console.log(r)
    this.auth.writeValue(r)
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
