// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef, useEffect } from 'react';
import { pageTitleFromUri } from '../../pages';
import Heading from './Heading';
import Definition from './Items/Definition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft as faBack } from '@fortawesome/free-solid-svg-icons';
import { SectionWrapper, ListWrapper, HeaderWrapper } from './Wrappers';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useLocation } from 'react-router-dom';
import { useAssistant } from '../../contexts/Assistant';
import External from './Items/External';
import Action from './Items/Action';
import { pageFromUri } from '../../Utils';

export const Sections = (props: any) => {

  const { network }: any = useApi();
  const { pageMeta } = props;

  const { initialise, activeAccount }: any = useConnect();
  const { pathname } = useLocation();
  const assistant = useAssistant();

  // connect handler
  const connectOnClick = () => {
    // close assistant
    assistant.toggle();
    // initialise connect
    initialise();
  }

  // resources to display
  const definitions = pageMeta?.definitions ?? [];
  const external = pageMeta?.external ?? [];

  // external width patterns
  let curFlexWidth = 0;
  const flexWidths = [66, 34, 100, 50, 50,];

  // get definition
  const _innerDefinition = assistant.innerDefinition;
  let innerDefinition = {
    title: '',
    description: []
  };

  if (_innerDefinition.title !== undefined) {
    innerDefinition.title = _innerDefinition.title;
    innerDefinition.description = _innerDefinition.description;
  }

  const homeRef: any = useRef(null);
  const itemRef: any = useRef(null);

  useEffect(() => {
    assistant.setAssistantHeight(assistant.activeSection === 0
      ? homeRef.current.clientHeight
      : itemRef.current.clientHeight
    );
  }, [assistant.activeSection, assistant.open]);

  return (
    <>
      <SectionWrapper
        ref={homeRef}
        style={{ height: assistant.activeSection === 0 ? 'auto' : 0 }}>
        <HeaderWrapper>
          <div className='hold'>
            <h3>{pageTitleFromUri(pathname)} Resources</h3>
            <span>
              <button className='close' onClick={() => { assistant.closeAssistant(pageFromUri(pathname)) }}>
                Close
              </button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>

          {/* only display if accounts not yet connected */}
          {activeAccount === '' &&
            <Action
              height="120px"
              label='next step'
              title='Connect Wallet'
              subtitle={`Connect your ${network.name} accounts to start staking.`}
              onClick={connectOnClick}
            />
          }

          {/* Display definitions */}
          {definitions.length > 0 &&
            <>
              <Heading title="Definitions" />
              {definitions.map((item: any, index: number) =>
                <Definition
                  key={`def_${index}`}
                  onClick={() => {
                    assistant.setInnerDefinition(item);
                    assistant.setActiveSection(1);
                  }}
                  title={item.title}
                  description={item.description}
                />
              )}
            </>
          }

          {/* Display external */}
          {external.length > 0 &&
            <>
              <Heading title="Articles" />
              {external.map((item: any, index: number) => {

                const thisRteturn: any = <External
                  key={`ext_${index}`}
                  width={flexWidths[curFlexWidth]}
                  label={item.label}
                  title={item.title}
                  subtitle={item.subtitle}
                  url={item.url}
                />;

                curFlexWidth = curFlexWidth > (flexWidths.length - 1)
                  ? 0
                  : curFlexWidth + 1;

                return thisRteturn;
              })}
            </>
          }
        </ListWrapper>
      </SectionWrapper>

      <SectionWrapper
        ref={itemRef}
        style={{ height: assistant.activeSection === 1 ? 'auto' : 0 }}
      >
        <HeaderWrapper>
          <div className='hold'>
            <button onClick={() => assistant.setActiveSection(0)}>
              <FontAwesomeIcon
                icon={faBack}
                transform="shrink-4"
                style={{ cursor: 'pointer', marginRight: '0.3rem' }}
              /> Back
            </button>
            <span>
              <button className='close' onClick={() => { assistant.closeAssistant(pageFromUri(pathname)) }}>Close</button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>
          <h2>{innerDefinition.title}</h2>
          {innerDefinition.description.map((item, index) =>
            <p key={`inner_def_${index}`} className='definition'>
              {item}
            </p>
          )}
        </ListWrapper>
      </SectionWrapper>
    </>
  )
}

export default Sections;