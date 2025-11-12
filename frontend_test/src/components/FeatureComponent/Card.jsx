import './Card.css'

export default function Card({ children }) {
    return (
        <div className="card w-[25%] h-[90%] ml-10 flex flex-col justify-between items-center z-5 p-[1rem]">
            {children}
        </div>
    )
}