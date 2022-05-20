// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

/*
 * SVGs 
*/
import { ReactComponent as PolkadotLogoSVG } from './img/polkadot_icon.svg';
import { ReactComponent as WestendLogoSVG } from './img/westend_icon.svg';

/*
 * Global Constants 
*/
export const URI_PREFIX = '/polkadot-staking-dashboard';
export const TITLE_DEFAULT = 'Polkadot Staking Dashboard';
export const DAPP_NAME = 'polkadot_staking_dashboard';

export const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io';
export const SELENDRA_ENDPOINT = 'wss://api-mainnet.selendra.org';
export const WESTEND_ENDPOINT = 'wss://westend-rpc.polkadot.io';
export const DEFAULT_NETWORK = 'polkadot';
export const ACTIVE_NETWORK = 'polkadot';

export const NODE_ENDPOINTS: any = {
  selendra: {
    name: 'Selendra',
    endpoint: 'wss://api-mainnet.selendra.org',
    subscanEndpoint: '',
    unit: 'SEL',
    units: 18,
    ss58: 204,
    icon: null,
    api: {
      unit: 'SEL',
      priceTicker: '',
    }
  },
  polkadot: {
    name: 'Polkadot',
    endpoint: 'wss://rpc.polkadot.io',
    subscanEndpoint: 'https://polkadot.api.subscan.io',
    unit: 'DOT',
    units: 10,
    ss58: 0,
    icon: PolkadotLogoSVG,
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    }
  },
  // westend: {
  //   name: 'Westend',
  //   endpoint: 'wss://westend-rpc.polkadot.io',
  //   subscanEndpoint: 'https://westend.api.subscan.io',
  //   unit: 'WND',
  //   units: 12,
  //   ss58: 42,
  //   icon: WestendLogoSVG,
  //   api: {
  //     unit: 'DOT',
  //     priceTicker: 'DOTUSDT',
  //   }
  // }
};

export const POLKADOT_URL = 'https://polkadot.network';

export const CONNECTION_STATUS = [
  'disconnected',
  'connecting',
  'connected',
];

export const CONNECTION_SYMBOL_COLORS: any = {
  disconnected: 'red',
  connecting: 'orange',
  connected: 'green',
}

export const PAYEE_STATUS = [
  {
    key: 'Staked',
    name: 'Back to Staking'
  }, {
    key: 'Stash',
    name: 'To Stash Account'
  }, {
    key: 'Controller',
    name: 'To Controller Account'
  }
];

export const INTERFACE_MAXIMUM_WIDTH: number = 1800;
export const SIDE_MENU_INTERFACE_WIDTH: number = 200;
export const SIDE_MENU_STICKY_THRESHOLD: number = 1175;
export const SECTION_FULL_WIDTH_THRESHOLD: number = 1050;
export const SHOW_SIDE_BAR_WIDTH_THRESHOLD: number = 800;
export const MAX_ASSISTANT_INTERFACE_WIDTH: number = 500;
export const MAX_SIDE_BAR_INTERFACE_WIDTH: number = 400;
export const GRAPH_HEIGHT = 430;

/*
 * Toggle-able services
*/
export const SERVICES = ['subscan', 'binance_spot'];

/*
 * Global messages for app components
*/
export const GLOBAL_MESSGE_KEYS = {
  CONTROLLER_NOT_IMPORTED: 'controller_not_imported'
};

/*
 * Fallback config values
*/
export const MAX_NOMINATIONS = 16;
export const BONDING_DURATION = 28;
export const SESSIONS_PER_ERA = 6;
export const MAX_NOMINATOR_REWARDED_PER_VALIDATOR = 256;
export const VOTER_SNAPSHOT_PER_BLOCK = 22500;
export const MAX_ELECTING_VOTERS = 22500;
export const EXPECTED_BLOCK_TIME = 6000;

/*
 * Misc values 
 */
export const RESERVE_AMOUNT_DOT = 0.1;
export const LIST_ITEMS_PER_PAGE = 50;
export const LIST_ITEMS_PER_BATCH = 20;

/*
 * Third party API keys and endpoints
*/

// TODO: check with Subscan should API key be public
export const API_SUBSCAN_KEY = 'd37149339f64775155a82a53f4253b27';

export const ENDPOINT_PRICE = 'https://api.binance.com/api/v3';

export const API_ENDPOINTS = {
  priceChange: `${ENDPOINT_PRICE}/ticker/24hr?symbol=`,
  subscanRewardSlash: '/api/scan/account/reward_slash',
  subscanEraStat: '/api/scan/staking/era_stat',
};