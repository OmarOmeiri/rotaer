import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type SwiperClass from 'swiper/types/swiper-class';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EffectCreative } from 'swiper';

type Props = {
  grabCursor?: boolean
  spaceBetween?: number,
  children: React.ReactNode
  className?: string,
  onSwiper?: (swiper: SwiperClass) => void
  styles?: {
    wrapper?: React.CSSProperties
  }
}

const Slider = ({
  grabCursor,
  spaceBetween,
  className,
  children,
  onSwiper,
  styles,
}: Props) => (
  <>
    <Swiper
        grabCursor={grabCursor}
        spaceBetween={spaceBetween}
        effect={'creative'}
        loop={true}
        onSwiper={onSwiper}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        modules={[EffectCreative]}
        className={className}
        style={styles?.wrapper}
      >
      {
          React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return (
                <SwiperSlide>
                  {
                    React.cloneElement(child, {
                      ...child.props,
                    })
                  }
                </SwiperSlide>
              );
            }
            return null;
          })
        }
    </Swiper>
  </>
);

export default Slider;
