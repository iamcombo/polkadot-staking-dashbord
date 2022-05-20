// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { useOutsideAlerter } from '../../library/Hooks';

export const Dropdown = (props: any) => {

  const { toggleMenu, items } = props;

  const ref = useRef(null);
  useOutsideAlerter(ref, () => {
    toggleMenu(false);
  }, ['dropdown-toggle']);

  return (
    <ul className='accounts' ref={ref}>
      {items}
    </ul>
  )
}

export default Dropdown;