# Virtual Tasmota for Tuya-api devices (Tuya-VT)

Tuya Api devices can mimic as [Tasmota Devices](https://github.com/arendst/Sonoff-Tasmota/wiki) without flashing the tasmota firmware using the [Tuya-Api](https://github.com/codetheweb/tuyapi). current version supports tasmota features, such as **Mqtt**, **Web UI** , **Configuration**, **Console log**...

New Tuya firmware (_1.0.7, 2.0, 3.3.._) updates disable the [OTA Flashing](https://github.com/ct-Open-Source/tuya-convert) options at the moment, This feature allows you to use the non flashed Tuya devices as tasmota device along with tasmota flashed devices, most of the tasmota features is virtually available and it can be expanded.

Currently supports following devices and  New devices can be added thought config json.
*  Tuya switches or outlets [1-4 gangs]
*  Light Dimmer
*  Fan Light Dimmer [dimmer + switch]

![](https://github.com/thirug010/Virtual-Tasmota-for-Tuya-api-devices/blob/master/virtual-tasmota-new.png)

* **Main Page**- Overview of all tuya-vt devices, add new device, search device and control the devices 
* **Add New Devices**- Add New devices with devId, localkey configure the with Tyua device type
* **Configuration**- update the device configuration like Mqtt topic, Tele-Period, Pulse-period, switch mode, dimmer options 
* **Console Logs**- Console logs show all messages including the Mqtt data and all other server information for debuging

Setup Instructions: [refer here](https://github.com/thirug010/Virtual-Tasmota-for-Tuya-api-devices/wiki/Setup-Instructions) 

Thanks To:
* [TuyAPI](https://github.com/codetheweb/tuyapi) - NPM library for LAN control of Tuya devices with stock firmware
* [Sonoff-Tasmota](https://github.com/arendst/Sonoff-Tasmota) - Alternative firmware for ESP8266 based devices like iTead Sonoff, Tuya ...
* [Tuya Convert](https://github.com/ct-Open-Source/tuya-convert) - Provides with the means to backup the original and flash an alternative firmware

