import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React, {
  forwardRef,
  Fragment,
  useCallback,
  useRef,
  useState,
} from 'react';
import { ChartLegendIconTypes, ChartLegendItem } from './helpers';
import classes from './ChartLegend.module.css';
import { ChartLegend } from './ChartLegend';
import { colors } from '../../config/styles/colors';

type Props = {
  items: {[category: string]: ChartLegendItem[]},
  type: ChartLegendIconTypes,
  onClick: (item: ChartLegendItem) => void
}

const buttonStyle: React.CSSProperties = {
  color: colors.lightGreen,
};

export const CategorizedChartLegend = forwardRef(({
  items,
  type,
  onClick,
}: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState<string | null>(null);

  const onEnter = () => {
    if (transitionRef.current) {
      const height = transitionRef.current.scrollHeight;
      transitionRef.current.style.height = `${height}px`;
    }
  };
  const onExit = () => {
    if (transitionRef.current) {
      transitionRef.current.style.height = '0';
    }
  };

  const onBtnClick = useCallback((e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    const id = (e.target as HTMLDivElement).getAttribute('data-id');
    if (!id) return;
    if ('key' in e && e.key === 'Enter') {
      setOpened((opnd) => {
        if (opnd === id) return null;
        return id;
      });
      return;
    }
    setOpened((opnd) => {
      if (opnd === id) return null;
      return id;
    });
  }, []);

  return (
    <div className={classes.CategoryButtonWrapper} ref={ref}>
      {
      Object.entries(items).map(([category, items]) => (
        <Fragment key={category}>
          <div
            className={classes.CategoryButton}
            role='button'
            style={buttonStyle}
            aria-label={category}
            data-id={category}
            onClick={onBtnClick}
            onKeyDown={onBtnClick}
            tabIndex={0}
          >
            {category}
          </div>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={opened}
              in={opened === category}
              timeout={{
                appear: 500,
                enter: 0,
                exit: 100,
              }}
              onEnter={onEnter}
              onExit={onExit}
              nodeRef={transitionRef}
            >
              <>
                {
                  opened === category
                    ? (
                      <div
                        ref={transitionRef}
                        key={`items-${category}`}
                        className={classes.CategoryItemsWrapper}
                      >
                        {
                          <ChartLegend
                            items={items}
                            onClick={onClick}
                            type={type}
                          />
                        }
                      </div>
                    )
                    : null
                }
              </>
            </CSSTransition>
          </SwitchTransition>
        </Fragment>
      ))
    }
    </div>
  );
});
