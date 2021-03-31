# Shopee Coin Miner

Simple node.js script to automate shopee coin mining.

### Done Feature

- Shopee Plant (self watering, harvesting, planting, help friends)
- Shopee Checkin (auto checkin)
- Shopee Lucky Draw (auto draw)
- Shopee Poly (Boardgame)
- Shopee Live

## How to use

### Requirements

- node.js >= 10
- Rooted Android phone (emulator / smartphone) (used only once)

#### Add secrets to github action

| Key          |                              Values                              |
| ------------ | :--------------------------------------------------------------: |
| NAME         |                         shopee username                          |
| TOKEN        |                           SPC_EC token                           |
| SHOPEE_TOKEN |                           SHOPEE_TOKEN                           |
| DEVICE_ID    | one device one id, one deviceId can be used for multiple account |
| USER_ID      |                        shopee account id                         |
| LANGUAGE     |                                en                                |
| U_TOKEN      |                             USER_ID                              |
| HELP         |                        Help other people?                        |

### Setup

To find `shopeeToken` and `token` you can use `HTTPCanary` to capture shopee app data using rooted android device. Here's some quick steps:

- Install HTTPCanary
- Enable capture in HTTPCanary
- Open Shopee app
- Login using your account
- Open HTTPCanary
- Filter by host (mall.shopee.com.my)
- Find authenticated request
- Copy SPC_EC, and shopee_token in cookies

### Running

`node ./src/cron/`[command_name]

Github Action runs every 1 hour
