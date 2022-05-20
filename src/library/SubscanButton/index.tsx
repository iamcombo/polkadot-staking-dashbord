// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { useUi } from '../../contexts/UI';
import { useTheme } from '../../contexts/Themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { defaultThemes } from '../../theme/default';

const Wrapper = styled.div <any>`
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 0.9rem;
  font-variation-settings: 'wght' 570;
  background: ${props => props.background};
  border-radius: 0.3rem;
  padding: 0.25rem 0.4rem;
  color: ${props => props.color};;
  opacity: 0.8;
`;

export const SubscanButton = () => {

  const { mode } = useTheme();
  const { services } = useUi();

  return (
    <Wrapper
      color={
        services.includes('subscan')
          ? defaultThemes.text.invert[mode]
          : defaultThemes.text.secondary[mode]
      }
      background={
        services.includes('subscan')
          ? defaultThemes.primary[mode]
          : defaultThemes.background.label[mode]
      }
    >
      <FontAwesomeIcon
        icon={faProjectDiagram}
        transform="shrink-2"
        style={{ marginRight: '0.3rem', }}
      />
      Subscan
    </Wrapper>
  )
}

export default SubscanButton;