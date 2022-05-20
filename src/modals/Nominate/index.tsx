// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { Wrapper } from './Wrapper';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { useConnect } from '../../contexts/Connect';
import { Warning } from '../../library/Form/Warning';
import { Separator } from '../Wrappers';
import { useStaking } from '../../contexts/Staking';
import { planckBnToUnit } from '../../Utils';

export const Nominate = () => {

  const { api, network }: any = useApi();
  const { activeAccount } = useConnect();
  const { targets, staking } = useStaking();
  const { getBondedAccount, getAccountLedger }: any = useBalances();
  const { setStatus: setModalStatus }: any = useModal();
  const { units } = network;
  const { minNominatorBond } = staking;
  const controller = getBondedAccount(activeAccount);
  const { nominations } = targets;
  const ledger = getAccountLedger(controller);
  const { active } = ledger;

  let activeBase = planckBnToUnit(active, units);
  let minNominatorBondBase = planckBnToUnit(minNominatorBond, units);

  // valid to submit transaction
  const [valid, setValid]: any = useState(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0 && activeBase >= minNominatorBondBase)
  }, [targets]);

  // tx to submit
  const tx = () => {
    let tx = null;
    if (!valid) {
      return tx;
    }
    let targetsToSubmit = nominations.map((item: any,) => {
      return ({
        Id: item.address
      });
    });
    tx = api.tx.staking.nominate(targetsToSubmit);
    return tx;
  }

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {
    }
  });

  // warnings
  let warnings = [];
  if (!nominations.length) {
    warnings.push('You have no nominations set.');
  }
  if (activeBase < minNominatorBondBase) {
    warnings.push(`You do not meet the minimum nominator bond of ${minNominatorBondBase} ${network.unit}. Please bond some funds before nominating.`);
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform='grow-2' icon={faPlayCircle} />
        Nominate
      </HeadingWrapper>
      <div style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}>
        {warnings.map((text: any, index: number) =>
          <Warning text={text} />
        )}
        <h2>You Have {nominations.length} Nomination{nominations.length === 1 ? `` : `s`}</h2>
        <Separator />
        <div className='notes'>
          <p>Once submitted, you will start nominating your chosen validators.</p>
          <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
        </div>
        <FooterWrapper>
          <div>
            <button className='submit' onClick={() => submitTx()} disabled={!valid || submitting}>
              <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp as IconProp} />
              Submit
            </button>
          </div>
        </FooterWrapper>
      </div>
    </Wrapper>
  )
}

export default Nominate;