// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrapper';
import Identicon from '../Identicon';
import { clipAddress } from '../../Utils';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export const PoolInner = (props: any) => {

  const { initial, pool } = props;
  const { memberCounter, addresses, id } = pool;

  return (
    <Wrapper>
      <div>
        <h3>{id}</h3>
        <Identicon value={addresses.stash} size={26} />

        {initial
          ? <motion.div
            className='identity'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4>{clipAddress(addresses.stash)}</h4>
          </motion.div>
          :
          <div className='identity'>
            <h4>{clipAddress(addresses.stash)}</h4>
          </div>
        }

        <div className='labels'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            <label>
              <FontAwesomeIcon icon={faUsers} />
              &nbsp; {memberCounter}
            </label>
          </motion.div>
        </div>
      </div>
    </Wrapper>
  )
}

export class Pool extends React.Component<any, any> {

  render () {
    return (<PoolInner {...this.props} />)
  }
}

export default Pool;