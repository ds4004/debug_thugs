// components/levelButtons.js
import Link from "next/link"
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faCheck, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { Center } from "@chakra-ui/layout";

const levelButtons = () => {
    const router = useRouter();
    const { id } = router.query;
    const levels = [1, 2, 3, 4];
    console.log(id)

    return (
        <main className="practice-container">
            <div className="button-challange-container">
            <h1 className="text-[70px] mb-5 text-white" style={{textAlign: 'center'}}>Pratice Yourself!</h1>
                {levels.map(level => (
                    level < id ? (
                        <Link key={level} href={`/level/${level}`}>
                            <button className="level-button level-button-completed">
                                Level-{`${level}` + "  "}
                                <FontAwesomeIcon icon={faCircleCheck} />
                            </button>
                        </Link>
                    ) : level == id ? (
                        <Link key={level} href={`/level/${level}`}>
                            <button className="level-button">Level-{`${level}`}</button>
                        </Link>
                    ) : (
                        <button className="level-button level-disable-button" disabled>
                            Level-{`${level}` + "  "}
                            <FontAwesomeIcon icon={faLock} />
                        </button>

                    )
                ))}
            </div>
        </main>
    )
}

export default levelButtons
