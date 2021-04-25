import { useState, useEffect } from 'react';

function Donate(): JSX.Element{
  const [animIsLoaded, setAnimload] = useState(false);
  const extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";

  useEffect(() => {
    setTimeout(() => {
      setAnimload(true);
    }, 1500);
  }, [setAnimload]);



  return (
    <div id="donate">
      <div id="donate-donate" className={`inner-box ${extraClass}`}>
        <div className="title">حمایت</div>
        <div>
          <div className="title-info">برای حمایت از ما می تونید مبلغ دلخواهی رو به ما اهدا کنید که همچنین باعث پیشرفت ما هم میشه</div>
        </div>
      </div>
      <div id="donate-donators" className={`inner-box ${extraClass} animate__delay-1s`}>
        <div className="title">حامیان مالی</div>
      </div>
      <div id="donate-price" className={`inner-box ${extraClass} animate__delay-2s`}>
        <div className="title">جوایز</div>
      </div>
    </div>
  )
}

export default Donate;