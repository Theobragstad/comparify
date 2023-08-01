import React, { Suspense } from 'react';


const Spline = React.lazy(() => import('@splinetool/react-spline'));

export default function Animation() {
  return (
    <div>
         <Suspense fallback={<div></div>}>
         <Spline scene="https://prod.spline.design/9GnnxPg3NnntVq3C/scene.splinecode" className="animation" style={{zIndex:'999999999 !important'}}/>
      </Suspense>
    </div>
  );
}
