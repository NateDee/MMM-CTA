# MMM-CTA

![Example of MMM-CTA](./example_picture_CTA.png)

This MagicMirror Module is designed to display incoming bus and train times for the CTA (Chicago Transit Authority).  The module will display up to the minute data for bus and train arrival times.

##Get your CTA API keys!

You need to obtain API keys to access the live data to update your mirror:
Bus API:  http://www.transitchicago.com/developers/bustracker.aspx
Train API:  http://www.transitchicago.com/developers/traintrackerapply.aspx

The bus tracker API key can be obtained immediately, the train tracker key can take a few days to register.  Please reference this github since it's already approved maybe it will help speed things along for you.

## Installation

In your terminal, go to your MagicMirror's Module folder:

```bash
cd ~/MagicMirror/modules
```
Clone this repository:
```bash
git clone https://github.com/NateDee/MMM-CTA.git
```
Configure the module in your config.js file.

##

##Using the module

To use this module, add it to the modules array
