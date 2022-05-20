// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textPrimary, textSecondary, buttonPrimaryBackground, backgroundToggle } from '../../theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem 0;
`;

export const FixedContentWrapper = styled.div`
  flex-basis: 50%;
`;

export const SectionsWrapper = styled(motion.div)`
  box-sizing: border-box;
  width: 200%;
  display: flex;
  flex-flow: row nowrap;
  overflow: auto;
  position: relative;
  height: 100%;
`;

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 50%;
  flex: 1;
  padding: 0 1rem;

  .items {
    position: relative;
    box-sizing: border-box;
    margin: 0.5rem 0 0;
    border-bottom: none;
    width: auto;
    border-radius: 0.75rem;
    overflow: auto;
    z-index: 1;
    flex-grow: 1;
    width: 100%;

    h4 {
      margin: 0.2rem 0;
    }
    h2 {
      margin: 0.75rem 0;
    }
  
    .action-button {
      background: ${buttonPrimaryBackground};
      box-sizing: border-box;
      padding: 1rem;
      cursor: pointer;
      margin-bottom: 1rem;
      border-radius: 0.75rem;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      transition: all 0.15s;
      width: 100%;

      &:last-child {
        margin-bottom: 0;
      }

      h3 , p {
        text-align: left;
        margin: 0;
      }
      h3 {
        margin-bottom: 0.5rem;
      }
      > *:last-child {
        flex: 1;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
      }
      &:hover {
        background: ${backgroundToggle};
      }
      .icon {
        margin-right: 0.5rem;
      }
      p {
        color: ${textPrimary};
        font-size: 1rem;
      }
    }
  }
  .notes {
    margin-top: 1rem;
  }
`;