// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { useConnect } from './Connect';
import { useNetworkMetrics } from './Network';
import { useStaking } from './Staking';
import { useValidators } from './Validators/Validators';
import { useBalances } from './Balances';
import { useApi } from './Api';
import { SERVICES, SIDE_MENU_STICKY_THRESHOLD } from '../constants';
import { localStorageOrDefault } from '../Utils';

export interface UIContextState {
  setSideMenu: (v: number) => void;
  setUserSideMenuMinimised: (v: number) => void;
  setListFormat: (v: string) => void;
  orderValidators: (v: string) => void;
  applyValidatorOrder: (l: any, o: string) => any;
  applyValidatorFilters: (l: any, k: string, f?: any) => void;
  toggleFilterValidators: (v: string, l: any) => void;
  isSyncing: () => any;
  toggleService: (k: string) => void;
  getSetupProgress: (a: string) => any;
  setActiveAccountSetup: (p: any) => any;
  setActiveAccountSetupSection: (s: number) => void;
  getServices: () => void;
  sideMenuOpen: number;
  userSideMenuMinimised: number;
  sideMenuMinimised: number;
  listFormat: string;
  services: any;
  validatorFilters: any;
  validatorOrder: string;
}

export const UIContext: React.Context<UIContextState> = React.createContext({
  setSideMenu: (v: number) => { },
  setUserSideMenuMinimised: (v: number) => { },
  setListFormat: (v: string) => { },
  orderValidators: (v: string) => { },
  applyValidatorOrder: (l: any, o: string) => { },
  applyValidatorFilters: (l: any, k: string, f?: any) => { },
  toggleFilterValidators: (v: string, l: any) => { },
  isSyncing: () => false,
  toggleService: (k: string) => { },
  getSetupProgress: (a: string) => { },
  setActiveAccountSetup: (p: any) => { },
  setActiveAccountSetupSection: (s: number) => { },
  getServices: () => { },
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  listFormat: 'col',
  services: SERVICES,
  validatorFilters: [],
  validatorOrder: 'default',
});

export const useUi = () => React.useContext(UIContext);

export const UIProvider = (props: any) => {

  const { isReady, consts, network }: any = useApi();
  const { accounts: connectAccounts, activeAccount } = useConnect();
  const { staking, eraStakers }: any = useStaking();
  const { meta, session } = useValidators();
  const { maxNominatorRewardedPerValidator } = consts;
  const { metrics }: any = useNetworkMetrics();
  const { accounts }: any = useBalances();

  // get services config from local storage
  let _services: any = localStorageOrDefault('services', SERVICES, true);

  // get side menu minimised state from local storage, default to not
  let _userSideMenuMinimised: any = Number(localStorageOrDefault('side_menu_minimised', 0));

  // side menu control
  const [sideMenuOpen, setSideMenuOpen] = useState(0);

  // side menu minimised
  const [userSideMenuMinimised, _setUserSideMenuMinimised] = useState(_userSideMenuMinimised);
  const userSideMenuMinimisedRef = useRef(userSideMenuMinimised);
  const setUserSideMenuMinimised = (v: number) => {
    localStorage.setItem('side_menu_minimised', String(v));
    userSideMenuMinimisedRef.current = v;
    _setUserSideMenuMinimised(v);
  }

  // automatic side menu minimised
  const [sideMenuMinimised, setSideMenuMinimised] = useState(
    window.innerWidth <= SIDE_MENU_STICKY_THRESHOLD ? 1 : userSideMenuMinimisedRef.current
  );

  // global list format
  const [listFormat, _setListFormat] = useState('col');

  // services
  const [services, _setServices] = useState(_services);
  const servicesRef = useRef(services);
  const setServices = (v: any) => {
    servicesRef.current = v;
    _setServices(v);
  }

  // validator filtering
  const [validatorFilters, setValidatorFilters]: any = useState([]);

  // validator ordering
  const [validatorOrder, setValidatorOrder]: any = useState('default');

  // staking setup persist
  const [setup, setSetup]: any = useState([]);

  // resize side menu callback
  const resizeCallback = () => {
    if (window.innerWidth <= SIDE_MENU_STICKY_THRESHOLD) {
      setSideMenuMinimised(0);
    } else {
      setSideMenuMinimised(userSideMenuMinimisedRef.current);
    }
  }

  // resize event listener
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return (() => {
      window.removeEventListener("resize", resizeCallback);
    })
  }, []);

  // re-configure minimised on user change
  useEffect(() => {
    resizeCallback();
  }, [userSideMenuMinimised]);

  // update setup state when activeAccount changes
  useEffect(() => {
    if (connectAccounts.length) {
      const _setup = setupDefault();
      setSetup(_setup);
    }
  }, [activeAccount, network, connectAccounts]);

  const setSideMenu = (v: number) => {
    setSideMenuOpen(v);
  }

  const setListFormat = (v: string) => {
    _setListFormat(v);
  }

  const setValidatorsOrder = (by: string) => {
    setValidatorOrder(by);
  }

  const setValidatorsFilter = (filter: any) => {
    setValidatorFilters(filter);
  }

  // Validator list filtering functions

  const toggleFilterValidators = (f: string) => {
    let filter = [...validatorFilters];
    let action = filter.includes(f) ? 'remove' : 'push';

    if (action === 'remove') {
      let index = filter.indexOf(f);
      filter.splice(index, 1);
    } else {
      filter.push(f);
    }
    setValidatorsFilter(filter);
  }

  const applyValidatorFilters = (list: any, batchKey: string, filter: any = validatorFilters) => {

    if (filter.includes('all_commission')) {
      list = filterAllCommission(list);
    }
    if (filter.includes('blocked_nominations')) {
      list = filterBlockedNominations(list);
    }
    if (filter.includes('over_subscribed')) {
      list = filterOverSubscribed(list, batchKey);
    }
    if (filter.includes('missing_identity')) {
      list = filterMissingIdentity(list, batchKey);
    }
    if (filter.includes('inactive')) {
      list = filterInactive(list);
    }
    return list;
  }

  const filterMissingIdentity = (list: any, batchKey: string) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    let filteredList: any = [];
    for (let validator of list) {
      let addressBatchIndex = meta[batchKey].addresses?.indexOf(validator.address) ?? -1;

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1) {
        filteredList.push(validator);
        continue;
      }

      let identities = meta[batchKey]?.identities ?? [];
      let supers = meta[batchKey]?.supers ?? [];

      // push validator if sync has not completed
      if (!identities.length || !supers.length) {
        filteredList.push(validator);
      }

      let identityExists = identities[addressBatchIndex] ?? null;
      let superExists = supers[addressBatchIndex] ?? null;

      // validator included if identity or super identity has been set
      if (identityExists !== null || superExists !== null) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  }

  const filterOverSubscribed = (list: any, batchKey: string) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    let filteredList: any = [];
    for (let validator of list) {
      let addressBatchIndex = meta[batchKey].addresses?.indexOf(validator.address) ?? -1;

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1) {
        filteredList.push(validator);
        continue;
      }
      let stake = meta[batchKey]?.stake ?? false;
      if (!stake) {
        filteredList.push(validator);
        continue;
      }
      let totalNominations = stake[addressBatchIndex].total_nominations ?? 0;
      if (totalNominations < maxNominatorRewardedPerValidator) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  }

  const filterAllCommission = (list: any) => {
    list = list.filter((validator: any) => validator?.prefs?.commission !== 100);
    return list;
  }

  const filterBlockedNominations = (list: any) => {
    list = list.filter((validator: any) => validator?.prefs?.blocked !== true);
    return list;
  }

  const filterInactive = (list: any) => {
    // if list has not yet been populated, return original list
    if (session.list.length === 0) {
      return list;
    }
    list = list.filter((validator: any) => session.list.includes(validator.address));
    return list;
  }

  // Validator list ordering functions

  const orderValidators = (by: string) => {
    let order = validatorOrder === by
      ? 'default'
      : by;
    setValidatorsOrder(order);
  }

  const applyValidatorOrder = (list: any, order: string) => {
    if (order === 'commission') {
      return orderLowestCommission(list);
    }
    return list;
  }

  const orderLowestCommission = (list: any) => {
    let orderedList = [...list].sort((a: any, b: any) => (a.prefs.commission - b.prefs.commission));
    return orderedList;
  }

  /*
   * Helper function to determine whether the dashboard is still
   * fetching remote data.
   */
  const isSyncing = () => {

    // api not ready
    if (!isReady) {
      return true;
    }

    // staking metrics have synced
    if (staking.lastReward === new BN(0)) {
      return true;
    }

    // era has synced from Network
    if (metrics.activeEra.index === 0) {
      return true;
    }

    // all accounts have been synced
    if (accounts.length < connectAccounts.length) {
      return true;
    }

    // eraStakers has synced
    if (!eraStakers.activeNominators) {
      return true;
    }

    return false;
  }

  // Setup helper functions

  const PROGRESS_DEFAULT = {
    controller: null,
    payee: null,
    nominations: [],
    bond: 0,
    section: 1,
  };

  /* 
   * Generates the default setup objects or the currently
   * connected accounts.
   */
  const setupDefault = () => {

    // generate setup objects from connected accounts
    const _setup = connectAccounts.map((item: any) => {

      // if there is existing config for an account, use that.
      const localSetup = localStorage.getItem(`${network.name.toLowerCase()}_stake_setup_${item.address}`);

      // otherwise use the default values.
      const progress = localSetup !== null
        ? JSON.parse(localSetup)
        : PROGRESS_DEFAULT;

      return {
        address: item.address,
        progress: progress,
      }
    });
    return _setup;
  }

  /*
   * Gets the setup progress for a connected account.
   */
  const getSetupProgress = (address: string) => {

    // find the current setup progress from `setup`.
    const _setup = setup.find((item: any) => item.address === address);

    if (_setup === undefined) {
      return PROGRESS_DEFAULT;
    }
    return _setup.progress;
  }

  /*
   * Sets setup progress for an address
   */
  const setActiveAccountSetup = (progress: any) => {

    // update local storage setup
    localStorage.setItem(`${network.name.toLowerCase()}_stake_setup_${activeAccount}`, JSON.stringify(progress));

    // update context setup
    const _setup = setup.map((obj: any) =>
      obj.address === activeAccount ? {
        ...obj,
        progress: progress
      } : obj
    );

    setSetup(_setup);
  }

  /*
   * Sets active setup section for an address
   */
  const setActiveAccountSetupSection = (section: number) => {

    // get current progress
    const _accountSetup = [...setup].find((item: any) => item.address === activeAccount);

    // abort if setup does not exist
    if (_accountSetup === null) {
      return;
    }
    // amend section
    _accountSetup.progress.section = section;

    // update context setup
    const _setup = setup.map((obj: any) => obj.address === activeAccount ? _accountSetup : obj);

    // update local storage
    localStorage.setItem(`${network.name.toLowerCase()}_stake_setup_${activeAccount}`, JSON.stringify(_accountSetup.progress));

    // update context
    setSetup(_setup);
  }

  /*
   * Service toggling 
   */
  const toggleService = (key: string) => {

    let _services: any = [...services];
    let found = _services.find((item: any) => item === key);

    if (found) {
      _services = _services.filter((_s: any) => _s !== key);
    } else {
      _services.push(key);
    }

    localStorage.setItem('services', JSON.stringify(_services));
    setServices(_services);
  }

  const getServices = () => {
    return servicesRef.current;
  }

  return (
    <UIContext.Provider value={{
      setSideMenu: setSideMenu,
      setUserSideMenuMinimised: setUserSideMenuMinimised,
      setListFormat: setListFormat,
      orderValidators: orderValidators,
      applyValidatorOrder: applyValidatorOrder,
      applyValidatorFilters: applyValidatorFilters,
      toggleFilterValidators: toggleFilterValidators,
      isSyncing: isSyncing,
      toggleService: toggleService,
      getSetupProgress: getSetupProgress,
      setActiveAccountSetup: setActiveAccountSetup,
      setActiveAccountSetupSection: setActiveAccountSetupSection,
      getServices: getServices,
      sideMenuOpen: sideMenuOpen,
      userSideMenuMinimised: userSideMenuMinimisedRef.current,
      sideMenuMinimised: sideMenuMinimised,
      listFormat: listFormat,
      validatorFilters: validatorFilters,
      validatorOrder: validatorOrder,
      services: servicesRef.current,
    }}>
      {props.children}
    </UIContext.Provider>
  );
}