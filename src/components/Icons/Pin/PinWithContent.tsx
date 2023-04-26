export const PinWithContent = ({
  withArrow = true,
  children,
}:{
  withArrow?: boolean,
  children: React.ReactNode
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 384 501.8" xmlSpace="preserve">
    {
      withArrow
        ? (
          <>
            <path fill="currentColor" d="M342,310.3c-12.9,16.4-63.8,60.9-151,61.8c-87.2-0.9-136.1-45.5-149-61.8l137.8,185.4c6.1,8.1,18.2,8.1,24.3,0L342,310.3z"/>
          </>
        )
        : null
    }
    <path fill="currentColor" stroke="none" d="M192,1.1C86.5,1.1,1.1,86.5,1.1,192S86.5,382.9,192,382.9S382.9,297.5,382.9,192S297.5,1.1,192,1.1z M192,342c-82.8,0-150-67.2-150-150S109.2,42,192,42s150,67.2,150,150S274.8,342,192,342z"/>
    <foreignObject style={{ clipPath: 'circle(150px)' }} id='hahaha' x={(384 - 300) / 2} y={(384 - 300) / 2} width="300" height="300">
      {children}
    </foreignObject>
  </svg>

);
