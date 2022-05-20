// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useConnect } from '../../contexts/Connect';
import { ReactComponent as TalismanSVG } from '../../img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from '../../img/dot_icon.svg';
import { web3Enable } from '@polkadot/extension-dapp';
import { DAPP_NAME } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Separator } from './Wrapper';

export const Wallets = (props: any) => {

  const { setSection } = props;

  const {
    activeWallet,
    activeAccount,
    walletErrors,
    connectToWallet,
    disconnectFromWallet,
  }: any = useConnect();

  let { accounts } = useConnect();

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  // store supported extensions
  const [extensions, setExtensions]: any = useState([]);

  // load supported wallets
  useEffect(() => {
    fetchExtensions();
  }, [activeWallet]);

  const fetchExtensions = async () => {
    const allInjected = await web3Enable(DAPP_NAME);
    setExtensions(allInjected);
  }

  const handleWalletConnect = async (name: string) => {
    if (activeWallet !== name) {
      await connectToWallet(name);
    }
    setSection(1);
  }

  // remove active wallet from extensions list
  const activeExtension = extensions.find((wallet: any) => wallet.name === activeWallet) ?? null;
  const extensionsList = extensions.filter((wallet: any) => wallet.name !== activeWallet);

  return (
    <>
      <h2>Select Wallet</h2>

      {activeWallet !== null &&
        <button className='item' onClick={() => disconnectFromWallet()}>
          <div>
            {activeWallet === 'talisman' && <TalismanSVG width='1.5rem' height='1.5rem' />}
            {activeWallet === 'polkadot-js' && <PolkadotJSSVG width='1.5rem' height='1.5rem' />}
            &nbsp; {activeWallet}
          </div>
          <div className='danger'>Disconnect</div>
        </button>
      }
      <Separator />

      {activeExtension !== null &&
        <button className='item'
          key={`wallet_${activeExtension.name}`}
          onClick={() => handleWalletConnect(activeExtension.name)}
        >
          <div>
            {activeExtension.name === 'talisman' && <TalismanSVG width='1.5rem' height='1.5rem' />}
            {activeExtension.name === 'polkadot-js' && <PolkadotJSSVG width='1.5rem' height='1.5rem' />}
            &nbsp; {activeExtension.name}
          </div>
          <div className='neutral'>
            {activeWallet === activeExtension.name && 'Accounts'}
            <FontAwesomeIcon icon={faChevronRight} transform="shrink-5" className='icon' />
          </div>
        </button>
      }

      {extensionsList.map((wallet: any) => {
        const error = walletErrors[wallet.name] ?? null;
        const disabled = activeWallet !== wallet.name && activeWallet !== null;

        return (
          <button className='item'
            key={`wallet_${wallet.name}`}
            disabled={disabled}
            onClick={() => handleWalletConnect(wallet.name)}
          >
            <div>
              {wallet.name === 'talisman' && <TalismanSVG width='1.5rem' height='1.5rem' />}
              {wallet.name === 'polkadot-js' && <PolkadotJSSVG width='1.5rem' height='1.5rem' />}
              &nbsp; {error ? error : wallet.name}
            </div>
            <div className='neutral'>
              <FontAwesomeIcon icon={faChevronRight} transform="shrink-5" className='icon' />
            </div>
          </button>
        )
      })}
    </>
  )
}
