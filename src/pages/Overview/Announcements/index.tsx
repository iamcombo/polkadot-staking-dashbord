// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { Wrapper, Item } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useStaking } from '../../../contexts/Staking';
import { useApi } from '../../../contexts/Api';
import { useUi } from '../../../contexts/UI';
import { humanNumber, planckToUnit } from '../../../Utils';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Announcement as AnnouncementLoader } from '../../../library/Loaders/Announcement';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';

export const Announcements = () => {

  const { isSyncing } = useUi();
  const { network }: any = useApi();
  const { units } = network;
  const { staking }: any = useStaking();
  const { minNominatorBond, totalNominators, maxNominatorsCount } = staking;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      }
    }
  };

  const listItem = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
    }
  };

  let nominatorCapReached = maxNominatorsCount.eq(totalNominators);

  let nominatorReachedPercentage = 0;
  if (maxNominatorsCount.gt(new BN(0)) && totalNominators.gt(new BN(0))) {
    nominatorReachedPercentage = totalNominators.div(maxNominatorsCount.div(new BN(100)));
  }

  let minNominatorBondBase = minNominatorBond.div(new BN(10 ** units));

  let announcements = [];

  // maximum nominators have been reached
  if (nominatorCapReached) {
    announcements.push({
      class: 'danger',
      title: 'Nominator Limit Has Been Reached.',
      subtitle: 'The maximum allowed nominators have been reached on the network. Please wait for available slots if you wish to nominate.',
    });
  }

  // 90% plus nominators reached - warning
  if (nominatorReachedPercentage >= 90) {
    announcements.push({
      class: 'warning',
      title: `${nominatorReachedPercentage.toFixed(2)}% of Nominator Limit Reached.`,
      subtitle: `The maximum amount of nominators has almost been reached. The nominator cap is currently ${humanNumber(maxNominatorsCount.toNumber())}.`,
    });
  }

  // minimum nominator bond
  announcements.push({
    class: 'neutral',
    title: `The minimum nominator bond is now ${minNominatorBondBase} ${network.unit}.`,
    subtitle: `The minimum bonding amount to start nominating on ${network.name} is now ${planckToUnit(minNominatorBond, units)} ${network.unit}.`,
  });

  // maximum nominators
  announcements.push({
    class: 'neutral',
    title: `The maximum nominator cap is now ${humanNumber(maxNominatorsCount.toNumber())}.`,
    subtitle: `A total of ${humanNumber(maxNominatorsCount.toNumber())} nominators can now join the ${network.name} network.`,
  })

  return (
    <SectionWrapper>
      <h2>
        Announcements
        <OpenAssistantIcon page='overview' title='Announcements' />
      </h2>
      <Wrapper>
        <motion.div variants={container} initial="hidden" animate="show" style={{ width: '100%' }}>

          {isSyncing()
            ? <AnnouncementLoader />
            : announcements.map((item, index) =>
              <Item key={`announcement_${index}`} variants={listItem}>
                <h3 className={item.class}>
                  <FontAwesomeIcon
                    icon={faBack}
                    style={{ marginRight: '0.6rem' }}
                  />
                  {item.title}
                </h3>
                <p>{item.subtitle}</p>
              </Item>
            )
          }
        </motion.div>
      </Wrapper>
    </SectionWrapper>
  );
}

export default Announcements;
