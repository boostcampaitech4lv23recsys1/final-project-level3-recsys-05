import styled from "styled-components";

function StarRate(props) {
    const STAR_IDX_ARR = ['first', 'second', 'third', 'fourth', 'last'];
    const avgrate = props.star * 20;
    const calcStarRates = () => {
        let tempStarRatesArr = [0, 0, 0, 0, 0];
        let starVerScore = avgrate * 70 / 100;
        let idx = 0;
        while (starVerScore > 14) {
            tempStarRatesArr[idx] = 14;
            idx += 1;
            starVerScore -= 14;
        }
        tempStarRatesArr[idx] = starVerScore;
        return tempStarRatesArr;
    };
    const ratesResArr = calcStarRates();
    const id = props.id;

    return (
        <StarRateWrap className="star">
            {STAR_IDX_ARR.map((item, idx) => {
                return ( 
                <span className='star_icon' key={`${item}_${idx}_${id}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='20' viewBox='0 0 14 14' fill='#cacaca'>
                        <clipPath id={`${item}_${id}_StarClip`}>
                            <rect width={`${ratesResArr[idx]}`} height='39' />
                        </clipPath>
                        <path
                            id={`${item}_${id}_Star`}
                            d='M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z'
                            transform='translate(-2 -2)'
                        />
                        <use clipPath={`url(#${item}_${id}_StarClip)`} href={`#${item}_${id}_Star`} fill='#ff6f61'
                        />
                    </svg>
                </span>
                )
            })
            }
        </StarRateWrap>
    )
}

export default StarRate;

const StarRateWrap = styled.div`
        display: flex;
        align-items: center;
        width: 100%;
        margin: auto;
        .star_icon {
          display: inline-flex;
          margin-right: 5px;
        }
      
`