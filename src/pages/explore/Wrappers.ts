// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textSecondary, } from '../../theme';

export const Wrapper = styled.div`
  h2 {
    color: ${textSecondary};
    margin-top: 2rem;
  }
`;
export const ItemsWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

export const Item = styled(motion.button)`
  width: 200px;
  height: 200px;
  background: rgba(0,0,0,0.03);
  color: ${textSecondary};
  margin: 1rem 2rem 1rem 0;
  border-radius: 0.75rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;