export default function Discount({card}) {
    return (
        <div className="card w-[360px] flex flex-col items-center justify-center bg-slate-50">
            <img src={card.src} alt="할인 아이콘" className="" />
            <div className=" w-full flex flex-col items-start">
                <h2 className="font-bold text-2xl">{card.h2}</h2>
                <h3 className>{card.h3}</h3>
                <p>{card.p}</p>
            </div>
        </div>
    )
}