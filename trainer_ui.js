'use strict';

class PetsafeSmartDogTrainingCollarUI extends PetsafeSmartDogTrainingCollar {
  constructor() {
    super();
  }

  async connect() {
    if (document) {
      document.getElementById("status").style.display = "block";
      document.getElementById("status").innerHTML = "Connecting...";
      document.getElementById("connect").style.display = "none";
    }
    try {
      await super.connect();
      if (document) {
        document.getElementById("controls").style.display = "block";
        document.getElementById("status").style.display = "none";
      }
    } catch (e) {
      document.getElementById("status").style.display = "block";
      document.getElementById("connect").style.display = "block";
      document.getElementById("status").innerHTML = "Connection failed. Please try again or see console log for errors.";
      throw e;
    }
  }

  async disconnect() {
    if (document) {
      document.getElementById("status").style.display = "none";
      document.getElementById("controls").style.display = "none";
      document.getElementById("connect").style.display = "block";
    }
    await super.disconnect();
  }
};
