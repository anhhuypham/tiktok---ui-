import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import { useState } from 'react';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function Menu({ children, items = [], onChange = defaultFn }) {
   const [history, setHistory] = useState([{ data: items }]);
   const current = history[history.length - 1];
   const renderItem = () => {
      return current.data.map((item, index) => {
         const isParent = !!item.children;

         return (
            <MenuItem
               key={index}
               data={item}
               onClick={() => {
                  if (isParent) {
                     setHistory((prev) => [...prev, item.children]);
                  } else {
                     onChange(item);
                  }
               }}
            />
         );
      });
   };

   // back previous menu
   const hadleBack = () => {
      setHistory((prev) => {
         prev.splice(prev.length - 1, 1);
         return [...prev];
      });
   };

   return (
      <Tippy
         // visible
         delay={[0, 800]}
         interactive
         offset={[12, 8]}
         placement="bottom-end"
         hideOnClick="false"
         render={(attrs) => (
            <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
               <PopperWrapper className={cx('menu-popper')}>
                  {history.length > 1 && <Header title={current.title} onBack={hadleBack} />}
                  <div className={cx('menu-scroll')}>{renderItem()}</div>
               </PopperWrapper>
            </div>
         )}
         onHide={() => setHistory((prev) => prev.slice(0, 1))} //Reset to firstPage when hide Menu
      >
         {children}
      </Tippy>
   );
}

Menu.propTypes = {
   children: PropTypes.node.isRequired,
};

export default Menu;
