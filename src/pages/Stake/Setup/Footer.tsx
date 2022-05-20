// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FooterWrapper } from '../Wrappers';
import { Button } from '../../../library/Button';
import { useConnect } from '../../../contexts/Connect';
import { useUi } from '../../../contexts/UI';

export const Footer = (props: any) => {

  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetupSection } = useUi();
  const setup = getSetupProgress(activeAccount);

  const { complete } = props;

  return (
    <FooterWrapper>
      <section>
        {complete
          ? <Button inline primary title="Continue" onClick={() => setActiveAccountSetupSection(setup.section + 1)} />
          : <div style={{ opacity: 0.5 }}><Button inline title="Continue" disabled /></div>
        }
      </section>
    </FooterWrapper>
  )
}

export default Footer;